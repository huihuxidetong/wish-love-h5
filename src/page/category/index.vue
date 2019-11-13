<template>
    <div>
        <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        >
        <div slot="action" @click="onSearch">搜索</div>
        </van-search>
        <van-badge-group :active-key="activeKey" class="tab" :style="'height:'+fullHeight+'px'">
            <van-badge :title="item.name" :key="index" v-for="(item,index) in commodityCategorylevel1List" @click="onClick(index,item.id)" />
        </van-badge-group>
        <div class="content" :style="'width:'+fullWidth+'px;height:'+(fullHeight-7)+'px'" >
            <div class="category-div">
                <ul>
                    <li v-for="(item,index) in commodityCategorylevel2List">
                        <router-link to="/search?keyword=xxxx">
                            <img :src="item.thumb"><span>{{item.name}}</span>
                        </router-link>
                    </li>
                    <div style="clear:both"></div>
                </ul>   
            </div>
        </div>
        <navigate />
    </div>
</template>

<script>
import { Search } from "vant";
import {getCommodityCategoryList} from '../../api/api'
export default {
  name: "userindex",
  components: {
    [Search.name]: Search
  },
  data() {
    return {
      value: "",
      activeKey: 0,
      fullHeight: document.documentElement.clientHeight - 93,
      fullWidth: document.documentElement.clientWidth - 99,
      commodityCategorylevel1List : [],
      commodityCategorylevel2List : [],
    };
  },

   created:function(){
       var dataCommodityCategoryCondition = [];
       dataCommodityCategoryCondition.push({
           "condition": "deleted =",
           "value": "0",
           "singleValue": true
       })
       dataCommodityCategoryCondition.push({
           "condition": "level =",
           "value": "1",
           "singleValue": true
       })
       dataCommodityCategoryCondition.push({
           "condition": "parentid =",
           "value": 0,
           "singleValue": true
       })
       var obj = {
           param: {
               oredCriteria: [
                   {
                       criteria: dataCommodityCategoryCondition
                   }
               ]
           }
       }
       var json = JSON.stringify(obj);
       getCommodityCategoryList(json).then((res) => {
          this.commodityCategorylevel1List = res.data;
          console.log( this.commodityCategorylevel1List);
       });
   },
  methods: {
    onSearch() {
      console.log(this.value);
    },
    onClick(index,id) {
      this.activeKey = index;
        var dataCommodityCategoryCondition = [];
        dataCommodityCategoryCondition.push({
            "condition": "deleted = ",
            "value": "0",
            "singleValue": true
        })
        dataCommodityCategoryCondition.push({
            "condition": "level =",
            "value": "2",
            "singleValue": true
        })
        dataCommodityCategoryCondition.push({
            "condition": "parentid =",
            "value": id,
            "singleValue": true
        })
        var obj = {
            param: {
                oredCriteria: [
                    {
                        criteria: dataCommodityCategoryCondition
                    }
                ]
            }
        }
        var json = JSON.stringify(obj);
        getCommodityCategoryList(json).then((res) => {
            this.commodityCategorylevel2List = res.data;
        });
    }
  }
};
</script>

<style lang="less">
.tab {
  float: left;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  min-height: 100%;
  .van-badge {
    padding: 15px 12px 15px 9px;
  }
  .van-badge:not(:last-child)::after {
    height: 199%;
  }
}
.content {
  float: left;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  min-height: 100%;
  margin: 7px 7px 0;
  font-size: 12px;
  img {
    width: 100%;
  }
  .category-div {
    margin: 19px 0px 0;
    h4 {
      font-size: 14px;
      color: #333;
    }
    ul{
        margin-top: 10px;
    }
    li {
      width: 32.8%;
      float: left;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      span{
          font-size: 12px;
    height: 36px;
    color: #686868;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: box;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-box;
    display: -o-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -moz-line-clamp: 2;
    -ms-line-clamp: 2;
    -o-line-clamp: 2;
    box-orient: vertical;
    -webkit-box-orient: vertical;
    -ms-box-orient: vertical;
    -o-box-orient: vertical;
    word-break: break-all;
    box-align: center;
    -webkit-box-align: center;
    -moz-box-align: center;
    -ms-box-align: center;
    -o-box-align: center;
    box-pack: center;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -ms-box-pack: center;
    -o-box-pack: center;
    z-index: 2;
    position: relative;
      }
    }
  }
}
</style>
