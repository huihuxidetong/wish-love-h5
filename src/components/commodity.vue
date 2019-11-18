<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px">
      <el-row>
        <el-input v-model="querys.code" placeholder="请输商品编号" style="width:200px;"></el-input>
        <el-input v-model="querys.title" placeholder="请输商品名称" style="width:200px;"></el-input>
        <el-date-picker
          v-model="querys.updateTime"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
        <el-button icon="el-icon-search" @click="queryCommodity" circle></el-button>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-button type="primary"@click="toAdd()" v-if="hasPerm('employee:edit','commodityfile:edit')">新增</el-button>
      </el-row>
      <el-table
        :data="tableData"
        stripe
        v-loading="loading"
        style="width: 100%;margin-top: 15px">
        <el-table-column
          prop="code"
          label="商品编号"
        >
        </el-table-column>
        <el-table-column  prop="title" label="商品名称"  >
        </el-table-column>
        <el-table-column
          label="商品图片"
        >
          <template slot-scope="scope">
            <el-popover width="200" trigger="click">
              <img v-for="item in scope.row.commodityFileList" :src="imgUrl+'/'+ item.fileName" width="200"/>
              <el-button slot="reference">查看</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="sellPrice"
          label="价格"
        >
        </el-table-column>

        <el-table-column
          prop="unitName"
          label="单位"
        >
        </el-table-column>

        <el-table-column
          prop="statusName"
          label="状态"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="300"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEdit(scope.row)"  v-if="hasPerm('commodity:edit','commodityfile:edit')">编辑</el-button>
            <el-button type="text" size="small" @click="deleteObj(scope.row.id)"  v-if="hasPerm('commodity:delete')">删除</el-button>
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
    <el-dialog title="商品编辑" :visible.sync="dialogFormVisible">
      <el-form :model="commodity"  ref="ruleForm" :rules="rules">
        <el-form-item label="图片集合" hidden prop="title">
          <el-input v-model="commodity.title"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="commodity.title"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" :label-width="formLabelWidth" prop="pictures">
          <el-upload
            ref="upload"
            :action="uploadUrl()"
            accept="image/png,image/gif,image/jpg,image/jpeg"
            list-type="picture-card"
            :file-list="commodityFileList"
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
        <el-form-item label="价格" prop="sellPrice">
          <el-input v-model="commodity.sellPrice"></el-input>
        </el-form-item>

        <template>
          <el-form-item label="单位" prop="unit">
            <el-select v-model="commodity.unit" filterable placeholder="请选择">
              <el-option
                v-for="item in dictionaryList"
                :key="item.subTypeCode"
                :label="item.subTypeName"
                :value="item.subTypeCode">
              </el-option>
            </el-select>
          </el-form-item>
        </template>

        <el-form-item label="库存" prop="stock">
          <el-input v-model="commodity.stock"></el-input>
        </el-form-item>
        <el-form-item label="最小购买数量" prop="minbuy">
          <el-input v-model="commodity.minbuy"></el-input>
        </el-form-item>
        <el-form-item label="最大购买数量" prop="maxbuy">
          <el-input v-model="commodity.maxbuy"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm(1)">取 消</el-button>
        <el-button type="primary" @click="submitCommodity()" v-loading.fullscreen.lock="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getCommodityList, saveUpdateCommodity, commodityDelete, getDictionaryList} from '../api/api'
  import {ALIYUN_IMG_URL} from '../api/url'
  import {COMMODITY_UPLOADIMAGE} from '../api/url'
  import {TYPE_CODE_COMMODITY_UNIT} from '../api/constant'
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
        files:[],
        commodityFileList:[],
        dictionaryList:[],
        dialogImageUrl: '',
        dialogVisible: false,
        formLabelWidth: '80px',
        limitNum: 10,
        form: {},
        tableData: [],
        total: 0,
        pageNum: 1,
        loading: false,
        imgUrl: ALIYUN_IMG_URL,
        dialogFormVisible: false,
        submitLoading:false,
        rules: {
          title: [
            {required: true, message: '请输入商品名称'}
          ],
          thumb: [
            {required: true, message: '请上传商品图片'}
          ],
          sellPrice: [
            {required: true, message: '请输入商品价格'},{pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/, message: '格式不正确',trigger: 'blur'}
          ],
          stock: [
            {required: true, message: '请输入商品库存'}
          ],
          minbuy: [
            {required: true, message: '请输入最小购买数量'}
          ],
          maxbuy: [
            {required: true, message: '请输入最大购买数量'}
          ]
        },
        commodity: {
          title: "",
          thumb: "",
          sellPrice: "",
          unit: "",
          stock: "",
          minbuy:"",
          maxbuy:"",
          files:[],
          commodityFileList:[],
        },
      }
    },
    mounted(){
      this.queryCommodity();
    },
    methods: {
      queryCommodity(type){
        this.loading = true;
        var dataCondition = [];
        if (!isEmpty(this.querys.title)) {
          dataCondition.push({
            "condition": "title like ",
            "value": "%" + this.querys.title + "%",
            "singleValue": true
          })
        }
        if (!isEmpty(this.querys.code)) {
          dataCondition.push({
            "condition": "code like ",
            "value": "%" + this.querys.code + "%",
            "singleValue": true
          })
        }
        if(this.querys.updateTime.length>0){
          dataCondition.push({
            "condition": " create_time >= ",
            "value": this.querys.updateTime[0] ,
            "singleValue": true
          })
          dataCondition.push({
            "condition": " create_time <= ",
            "value": this.querys.updateTime[1] ,
            "singleValue": true
          })
        }
        if(isEmpty(type)){
          this.pageNum=1;
        }
        var obj = {
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
        }
        var json = JSON.stringify(obj);
        var that = this;
        getCommodityList(json).then((res) => {
          that.loading = false;
          if (res.status == 200) {
            that.tableData = res.data.list;
            that.total = res.data.total;
            that.pageNum = res.data.pageNum;
          } else {
            that.$message.error(res.msg);
          }
        })

      },
      confirmEmp(type){
        var that=this;
        that.commodity.files = this.files;
        var json=JSON.stringify(that.commodity);
        that.submitLoading=true;
        saveUpdateCommodity(json).then((res)=>{
          that.submitLoading=false;
          if(res.status==200){
            that.resetForm(type);
            that.queryCommodity();
          }else{
            that.$message.error(res.msg);
          }
        })
      },
      submitCommodity(){
        this.commodity.files = this.files;
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
        this.commodity=Object.assign({},resetObj.commodity);
      },
      deleteObj(id){
        var that=this;
        commodityDelete(id).then((res)=>{
          if(res.status==200){
            that.queryCommodity();
          }else{
            that.$message.error(res.msg);
          }
        })
      },
      toAdd(){
        this.dialogFormVisible=true;
        this.queryDictionary();
      },
      toEdit(obj){
        this.queryDictionary();
        this.commodity=JSON.parse(JSON.stringify(obj));
        this.files = this.commodity.files;
        var commodityFileList = [];
        if(null != this.commodity.commodityFileList){
          for(var i =0 ;i<this.commodity.commodityFileList.length;i++){
            commodityFileList[i] = {"id":this.commodity.commodityFileList[i].id,"name":this.commodity.commodityFileList[i].fileName,url: ALIYUN_IMG_URL + "/"+ this.commodity.commodityFileList[i].fileName};
          }
          this.commodityFileList = commodityFileList;
        }
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
      handleAvatarSuccess(response, file, fileList) {
        this.files.push(response.data)
      },
      uploadFile() {
        this.$refs.upload.submit()
      },
      uploadUrl:function(){
        return "/web/"+ COMMODITY_UPLOADIMAGE;
      },
      queryDictionary(){
        this.loading = true;
        var obj = {
          typeCode:TYPE_CODE_COMMODITY_UNIT
        }
        var json = JSON.stringify(obj);
        var that = this;
        getDictionaryList(json).then((res) => {
          that.loading = false;
          if (res.status == 200) {
            this.dictionaryList = res.data;
          } else {
            that.$message.error(res.msg);
          }
        })

      },
    },
  }
  var resetObj={
    commodity: {
      title: "",
      thumb: "",
      sellPrice: "",
      unit: "",
      stock: "",
      maxbuy:"",
      minbuy:"",
      id:"",
    }
  }
</script>

<style>
</style>
