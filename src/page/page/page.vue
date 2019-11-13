<template>
<div :style="'background-color:'+((page.BackgroundColor==undefined||page.BackgroundColor=='')?'#fff':page.BackgroundColor)">
    <div :style="'height:'+topheight+'px'" ></div>
    <div v-for="(item,index) in page.Sections" :key="index">
        <imageAd v-if="item.Code=='ImageAd'" :data="item.ParameterDictionary"></imageAd>
        <imageText v-if="item.Code=='ImageText'" :data="item.ParameterDictionary"></imageText>
        <pageLine v-if="item.Code=='Line'"  :data="item.ParameterDictionary" ></pageLine>
        <whitespace v-if="item.Code=='Line'" :data="item.ParameterDictionary"  />
        <pageText v-if="item.Code=='Text'" :data="item.ParameterDictionary" ></pageText>
        <notice v-if="item.Code=='Notice'" :data="item.ParameterDictionary" ></notice>
        <search v-if="item.Code=='Search'" :data="item.ParameterDictionary" v-on:settopheight="settopheight($event)" ></search>
        <pageTitle v-if="item.Code=='Title'" :data="item.ParameterDictionary" ></pageTitle>
        <cube v-if="item.Code=='Cube'" :data="item.ParameterDictionary" ></cube>
        <product v-if="item.Code=='Product'" :data="item" ></product>
    </div>
</div>
</template>
<script>
import "../../assets/style/index.css";
import whitespace from "../../components/page/whitespace.vue";
import pageLine from "../../components/page/line.vue";
import pageText from "../../components/page/text.vue";
import notice from "../../components/page/notice.vue";
import search from "../../components/page/search.vue";
import pageTitle from "../../components/page/title.vue";
import cube from "../../components/page/cube.vue";
import imageAd from "../../components/page/imageAd.vue";
import imageText from "../../components/page/imageText.vue";
import product from "../../components/page/product.vue";
import {getBannerList,getCommodityCategoryList4IndexPageList,getCommoditylist4IndexPageList} from '../../api/api'
export default {
    name:"page",
    components:{
        whitespace,
        pageLine,
        pageText,
        notice,
        search,
        pageTitle,
        cube,
        [imageAd.name]:imageAd,
        imageText,
        product
    },
    data:function(){
        return{
            topheight:0,
            page:{},
            obj : { "PageId": 1, "Name": "wish-love-home", "BackgroundColor": "", "Sections": []},
        }
    },
    created:function(){
        var keyword =  {
            "PageSectionId": 2511,
            "Code": "Search",
            "ParameterDictionary": {
                "keyword": "搜索商品",
                "position": "fixed",
                "backgroundcolor": "#f9f9f9",
                "color": "#999999",
                "textalign": "center",
                "boxcolor": "#ffffff",
                "boxtype": "2"
            }
        }

        // var Product = {
        //     "PageSectionId": 2522,
        //     "Code": "Product",
        //     "ParameterDictionary": {
        //         "type": "2",
        //         "source": "1",
        //         "showsort": "0",
        //         "shownumber": "6",
        //         "tag": "0",
        //         "showtype": "simple",
        //         "buttonvalue": "购买",
        //         "productids": "4,1,3",
        //         "productcategoryid": "",
        //         "producttagid": "",
        //         "productlist":[]
        //     }
        // }
        // var dataCondition = [];
        this.obj.Sections.push(keyword);
        getBannerList().then((res) => {
            this.obj.Sections.push(res.data);
        })
        // var dataCommodityCategoryCondition = [];
        // dataCommodityCategoryCondition.push({
        //     "condition": "is_home ",
        //     "value": "1",
        //     "singleValue": true
        // })
        // dataCommodityCategoryCondition.push({
        //     "condition": "deleted ",
        //     "value": "0",
        //     "singleValue": true
        // })
        // dataCommodityCategoryCondition.push({
        //     "condition": "level ",
        //     "value": "1",
        //     "singleValue": true
        // })
        // var obj = {
        //     param: {
        //         oredCriteria: [
        //             {
        //                 criteria: dataCommodityCategoryCondition
        //             }
        //         ]
        //     }
        // }
        // var json = JSON.stringify(obj);
        // getCommodityCategoryList4IndexPageList(json).then((res) => {
        //     for(var i =0 ;i< res.data.length ; i++){
        //         this.obj.Sections.push(res.data[i]);
        //     }
        // });
        // var obj = {
        //     pageInfo: {
        //         pageNum: 1,
        //         pageSize: 10
        //     },
        //     param: {
        //         oredCriteria: [
        //             {
        //                 criteria: dataCondition
        //             }
        //         ]
        //     }
        // }
        // var json = JSON.stringify(obj);
        // getCommoditylist4IndexPageList(json).then((res) => {
        //     Product.ParameterDictionary.productlist = res.data.list
        //     this.obj.Sections.push(Product);
        //
        // })
        console.log(this.obj);
        this.page = this.obj;

    },
    methods:{
        settopheight:function(value){
            this.topheight=value;
        }
    }
}
</script>
