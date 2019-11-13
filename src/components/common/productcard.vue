<template>
    <van-cell-group class="additional">
        <van-card
        :title="commodity.commodityTitle"
        :desc="commodity.description"
        :num="(iscard?null:commodity.total)"
        style="background:#fff"
        >
            <template slot="thumb">
                <img :src="commodity.thumb" />
                <p v-if="commodity.sellPrice > commodity.commodityPrice" class="image_tag">比加入时贵{{(commodity.sellPrice -commodity.commodityPrice)/100}} </p>
                <p v-if="commodity.sellPrice < commodity.commodityPrice" class="image_tag">比加入时降{{(commodity.commodityPrice - commodity.sellPrice)/100}} </p>
            </template>
            <template slot="tags">
                <p class="price" v-if="commodity.sellPrice!=null&&commodity.sellPrice!=''" >
                    ￥<span>{{commodity.sellPrice / 100}}</span>
                </p>
                <van-stepper v-if="iscard" v-model="commodity.total" :max="commodity.maxbuy"  :min="commodity.minbuy" />
            </template>
        </van-card>
        <slot />
    </van-cell-group>
</template>

<script>
export default {
    name:'commodity-card',
    props:{
        commodity:Object,
        iscard: {
            type: Boolean,
            default: false
        },
    }
}
</script>

<style lang="less">
.additional {
    .van-cell {
        padding: 0 15px;
        font-size: 12px;
    }
    .van-cell:not(:last-child)::after{
        border:0;
    }
    .van-card__title{
        font-size: 14px;
    }
    .van-cell__title {
        flex: 10;
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
        overflow: hidden;
        height: 18px;
      span {
        font-size: 16px;
            margin-right: 5px;
      }
      .van-tag{
        font-size: 12px;
      }
    }
    .van-stepper{
        position: absolute;
        bottom: 5px;
        right: 5px;
        &__plus{
            width: 30px;
        }
        &__minus{
            width: 30px;
        }
    }
    .image_tag{
        position: absolute;
        bottom: 0;
        width: 90px;
        height: 20px;
        line-height: 20px;
        font-size: 10px;
        color: #fff;
        text-align: center;
        background-color: rgba(0,0,0,.7);
    }
}
.additional::after{
    border-color: #f7f7f7;

}
</style>
