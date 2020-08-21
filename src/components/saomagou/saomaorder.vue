<template>
  <div class="container_pt90 bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>订单详情</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 订单信息 start -->
    <div class="order_section bgffffff">
      <div class="orderdesc">
        <div>门店名称</div>
        <div class="font24 color666666">{{deptname}}</div>
      </div>
      <div class="orderdesc">
        <div>门店编码</div>
        <div class="font24 color666666">{{deptcode}}</div>
      </div>
      <div class="orderdesc">
        <div>订单编号</div>
        <div class="font24 color666666">{{flowno}}</div>
      </div>
      <div class="orderdesc">
        <div>订单金额</div>
        <div class="font24 color666666" v-if="saomaorderDetail">{{(saomaorderDetail.totalMoney).toFixed(2)}}</div>
      </div>
    </div>
    <!-- 订单信息 end -->
    <!-- 支付方式 start -->
    <div class="order_sections bgffffff paymode_img">
      <div class="">支付方式</div>
      <van-radio-group
        direction="horizontal"
        v-model="paymodeid">
        <van-radio
          v-if="paymodeList.filter(item => item.paymodeid === 3).length"
          name="3"
          checked-color="#ff6400">
          <img src="static/img/card.png">&nbsp;
          <span class="payname font24">储值卡</span>
        </van-radio>
        <van-radio
          v-if="paymodeList.length"
          name="7"
          checked-color="#ff6400">
          <img src="static/img/wechat.png">&nbsp;
          <div class="payname font24">微信</div>
        </van-radio>
      </van-radio-group>
    </div>
    <!-- 支付方式 end -->
    <!-- 支付 start -->
    <div class="order_money bgffffff">
      <div class="order_money_totalMoney font24 ellipsis">实付：<span class="colorf84242 font34" v-if="saomaorderDetail">￥{{(saomaorderDetail.totalMoney).toFixed(2)}}</span></div>
      <div class="pay colorffffff bgff6400" @click="isSetPasswordShow">立即支付</div>
    </div>
    <!-- 支付 end -->
    <!-- 密码弹框 start -->
    <van-dialog
      class="color333333"
      v-model="passwordShow"
      title="请输入会员密码"
      @confirm="setPaylist"
      show-cancel-button>
      <van-password-input
        :value="payPassword"
        :length="4"
        :gutter="15"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
      />
    </van-dialog>
    <!-- 密码弹框 end -->
    <!-- 数字键盘 start -->
    <van-number-keyboard
      class="color333333"
      :show="showKeyboard"
      @input="onInput"
      @delete="onDelete"
      @blur="showKeyboard = false"
    />
    <!-- 数字键盘 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'

export default {
  name: 'saomaorder',
  data () {
    return {
      // 店铺信息
      deptcode: this.$route.query.deptcode,
      deptname: this.$route.query.deptname,
      // 流水号
      flowno: this.$route.query.flowno,
      // 订单详情
      saomaorderDetail: '',
      // 支付方式列表
      paymodeList: [],
      // 支付信息
      paylist: [],
      // 支付完成后返回路径
      frontUrl: this.$store.state.baseURL + '/userInfo?dianpu=' + this.$store.state.wechatID,
      // 支付方式渠道
      channel: 'WX_JSAPI',
      // 储值卡支付密码
      payPassword: '',
      // 支付方式
      paymodeid: '7',
      // 密码弹框
      passwordShow: false,
      // 密码框是否聚焦
      showKeyboard: false
    }
  },
  computed: {
  },
  components: {
    MyHeader
  },
  methods: {
    onInput (key) {
      this.payPassword = (this.payPassword + key).slice(0, 4)
    },
    onDelete () {
      this.payPassword = this.payPassword.slice(0, this.payPassword.length - 1)
    },
    // 获取订单详情
    getSaomaorderDetail () {
      let data = new FormData()
      let requestData = {
        flowno: this.flowno,
        deptcode: this.deptcode
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/listMicroFlowDtl', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.saomaorderDetail = res.data
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
    // 获取支付方式列表
    getPaymodeList () {
      let data = new FormData()
      let requestData = {
        flowno: this.flowno,
        shopCode: this.deptcode
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/getMicroFlowPayMoney', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.paymodeList = res.data
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
    // 是否显示密码弹框
    isSetPasswordShow () {
      if (this.paymodeid === '3') {
        this.passwordShow = true
        this.showKeyboard = true
        this.payPassword = ''
        return false
      }
      // 设置支付信息
      this.setPaylist()
    },
    // 设置支付信息
    setPaylist () {
      // 支付金额
      let paymoney = this.saomaorderDetail.totalMoney
      // console.log(paymoney, '支付金额')
      // 支付列表下标
      let index = 0
      // 储值卡
      if (this.paymodeid === '3') {
        let paylist3 = {}
        paylist3.paymode = 3
        if (paymoney < 0) {
          paymoney = 0
        }
        paylist3.paymoney = paymoney
        this.paylist[index] = paylist3
        index++
      }
      // 微信
      if (this.paymodeid === '7') {
        let paylist7 = {}
        paylist7.paymode = 7
        if (paymoney < 0) {
          paymoney = 0
        }
        paylist7.paymoney = paymoney
        this.paylist[index] = paylist7
        index++
      }
      // 立即支付
      this.pay()
    },
    // 立即支付
    pay () {
      let data = new FormData()
      let requestData = {
        flowno: this.flowno,
        payPassword: this.payPassword,
        channel: this.channel,
        frontUrl: this.frontUrl,
        payList: this.paylist,
        shopCode: this.deptcode
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/microFlowToPay', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          // 微信支付
          if (res.data.beecloud) {
            let beecloud = res.data.beecloud
            if (beecloud.paymentchannel === 3) { // 银联商务结算
              window.location.href = beecloud.unifiedPayStr.payUrl
            } else if (beecloud.paymentchannel === 4) { // 太米结算
              window.location.href = beecloud.tmPayStr.payUrl
            } else if (beecloud.paymentchannel === 2) { // 微信官方结算
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
              message: '支付成功！',
              type: 'success'
            })
            this.toSaomagou()
          }
          return false
        } else {
          this.$toast({
            message: res.msg,
            type: 'fail'
          })
          this.toSaomagou()
        }
      }).catch(error => {
        throw error
      })
    },
    // 微信支付
    onBridgeReady (wechatstr) {
      let _this = this
      window.WeixinJSBridge.invoke(
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
            _this.$router.push({name: 'saomagou'})
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          } else if (_res.err_msg === 'get_brand_wcpay_request:cancel' || _res.err_msg === 'get_brand_wcpay_request:fail') {
            _this.$toast({
              message: '支付失败！',
              type: 'fail'
            })
            _this.toSaomagou()
          }
        }
      )
    },
    // 去扫码购首页
    toSaomagou () {
      this.$router.push({name: 'saomagou'})
    }
  },
  beforeCreate () {
  },
  created () {
    // 获取订单详情
    this.getSaomaorderDetail()
    // 获取支付方式列表
    this.getPaymodeList()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import 'static/css/saomagou.css';

</style>
