<template>
    <div>
      <headerNav title="手机号登录"/>
      <div>
          <div style="padding-top: 70px;">
            <van-cell-group>
                <van-field v-model="user.mobile" required clearable label="手机号" placeholder="请输入手机号"/>
                <van-field v-model="user.verificationCode" label="短信验证码" center required clearable placeholder="请输入短信验证码">
                    <van-button slot="button" size="small" type="primary">发送验证码</van-button>
                </van-field>
            </van-cell-group>
            <div style="margin: 10px;">
                <van-button size="large" @click="login" type="primary" style="height: 45px;line-height:45px;">登录</van-button>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
import { userLogin } from "../../api/api.js";
export default {
    components:{
    },
    data(){
        return{
            user: {
                mobile:"",
                verificationCode: "",
            },
            request: {
                key:"",
            },
        }
    },
    created:function(){

    },
    methods:{
        login:function(){
            if(this.user.mobile == '' ){
                this.$toast('手机号不能为空');
                return
            }
            if(this.user.verificationCode == '' ){
                this.$toast('验证码不能为空');
                return
            }

            let rsaData = this.$encryptionRsaData(JSON.stringify(this.user));
            this.request.key = rsaData;
            let json = JSON.stringify(this.request)
            userLogin(json).then((res) => {
                // this.data=res.data;
            });
        }
    },
}
</script>

<style>

</style>
