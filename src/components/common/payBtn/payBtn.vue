<template>
  <div class="sendpay">
    <div class="" @click="pay">
      <slot></slot>
    </div>
    <!-- 密码弹框 start -->
    <van-dialog
      class="color333333"
      v-model="passwordShow"
      title="请输入会员密码"
      @confirm="sendpay"
      show-cancel-button>
      <van-password-input
        :value="Cpassword"
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
import tip from '@/utils/Toast'

export default {
  name: 'payBtn',
  props: {
    // 组件调用地方froms
    froms: {
      type: String,
      default: function () {
        return ''
      }
    },
    // 订单编号
    tradeno: {
      type: String,
      // require: true,
      default: function () {
        return ''
      }
    },
    // 是否使用积分
    scoreFlag: {
      type: Boolean,
      // require: true,
      default: function () {
        return false
      }
    },
    // 我的备注
    usernote: {
      type: String,
      // require: true,
      default: function () {
        return ''
      }
    },
    // 支付方式
    paymodeid: {
      type: String,
      default: function () {
        return '3'
      }
    },
    // 商品数量
    amount: {
      type: Number,
      default: function () {
        return 1
      }
    }
  },
  data () {
    return {
      // 密码弹框
      passwordShow: false,
      // 密码框是否聚焦
      showKeyboard: false,
      // 支付密码
      Cpassword: '',
      // 支付方式列表
      paylist: [],
      // 会员卡号
      Memcode: this.$store.state.userInfo.memcode,
      // 支付方式渠道
      channel: 'WX_JSAPI'
    }
  },
  computed: {
    // 收货地址
    address () {
      let self = this
      return self.$store.state.address
    },
    // 临时订单信息
    order () {
      let self = this
      return self.$store.state.order
    },
    // 配送服务费
    freightmoney () {
      let self = this
      return self.$store.state.freightmoney
    },
    // 积分
    score () {
      let self = this
      return self.$store.state.score
    },
    // 优惠券
    tick () {
      let self = this
      return self.$store.state.tick
    },
    // 购物车详情
    cart () {
      let self = this
      return self.$store.state.cart
    },
    // 订单类型标识,1: 发起拼团，2：参与拼团，3：砍价订单
    ordertype () {
      let self = this
      return self.$route.query.ordertype || 0
    },
    // 团号
    groupno () {
      let self = this
      return self.$route.query.groupno || ''
    }
  },
  components: {},
  methods: {
    onInput (key) {
      let self = this
      self.Cpassword = (self.Cpassword + key).slice(0, 4)
    },
    onDelete () {
      let self = this
      self.Cpassword = self.Cpassword.slice(0, self.Cpassword.length - 1)
    },
    // 支付
    pay (e) {
      let self = this
      e.stopPropagation()
      if (!self.tradeno) {
        // 验证选择收货地址
        if (!self.address) {
          tip('请选择收货地址！')
          return false
        }
      }
      // 设置支付信息
      self.setPaymoney()
      // 验证输入会员密码
      if (self.paymodeid === '3') {
        let data = {
          paymode: 3,
          paymoney: (self.paylist.reverse()[0].paymoney).toFixed(2)
        }
        self.$api.invest.getInputPayPasswdFlag(data).then(result => {
          let res = result.data
          if (res.code === 200) {
            // passwdflag,0:不输密码，1:输密码
            if (res.data.passwdflag) {
              self.passwordShow = true
              self.showKeyboard = true
              self.Cpassword = ''
            } else {
              self.sendpay()
            }
          } else {
            tip(res.msg)
          }
        })
        return false
      }
      self.sendpay()
    },
    // 设置支付信息
    setPaymoney () {
      let self = this
      // 订单总金额
      let totalMoney
      if (self.froms === 'editorder') {
        totalMoney = self.order.totalMoney + parseFloat(self.freightmoney.freightmoney)
      } else {
        totalMoney = self.order.canPayMoney
      }
      // 零钱金额
      let smallmoney = self.order.smallmoney
      // console.log(totalMoney, '订单总金额')
      // 支付金额
      let paymoney = totalMoney
      // console.log(paymoney, '支付金额')
      // 支付列表下标
      let index = 0
      // 优惠券类型 1：金额券；2：折扣券
      // 优惠券
      if (self.tick) {
        let paylist4 = {}
        paylist4.paymode = 4
        paylist4.ticketid = parseInt(self.tick.tickid)
        paylist4.limittype = self.tick.limittype
        paylist4.limitcode = self.tick.limitcode
        paylist4.specialflag = self.tick.specialflag
        paylist4.minsalemoney = self.tick.minsalemoney
        paylist4.tickettype = self.tick.tickettype
        paylist4.tickgdscode = self.tick.tickgdscode
        paylist4.deptflag = self.tick.deptflag
        paylist4.deptcodelist = self.tick.deptcodelist
        paylist4.paymoney = self.tick.dicountMoney
        self.paylist[index] = paylist4
        index++
        paymoney = paymoney - paylist4.paymoney
      }
      // 积分
      if (self.scoreFlag) {
        let paylist5 = {}
        paylist5.paymode = 5
        paylist5.paymoney = self.score.Money
        paylist5.score = self.score.useScore
        self.paylist[index] = paylist5
        index++
        paymoney = paymoney - paylist5.paymoney
      }
      // 零钱
      if (self.order.smallmoney !== 0) {
        let paylist10 = {}
        paylist10.paymode = 10
        if (paymoney > 0) {
          let money = paymoney - smallmoney
          if (money <= 0) {
            paylist10.paymoney = paymoney
          } else {
            paylist10.paymoney = smallmoney
          }
        } else {
          paylist10.paymoney = 0
        }
        self.paylist[index] = paylist10
        index++
        if (self.froms !== 'againpay') {
          paymoney = paymoney - paylist10.paymoney
        }
      }
      // 储值卡
      if (self.paymodeid === '3') {
        let paylist3 = {}
        paylist3.paymode = 3
        if (paymoney < 0) {
          paymoney = 0
        }
        paylist3.paymoney = parseFloat(paymoney.toFixed(2))
        self.paylist[index] = paylist3
        index++
      }
      // 微信
      if (self.paymodeid === '7') {
        let paylist7 = {}
        paylist7.paymode = 7
        if (paymoney < 0) {
          paymoney = 0
        }
        paylist7.paymoney = parseFloat(paymoney.toFixed(2))
        self.paylist[index] = paylist7
        index++
      }
    },
    // 发送支付信息
    sendpay () {
      let self = this
      let data = {
        totalmoney: self.order.totalMoney,
        ordertype: self.ordertype,
        otc: self.order.otc,
        isotc: self.order.isotc,
        goodsid: self.$route.query.goodsid || '',
        groupno: self.$route.query.groupno,
        amount: self.amount || 1,
        Sendid: self.address.addressid,
        Usernote: self.usernote,
        paylist: self.paylist,
        Memcode: self.Memcode,
        Cpassword: self.Cpassword,
        channel: self.channel,
        freight: self.freightmoney.freightmoney,
        Tradeno: self.tradeno,
        // 支付完成后返回路径
        frontUrl: self.$store.state.baseURL + '/userInfo?dianpu=' + self.$store.state.wechatID,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.invest.orderCommit(data).then(result => {
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
              let wechatstr = res.data.beecloud.wechatPayStr
              if (typeof WeixinJSBridge === 'undefined') {
                if (document.addEventListener) {
                  document.addEventListener('WeixinJSBridgeReady', self.onBridgeReady(wechatstr, res.data.tradeno), false)
                } else if (document.attachEvent) {
                  document.attachEvent('WeixinJSBridgeReady', self.onBridgeReady(wechatstr, res.data.tradeno))
                  document.attachEvent('onWeixinJSBridgeReady', self.onBridgeReady(wechatstr, res.data.tradeno))
                }
              } else {
                self.onBridgeReady(wechatstr, res.data.tradeno)
              }
              return false
            }
          } else {
            if (parseInt(self.group) === 1) {
              self.groupAdd(res.data.tradeno)
              self.orderdetail(res.data.tradeno)
            } else if (parseInt(self.group) === 2) {
              self.groupEnd(res.data.tradeno)
              self.orderdetail(res.data.tradeno)
            } else {
              tip('支付成功！')
              self.orderdetail(res.data.tradeno)
            }
          }
          return false
        } else {
          if (res.data) {
            tip(res.msg)
            self.orderdetail(res.data.tradeno)
            return false
          }
          tip(res.msg)
        }
      })
    },
    // 微信支付
    onBridgeReady (wechatstr, tradeno) {
      let self = this
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
            self.$router.push({name: 'userInfo'})
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          } else if (_res.err_msg === 'get_brand_wcpay_request:cancel' || _res.err_msg === 'get_brand_wcpay_request:fail') {
            tip('支付失败！')
            self.orderdetail(tradeno)
          }
        }
      )
    },
    // 获取购物车商品
    getCart () {
      let self = this
      let data = {
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.getCar(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.$store.commit('setCart', res.data)
          if (self.cart.length) {
            let numsList = self.cart.map(item => item.amount)
            let nums = 0
            numsList.forEach(item => {
              nums += parseFloat(item)
            })
            self.$store.commit('setCartnums', nums)
          } else {
            self.$store.commit('setCartnums', 0)
          }
        } else {
          tip(res.msg)
        }
      })
    },
    // 生成团信息
    groupAdd (tradeno) {
      let self = this
      let data = {
        goodsid: self.$route.query.goodsid,
        amount: self.amount,
        tradeno: tradeno,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.groupAdd(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          tip('建团成功!')
        } else {
          tip(res.msg)
        }
      })
    },
    // 加入团信息
    groupEnd (tradeno) {
      let self = this
      let data = {
        goodsid: self.$route.query.goodsid,
        amount: self.amount,
        tradeno: tradeno,
        groupno: self.groupno,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.groupEnd(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          tip('参团成功!')
        } else {
          tip(res.msg)
        }
      })
    },
    // 去会员中心页面
    orderdetail (tradeno) {
      let self = this
      self.$store.commit('setOrder', '')
      self.$store.commit('setScore', '')
      self.$store.commit('setAddress', '')
      self.$store.commit('setFreightmoney', '')
      self.$store.commit('setTick', '')
      self.getCart()
      self.$router.push({name: 'userInfo'})
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
.sendpay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-input {
  border: 1px solid #dcdfe6;
}
</style>
