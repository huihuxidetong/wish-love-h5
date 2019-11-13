<template>
  <div class="card">
    <headerNav title="购物车"/>
    <div class="card-goods" v-for="(item) in cartInfoList" :key="item.id">
      <div class="promotion-group">
        <div class="head">
          <p @click="checkShop(item)">
            <van-checkbox v-model="item.checked">
              <span>
                {{item.merchName}}
                <van-icon name="arrow"/>
              </span>
            </van-checkbox>
          </p>
        </div>
        <ul class="card-goods__item" v-for="(pros,value) in item.userCartDTOList" :key="value">
          <li @click="ischeck(item,pros)">
            <van-checkbox v-model="pros.checked"></van-checkbox>
          </li>
          <li>
            <commodity-card :commodity='pros' :iscard='true' ></commodity-card>
          </li>
        </ul>
      </div>
    </div>
    <van-submit-bar class="settlement" :price="allPrice" :button-text="buttontext" @submit="onSubmit">
      <p @click="checkAll()">
        <van-checkbox v-model="isCheckAll">全选</van-checkbox>
      </p>
      <span class="cart-freight" slot="default">不含运费</span>
    </van-submit-bar>
  </div>
</template>

<script>
    import {getUserCart} from '../../api/api'
    export default {
        data () {
            return {
                cartInfoList: [],
                isCheckAll: false, // 是否全选
                allPrice: 0, // 所有价格
                allShops: 0, // 被选中的商店数量
                allCount: 0, // 被选中的产品数量
                buttontext : '去结算',
                checkUserCartId : [],
            }
        },
        created:function(){
            var checkUserCartIds = {'userCartIds':''};
            getUserCart(JSON.stringify(checkUserCartIds)).then((res) => {
                console.log(res.data);
                this.cartInfoList = res.data;
            });
        },
        methods: {
            // 选中单个商品
            ischeck (item, pro) {
                // 为未选中的时候改变为false，反之为true
                pro.checked ? this._checkTrue(item, pro) : this._checkFalse(item, pro)
            },
            // 修改单个商品的true
            _checkTrue (item, pro) {
                this.checkUserCartId.push(pro.id);
                pro.checked = true // 将商品选中状态改为true
                // 这里执行了两部，选中商品数量先+1，再与该店铺商品数量比较，如果相等就更改店铺选中状态为true
                if (++item.checkedCount === item.userCartDTOList.length) {
                    item.checked = true
                } else {
                    return ''
                }
                // ++item.checkedCount === item.userCartDTOList.length ? item.checked = true : ''
                // 如果店铺选中状态改为true，选中店铺数量先+1，再与店铺数量比较，如果相等就更改全选选中状态为true
                // // 当商店全选状态，每全选一个商店，被选中商店数加一，数值等于所有商店数，全选状态为true
                if (item.checked) {
                    if (++this.allShops === this.cartInfoList.length) {
                        this.isCheckAll = true
                    } else {
                        this.isCheckAll = false
                    }
                } else {
                    return ''
                }
                // item.checked ? ++this.allShops === this.cartInfoList.length ? this.isCheckAll = true : this.isCheckAll = false : ''
            },
            // 修改单个商品的 false
            _checkFalse (item, pro) {
                for(var i=0;i<this.checkUserCartId.length ;i++){
                    if(this.checkUserCartId[i] == pro.id){
                        var index = this.checkUserCartId.indexOf(this.checkUserCartId[i]);
                        this.checkUserCartId.splice(index,1);
                    }
                }
                pro.checked = false // 将商品选中状态改为false
                --item.checkedCount; // 被选中的商品数减一
                if (item.checked) {
                    --this.allShops // 商店数减一
                    // 如果店铺是被选中的，更改店铺选中状态
                    item.checked = false // 当商店状态为选中时改变false
                }
                this.isCheckAll = false // 全选状态为false
            },

            // 选择整个商店的商品
            checkShop (item) {
                item.checked ? this._shopTrue(item) : this._shopFalse(item)
            },
            // 遍历商店每个商品,状态为false的改变为true,又在_checkTrue()方法中将商店状态改为true
            _shopTrue (item) {
                item.userCartDTOList.forEach(pro => {
                    if (pro.checked === false) {
                        this._checkTrue(item, pro)
                    } else {
                        return ''
                    }
                    // pro.checked === false ? this._checkTrue(item, pro) : ''
                })
            },
            _shopFalse (item) {
                --this.allShops // 商店数减一
                item.userCartDTOList.forEach(pro => {
                    // 同上
                    if (pro.checked === true) {
                        this._checkFalse(item, pro)
                    } else {
                        return ''
                    }
                    //  pro.checked === true ? this._checkFalse(item, pro) : ''
                })
            },
            // 选择全部商店的商品，已经计算总价和总数量的函数
            checkAll () {
              this.isCheckAll ? this.isCheckAll : this.isCheckAll;
              if(this.isCheckAll){
                this.cartInfoList.forEach(item => {
                    this._shopTrue(item);
                });
                this.isCheckAll = true;
              }else{
                this.cartInfoList.forEach(item => {
                    this._shopFalse(item)
                });
               this.isCheckAll = false;
               this.allShops = 0;
              }
            },
            _totalPeice () {
                // 每次调用此方法，将初始值为0，遍历价格并累加
                this.allPrice = 0
                this.cartInfoList.forEach(item => {
                    let products = item.userCartDTOList
                    products.forEach(pros => {
                        if (pros.checked) {
                            this.allPrice += pros.sellPrice * pros.total
                        }
                    })
                })
            },
            _totalCount () {
                // 同上
                this.allCount = 0
                this.cartInfoList.forEach(item => {
                    this.allCount += item.checkedCount
                })
                if(this.allCount != 0){
                    this.buttontext = '去结算' + parseInt(this.allCount);
                }else{
                    this.buttontext = '去结算'
                }
            },

            onSubmit () {
                this.$router.push('/order?checkUserCartIds='+ this.checkUserCartId.toString())
            }
        },
        watch: {
            // 深度监听所有数据，每次改变重新计算总价和总数
            cartInfoList: {
                deep: true,
                handler (val, oldval) {
                    this._totalPeice()
                    this._totalCount()
                }
            }
        }
    }
</script>

<style lang="less" scoped>
  .card-goods {
    font-size: 12px;
    &__item {
      position: relative;
      .van-checkbox{
        width: 20px;
        height: 20px;
        top: 40px;
        left: 5px;
        z-index: 1;
        position: absolute;
      }
      .additional{
        width: 100%;
        padding-left: 15px;
        box-sizing: border-box;
      }
    }
  }
  .head{
    padding-left: 5px;
    border-bottom: 1px solid #eee;
  }
  .card{
    background: #f7f7f7;
    .van-submit-bar__bar {
      border-top: 1px solid #f7f7f7;
      .van-checkbox{
        padding-left: 5px;
      }
    }
    .promotion{
      .van-tag {
        line-height: 12px;
        margin-right: 5px;
      }
      .van-cell__title{

        flex: 4;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .promotion-group{
      margin-top: 10px;
      box-shadow: 5px 5px 5px #e5e5e5;
    }
  }

</style>

