<template>
<div>

    <headerNav title="我的地址"/>
    <van-address-list
  v-model="chosenAddressId"
  :class="isSelect?'':'hideselect'"
  :list="list"
  @add="onAdd"
  @edit="onEdit"
  @select="onSelect"
/>
</div>
</template>

<script>

import { GetAddressList } from "../../../api/user.js";
import {getUserAllAddress} from '../../../api/api'
import { AddressList } from 'vant';
export default {
    components:{
        [AddressList.name]:AddressList,
    },
    data() {
        return {
        chosenAddressId: '1',
        isSelect:false,
        list: [],
        }
    },

    methods: {
        onAdd() {
            this.$router.push('/user/address/edit')
        },

        onEdit(item, index) {
            this.$router.push('/user/address/edit?id='+item.id);
        },
        onSelect(item,index){
            this.$router.push('/order?addressId='+item.id);
        }
    },
    created:function(){
        this.chosenAddressId=this.$route.query.id;
        this.isSelect=this.$route.query.id>0;
        getUserAllAddress().then(res=>{
            console.log(res.data);
            this.list=res.data;
        })
    }

}
</script>

<style lang="less">
.hideselect{
    .van-radio__input{
        display: none;
    }
}
</style>
