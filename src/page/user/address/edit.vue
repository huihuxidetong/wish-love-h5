<template>
    <div>
     <headerNav title="修改地址"/>
      <van-address-edit
      :area-list="areaList"
      :showDelete="showDelete"
      :showPostal="showPostal"
      show-set-default
      @save="onSave"
      @delete="onDelete"
      :addressInfo="info"
      />
    </div>
</template>

<script>
import areaList from '../../../data/area';
import { AddressEdit } from 'vant';
import {getUserAddressById,saveUserAddress} from '../../../api/api'
export default {
    components:{
        [AddressEdit.name]:AddressEdit,
    },
    data() {
    return {
      areaList,
      showDelete:false,
      showDelete:false,

        info:{},
    }
  },

  methods: {
    onSave(data) {
        data['deleted'] = 0;
        console.log(JSON.stringify(data));
        saveUserAddress(JSON.stringify(data)).then(res=> {
            this.$toast('保存成功');
            this.$router.go(-1);
        })
    },
    onDelete(data) {
        data['deleted'] = 1;
        saveUserAddress(JSON.stringify(data)).then(res=> {
        this.$toast('删除成功');
        this.$router.go(-1);
      })
    },
  },
  created:function(){
    var id=this.$route.query.id;
    const dataCondition = [];
      dataCondition.push({
      "condition": "id = ",
      "value": id,
      "singleValue": true
    })
    const obj = {
      param: {
          oredCriteria: [
              {
                  criteria: dataCondition
              }
          ]
      }
    }
    const json = JSON.stringify(obj);
      this.showDelete=true;
      this.showPostal=true;
      if(id>0){
        getUserAddressById(json).then(res=> {
        this.info = res.data;
      })
    }
  }

}
</script>

<style>
.van-picker__toolbar{
  font-size: 16px;
}
</style>
