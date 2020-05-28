<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>在线充值</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="other_main bgffffff">
      <!-- 他人充值 start -->
      <div class="card_cont">
        <div class="section">
          <div class="section_tit">
            <span>卡号</span>
          </div>
          <div class="section_input">
            <div class="section_inputall border_r6">
              <input type="text" name="card_no" v-model="payData.card_no" disabled>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="section_tit">
            <span>充值金额</span>
          </div>
          <div class="section_input">
            <div class="section_inputall border_r6">
              <input type="text" name="" v-model="payData.paymoney" disabled>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="section_tit">
            <span>支付金额</span>
          </div>
          <div class="section_input">
            <div class="section_inputall border_r6">
              <input type="text" name="" v-model="payData.presentmoney" disabled>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="section_tit">
            <span>充值说明</span>
          </div>
          <div class="section_input">
            <div class="section_inputall border_r6">
              <input type="text" name="" value="储值卡充值" disabled>
            </div>
          </div>
        </div>
      </div>
      <!-- 他人充值 end -->
      <!-- 按钮部分 start -->
      <div class="btn_box section">
        <!-- 注册按钮 start -->
        <div class="send_btn border_r6 bgff7e42 colorffffff font32 font_normal" @click="sendPay">确认支付</div>
        <!-- 注册按钮 end -->
      </div>
      <!-- 按钮部分 end -->
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'

export default {
  name: 'rechargePay',
  data () {
    return {
      // 充值信息
      payData: this.$route.params.payData,
      // 支付方式渠道
      channel: 'WX_JSAPI'
    }
  },
  computed: {},
  components: {
    MyHeader
  },
  methods: {
    // 发送支付信息
    sendPay () {
      let data = new FormData()
      let requestData = {
        card_no: this.payData.card_no,
        paymodeid: this.payData.Paymodelist[0].paymodeid,
        paymoney: this.payData.paymoney,
        presentmoney: this.payData.presentmoney,
        channel: this.channel,
        // 支付完成后返回路径
        frontUrl: 'https://www.spzlk.cn/index.html?dianpu=' + this.$store.state.wechatID
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/reChargePay', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          // 微信支付
          if (res.data.beecloud) {
            let beecloud = res.data.beecloud
            if (beecloud.paymentchannel === 4) {
              sessionStorage.removeItem('jyyf_openid')
              window.location.href = beecloud.tmPayStr.payUrl
            } else if (beecloud.paymentchannel === 2) {
              let vm = this
              let wechatstr = res.data.beecloud.wechatPayStr
              if (typeof WeixinJSBridge === 'undefined') {
                if (document.addEventListener) {
                  document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(wechatstr), false)
                } else if (document.attachEvent) {
                  document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(wechatstr))
                  document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady(wechatstr))
                }
              } else {
                vm.onBridgeReady(wechatstr)
              }
              return false
            }
          } else {
            this.$toast({
              message: '支付成功!',
              type: 'success'
            })
            this.$router.push({name: 'recharge'})
          }
        } else {
          this.$toast({
            message: res.msg,
            type: 'fail'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 微信支付
    onBridgeReady (wechatstr) {
      let _this = this
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          // 公众号名称，由商户传入
          'appId': wechatstr.appId,
          // 时间戳，自1970年以来的秒数
          'timeStamp': wechatstr.timeStamp,
          // 随机串
          'nonceStr': wechatstr.nonceStr,
          'package': wechatstr.package,
          // 微信签名方式：
          'signType': 'MD5',
          // 微信签名
          'paySign': wechatstr.paySign
        },
        function (_res) {
          if (_res.err_msg === 'get_brand_wcpay_request:ok') {
            _this.$router.push({name: 'userInfo'})
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          } else if (_res.err_msg === 'get_brand_wcpay_request:cancel' || _res.err_msg === 'get_brand_wcpay_request:fail') {
            _this.$toast({
              message: '支付失败！',
              type: 'fail'
            })
          }
        }
      )
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
  @import "static/css/other.css";
</style>
