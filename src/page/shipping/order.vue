<template>
  <div class="order">
     <headerNav title="确认订单"/>
     <van-cell
      center
      :border="false"
      class="contact-card"
      is-link
      to="/user/address?id=2"
    >
      <template v-if="type === 'add'">
        <strong>选择地址</strong>
      </template>
      <template v-else>
        <strong>{{userDefaultAddress.name}}{{userDefaultAddress.tel}}</strong>
        <div>{{userDefaultAddress.address}} </div>
      </template>
    </van-cell>
    <div style="height:15px;"></div>
    <div class="head" v-for="(item) in cartInfoList" :key="item.id">
      <div class="card">
        <span>
          {{item.merchName}}
        </span>
      </div>
      <div class="card" v-for="(commodity,i) in item.userCartDTOList" :key="i">
        <commodity-card :commodity='commodity' />
      </div>
      <div style="height:15px;"></div>
    </div>
    <div style="height:15px;"></div>

    <van-cell-group class="total">
        <van-cell title="商品总额" value="9.99" />
        <van-cell title="运费" value=" 0.00" />
        <van-cell title="实付金额" value="9.99" style="font-weight: 700;" />
    </van-cell-group>

    <div style="height:50px;"></div>
    <van-submit-bar
      :price="3050"
      button-text="提交订单"
      label='实付金额：'
      @submit="onSubmit"
    />

  </div>
</template>

<script>
import {getUserDefaultAddress,getUserCart} from '../../api/api'
export default {
  data() {
    return {
      type: "add1",
      cartInfoList: [],
      userDefaultAddress:'',
      checkUserCartIds:''
    };
  },
    created:function(){
        const addressId=this.$route.query.addressId;
        const dataCommodityCategoryCondition = [];
        if(null != addressId){
            dataCommodityCategoryCondition.push({
                "condition": "id =",
                "value": addressId,
                "singleValue": true
            })
        }else{
            dataCommodityCategoryCondition.push({
                "condition": "is_default =",
                "value": 1,
                "singleValue": true
            })
        }
        const obj = {
            param: {
                oredCriteria: [
                    {
                        criteria: dataCommodityCategoryCondition
                    }
                ]
            }
        }
        const userDefaultAddres = JSON.stringify(obj);
        getUserDefaultAddress(userDefaultAddres).then((res) => {
            console.log(res.data);
            this.userDefaultAddress = res.data;
        });
        this.checkUserCartIds = this.$route.query.checkUserCartIds;
        var checkUserCartIds = {'userCartIds':this.checkUserCartIds};
        getUserCart(JSON.stringify(checkUserCartIds)).then((res) => {
            console.log(res.data);
            this.cartInfoList = res.data;
        });
    },
  methods: {
    onSubmit() {
      this.$toast("点击按钮");
    },
  },
  activated(){
    //根据key名获取传递回来的参数，data就是map
    this.$on('selectAddress', function(data){
        //赋值给首页的附近医院数据模型
        console.log(1);
    }.bind(this));
},
};
</script>

<style lang="less">
.order {
  font-size: 14px;
  background: #f7f7f7;
  .contact-card::before {
    content: "";
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    position: absolute;
    background: -webkit-repeating-linear-gradient(
      135deg,
      #ff6c6c 0,
      #ff6c6c 20%,
      transparent 0,
      transparent 25%,
      #3283fa 0,
      #3283fa 45%,
      transparent 0,
      transparent 50%
    );
    background: repeating-linear-gradient(
      -45deg,
      #ff6c6c 0,
      #ff6c6c 20%,
      transparent 0,
      transparent 25%,
      #3283fa 0,
      #3283fa 45%,
      transparent 0,
      transparent 50%
    );
    background-size: 80px;
  }
  .total {
    .van-cell__value {
      color: red;
    }
  }
  
  .van-submit-bar__bar {
    border-top: 1px solid #f7f7f7;
  }
  .additional {
    .van-cell {
      padding: 0 15px;
      font-size: 12px;
    }
    .van-cell__title {
      flex: 11;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .van-tag {
      line-height: 12px;
      margin-right: 5px;
    }
    
    .price {
      color: #e93b3d;
      font-size: 10px;
      span {
        font-size: 16px;
      }
    }
  }
}
</style>
