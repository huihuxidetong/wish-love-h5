<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>banner管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px">
      <el-row>
        <el-input v-model="querys.title" placeholder="请输banner名称" style="width:200px;"></el-input>
        <el-date-picker
          v-model="querys.updateTime"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
        <el-button icon="el-icon-search" @click="queryBanner" circle></el-button>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-button type="primary"@click="toAdd()" v-if="hasPerm('banner:edit','bannerfile:edit')">新增</el-button>
      </el-row>
      <el-table
        :data="tableData"
        stripe
        v-loading="loading"
        style="width: 100%;margin-top: 15px">
        <el-table-column
          prop="bannerCode"
          label="banner编号"
        >
        </el-table-column>
        <el-table-column  prop="title" label="banner名称"  >
        </el-table-column>
        <el-table-column label="banner图片" prop="src">
          <template slot-scope="scope">
            <el-popover width="200" trigger="click">
              <img :src="imgUrl+'/'+ scope.row.src" width="200"/>
              <el-button slot="reference">查看</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="link"
          label="跳转地址"
        >
        </el-table-column>

        <el-table-column
          prop="sort"
          label="排序"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="300"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEdit(scope.row)"  v-if="hasPerm('banner:edit','bannerfile:edit')">编辑</el-button>
            <el-button type="text" size="small" @click="deleteObj(scope.row.id)"  v-if="hasPerm('banner:delete')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="10"
        :current-page.sync="pageNum"
        layout="total, prev, pager, next"
        @current-change="queryCommodity('page')"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="banner编辑" :visible.sync="dialogFormVisible">
      <el-form :model="banner"  ref="ruleForm" :rules="rules">
        <el-form-item label="banner名称" prop="title">
          <el-input v-model="banner.title"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" :label-width="formLabelWidth" prop="pictures">
          <el-upload
            ref="upload"
            :file-list="bannerFileList"
            :action="uploadUrl()"
            accept="image/png,image/gif,image/jpg,image/jpeg"
            list-type="picture-card"
            :limit=limitNum
            :auto-upload="false"
            :on-exceed="handleExceed"
            :before-upload="handleBeforeUpload"
            :on-preview="handlePictureCardPreview"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
        </el-form-item>
        <el-form-item label="跳转链接" prop="link">
          <el-input v-model="banner.link"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="banner.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm(1)">取 消</el-button>
        <el-button type="primary" @click="submitBanner()" v-loading.fullscreen.lock="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {queryBannerList,saveUpdateBanner,bannerDelete} from '../api/api'
  import {ALIYUN_IMG_URL} from '../api/url'
  import {BANNER_UPLOADIMAGE} from '../api/url'
  import {isEmpty} from '../util/utils'
  import base from './base.vue'
  export default {
    extends: base,
    data() {
      return {
        querys: {
          title: "",
          updateTime:"",
        },
        bannerFileList:[],
        dictionaryList:[],
        dialogImageUrl: '',
        dialogVisible: false,
        formLabelWidth: '80px',
        limitNum: 1,
        form: {},
        tableData: [],
        total: 0,
        pageNum: 1,
        loading: false,
        imgUrl: ALIYUN_IMG_URL,
        dialogFormVisible: false,
        submitLoading:false,
        rules: {
          link: [
            {required: true, message: '请输入banner跳转链接'}
          ],
          src: [
            {required: true, message: '请上banner图片地址'}
          ],
          sort: [
            {required: true, message: '请输入banner排序'}
          ],
        },
        banner: {
          title:"",
          link: "",
          src: "",
          sort: "",
          etag:""
        },
      }
    },
    mounted(){
      this.queryBanner();
    },
    methods: {
      queryBanner(type){
        this.loading = true;
        const dataCondition = [];
        if(isEmpty(type)){
          this.pageNum=1;
        };
        const obj = {
          pageInfo: {
            pageNum: this.pageNum,
            pageSize: 10
          },
          param: {
            oredCriteria: [
              {
                criteria: dataCondition
              }
            ]
          }
        };
        const json = JSON.stringify(obj);
        const that = this;
        queryBannerList(json).then((res) => {
          that.loading = false;
          if (res.status == 200) {
            that.tableData = res.data;
            that.total = res.data.total;
            that.pageNum = res.data.pageNum;
          } else {
            that.$message.error(res.msg);
          }
        });

      },
      confirmEmp(type){
        var that=this;
        const json=JSON.stringify(that.banner);
        that.submitLoading=true;
        saveUpdateBanner(json).then((res)=>{
          that.submitLoading=false;
          if(res.status==200){
            that.resetForm(type);
            that.queryBanner();
          }else{
            that.$message.error(res.msg);
          }
        })
      },
      submitBanner(){
        var that=this;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            that.confirmEmp(1);
          } else {
            return false;
          }
        });
      },
      resetForm(type){
        if(type==1){
          this.dialogFormVisible=false;
          this.$refs.ruleForm.resetFields();
        }
        this.banner=Object.assign({},resetObj.banner);
      },
      deleteObj(id){
        var that=this;
        bannerDelete(id).then((res)=>{
          if(res.status==200){
            that.queryBanner();
          }else{
            that.$message.error(res.msg);
          }
        })
      },
      toAdd(){
        this.dialogFormVisible=true;
      },
      toEdit(obj){
        this.banner=JSON.parse(JSON.stringify(obj));
        this.bannerFileList.push({"id":this.banner.src.id,"name":this.banner.src,url: ALIYUN_IMG_URL + "/"+ this.banner.src});
        this.dialogFormVisible=true;
      },
      // 上传文件之前的钩子
      handleBeforeUpload(file){
        console.log('before')
        if(!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
          this.$notify.warning({
            title: '警告',
            message: '请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片'
          })
        }
        let size = file.size / 1024 / 1024 / 2
        if(size > 2) {
          this.$notify.warning({
            title: '警告',
            message: '图片大小必须小于2M'
          })
        }
      },
      // 文件超出个数限制时的钩子
      handleExceed(files, fileList) {
      },
      // 文件列表移除文件时的钩子
      handleRemove(file, fileList) {
        for(var i = 0 ; i < this.files.length ; i++){
          if(JSON.parse(this.files[i]).id == file.id){
            this.files.splice(i,1);
          }
        }
      },
      // 点击文件列表中已上传的文件时的钩子
      handlePictureCardPreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl = file.url;
      },
      handleAvatarSuccess(response) {
        console.log(response);
        this.banner.src = response.data.fileName;
        this.banner.etag = response.data.etag;
      },
      uploadFile() {
        this.$refs.upload.submit()
      },
      uploadUrl:function(){
        return "/web/"+ BANNER_UPLOADIMAGE;
      },
    },
  }
  var resetObj={
    banner: {
      title:"",
      link: "",
      src: "",
      sort: "",
      id:"",
      eTag:""
    }
  }
</script>

<style>
</style>
