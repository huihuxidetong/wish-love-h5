
import Vue from 'vue';
import { router } from './config/router';
import './config/rem';
import App from './App.vue';
import VueLazyload from 'vue-lazyload'
import components from './config/components.js';
import JSEncrypt from 'jsencrypt';
Vue.use(components);

Vue.use(VueLazyload)

new Vue({
  router,
  el: '#app',
  render: h => h(App)
});

Vue.prototype.$encryptionRsaData = function(str){ // 注册方法
    let publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDmMWF6/jsJQw3T3N/XX9ISJkAJ7Wn/cotJ3aqn
96l3E7egp4k5IjA6ruae93yZXFw50KSJUpS9+Gm0UcASV4Whxj1cqagPlm/yRLMMO7DXnpoojHkE
nRPX6Nma5BeeuOBhbHReS9moVLPvCmsEQ+nVbPhnXTi/rvqYiG4FobIHdwIDAQAB`;// ES6 模板字符串 引用 rsa 公钥
    let encryptStr = new JSEncrypt();
    encryptStr.setPublicKey(publicKey); // 设置 加密公钥
    let  data = encryptStr.encrypt(str.toString());  // 进行加密
    return Base64.encode(data);
}

Vue.prototype.$decryptRsaData = function(str){ // 注册方法
    let privateKey  = `MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAOYxYXr+OwlDDdPc39df0hImQAnt
af9yi0ndqqf3qXcTt6CniTkiMDqu5p73fJlcXDnQpIlSlL34abRRwBJXhaHGPVypqA+Wb/JEsww7
sNeemiiMeQSdE9fo2ZrkF5644GFsdF5L2ahUs+8KawRD6dVs+GddOL+u+piIbgWhsgd3AgMBAAEC
gYA9qQ6WlpETyw1iKfEfzQAFco+G2Tyie3lKIQF8mr+fMP3oH9iHIFxQ69bE0EBlCDOAHR5l1mQX
evo9ngRYJW+awsqYfd1Rt4OIWpBAvvJVOL2xsJd1TkUqHhBQEtvkEECDqaIBRgLp3IsXkaiiutyd
/NelFFBQeh58pJ5ARj2WwQJBAPyhZG3RLUuZcP9jGfWnaiOz4iyVIU8UW86KnR8Knf8CBXyhSOoB
Kyo2sPsqtE1mveEvEwM6VYPtNMVXSB/En9cCQQDpQ2AZkp0Zg/Q5n2c5aDLMTTVLRJ3hVctbTCzA
uGFdIObDKZb21bSaVurW6kS91qc810HVAhA+oy/jxTH1R2FhAkEA8WfD0RCeqOwiR1jKuKxWx3Eg
Qpvq7Wc152Mbi0sY+VJULejtBPdC6R7D9e6zxnbUITdbgq0ehGeKEr055Wl9lwJBAJ1tEUBxCIGd
4oe5IutFfXMQcHVZ28umIVZ+dH2kcmFtwQ/Z077Gv9qh6mAdP0N3yOpwxEdD2z7K15k7Dtpg0EEC
QQCmZKE9y2wtyvrvlBy9PlImCIf2S5fiNqgr8AecXdTUHsL84JIbKiLvjRAAY9dMlqk38OCPxk6j
tNCcWyqcaM+Q`;// ES6 模板字符串 引用 rsa 公钥
    let decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey); // 设置 加密公钥
    let  data = decrypt.decrypt(Base64.decode(str.toString()));  // 进行加密
    return data;
}
let Base64 = require('js-base64').Base64;
