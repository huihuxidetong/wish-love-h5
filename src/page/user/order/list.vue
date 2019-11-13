<template>
<div>
     <headerNav title="我的订单"/>
    <van-tabs v-model="active" @click="titleClick">
        <van-tab v-for="(title,index) in titleList" :title="title.title" :key="index" >
            <div v-for="(item,index) in list" :key="index">
                <van-cell-group class="order-item" >
                    <van-panel :title="'订单：'+item.orderCode" :status="item.orderStatusName"  >
                        <div slot="header">
                            <van-cell class="title" :title="'订单：'+item.orderCode" :value="item.orderStatusName" :to="'/user/order/info/'+item.orderId"/>
                        </div>
                        <div>
                            <router-link :to="'/user/order/info/'+item.orderId">
                            <div  v-if="item.orderCommodityListDTOList.length>0" class="more" >
                                <div class="item" v-for="(commodity,i) in item.orderCommodityListDTOList" :key="i">
                                    <div >
                                        <img :src="commodity.thumb"/>
                                    </div>
                                </div>

                            </div>
                            </router-link>
                        </div>
                        <div slot="footer">
                            <span class="total">总价：￥{{item.orderPrice}}</span>
                            <van-button size="small">确认收货</van-button>
                            <van-button size="small" type="danger">支付</van-button>
                        </div>
                    </van-panel>
                </van-cell-group>
            </div>
        </van-tab>
    </van-tabs>
</div>
</template>

<script>
    import { getOrderList } from "../.././../api/api.js";

    export default {
    components:{
    },
    data(){
        return{
            active:0,
            list:[
            ],
            titleList:[
                {index:0,title:"全部",payStatus:"0",orderStatus:"0",expressStatus:"0"},
                {index:1,title:"待付款",payStatus:"400000100001",orderStatus:"300000100001",expressStatus:"500000100001"},
                {index:2,title:"待收货",payStatus:"400000100002",orderStatus:"300000100001",expressStatus:"500000100003"},
                {index:3,title:"已完成",payStatus:"400000100002",orderStatus:"300000100004",expressStatus:"500000100004"}
            ]
        }
    },
    created:function(){
        var dataCondition = [];
        var obj = {
            param: {
                oredCriteria: [
                    {
                        criteria: dataCondition
                    }
                ]
            }
        }
        var json = JSON.stringify(obj);
        getOrderList(json).then((res) => {
            this.list=res.data;
        });
    },
    methods:{
        titleClick:function(index){
            var dataCondition = [];
            dataCondition.push({
                "condition": "payStatus =",
                "value": this.titleList[index].payStatus,
                "singleValue": true
            });
            dataCondition.push({
                "condition": "orderStatus =",
                "value": this.titleList[index].orderStatus,
                "singleValue": true
            })
            dataCondition.push({
                "condition": "expressStatus =",
                "value": this.titleList[index].expressStatus,
                "singleValue": true
            })
            var obj = {
                param: {
                    oredCriteria: [
                        {
                            criteria: dataCondition
                        }
                    ]
                }
            }
            var json = JSON.stringify(obj);
            getOrderList(json).then((res) => {
                this.list=res.data;
            });
        }
    },
}
</script>

<style lang="less">

.order-item{
    margin-bottom: 10px;
    font-size: 12px;
    .title{
        border-bottom: 1px solid #e5e5e5;

        .van-cell__title{
            flex: 2;
        }
        .van-cell__value{
            color: red;
        }
    }

    
    .van-panel__footer {
        text-align: right;
        border-bottom: 1px solid #e5e5e5;
    }
    .van-button {
        margin-left: 5px;
    }
    .total{
    position: absolute;
    top: 17px;
    left: 15px;
    font-size: 13px;
    }
    .more{
        overflow-x: scroll;white-space: nowrap;    -webkit-overflow-scrolling: touch;    margin: 5px 0 5px 15px;
        .item{
            width: 90px; height:90px; margin-right: 10px;display: inline-block;
            img{
                width: 100%;
            }
        }
    }
}
</style>
