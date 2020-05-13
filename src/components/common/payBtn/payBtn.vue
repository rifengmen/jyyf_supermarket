<template>
  <div class="sendpay" @click="pay">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'payBtn',
  props: {
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
    }
  },
  data () {
    return {
      // 支付密码
      Cpassword: '',
      // 收货地址
      address: this.$store.state.address,
      // 支付方式列表
      paylist: [],
      // 会员卡号
      Memcode: this.$store.state.userInfo.memcode,
      // 支付方式渠道
      channel: 'WX_JSAPI'
    }
  },
  computed: {
    // 临时订单信息
    order () {
      return this.$store.state.order
    },
    // 配送服务费
    freightmoney () {
      return this.$store.state.freightmoney
    },
    // 积分
    score () {
      return this.$store.state.score
    },
    // 优惠券
    tick () {
      return this.$store.state.tick
    },
    // 购物车详情
    cart () {
      return this.$store.state.cart
    }
  },
  components: {},
  methods: {
    // 支付
    pay (e) {
      e.stopPropagation()
      if (!this.tradeno) {
        // 验证选择收货地址
        if (!this.address) {
          this.$message({
            message: '请选择收货地址！',
            type: 'error'
          })
          return false
        }
      }
      // 验证输入会员密码
      if (this.paymodeid === '3' || this.scoreFlag || this.tick) {
        this.$prompt('请输入会员密码！', '在线支付', {
          confirmButtonText: '确定',
          inputPlaceholder: '请输入四位会员密码',
          inputType: 'password'
        }).then(({ value }) => {
          this.Cpassword = value
          this.sendpay()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
        return false
      }
      this.sendpay()
    },
    // 发送支付信息
    sendpay () {
      // 订单总金额
      let totalMoney = this.order.totalMoney
      // 支付金额
      let paymoney = totalMoney + parseFloat(this.freightmoney.freightmoney)
      // 支付列表下标
      let index = 0
      // 优惠券类型 1：金额券；2：折扣券
      // let tickettype = 0
      // 优惠券
      if (this.tick) {
        // tickettype = this.tick.tickettype
        let paylist4 = {}
        paylist4.paymode = 4
        paylist4.ticketid = parseInt(this.tick.tickid)
        paylist4.limittype = this.tick.limittype
        paylist4.limitcode = this.tick.limitcode
        paylist4.specialflag = this.tick.specialflag
        paylist4.minsalemoney = this.tick.minsalemoney
        paylist4.tickettype = this.tick.tickettype
        paylist4.tickgdscode = this.tick.tickgdscode
        paylist4.deptflag = this.tick.deptflag
        paylist4.deptcodelist = this.tick.deptcodelist
        paylist4.paymoney = this.tick.dicountMoney
        this.paylist[index] = paylist4
        index++
        paymoney = paymoney - this.freightmoney.freightmoney - paylist4.paymoney
      }
      // 积分
      if (this.scoreFlag) {
        let paylist5 = {}
        paylist5.paymode = 5
        paylist5.paymoney = this.score.Money
        paylist5.score = this.score.useScore
        this.paylist[index] = paylist5
        index++
        paymoney = paymoney - paylist5.paymoney
      }
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
      let data = new FormData()
      let requestData = {
        otc: '',
        Sendid: this.address.addressid,
        Usernote: this.usernote,
        paylist: this.paylist,
        Memcode: this.Memcode,
        Cpassword: this.Cpassword,
        channel: this.channel,
        freight: this.freightmoney.freightmoney,
        Tradeno: this.tradeno
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/orderCommit', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          // 微信支付
          if (res.data.beecloud) {
            let vm = this
            let wechatstr = res.data.beecloud.wechatPayStr
            if (typeof WeixinJSBridge === 'undefined') {
              if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(wechatstr, res.data.tradeno), false)
              } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(wechatstr, res.data.tradeno))
                document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady(wechatstr, res.data.tradeno))
              }
            } else {
              vm.onBridgeReady(wechatstr, res.data.tradeno)
            }
            return false
          } else {
            this.$message({
              message: '支付成功!',
              type: 'success'
            })
            this.orderdetail(res.data.tradeno)
          }
          return false
        } else if (res.code === 500) {
          if (res.data) {
            this.$message({
              message: res.msg,
              type: 'error'
            })
            this.orderdetail(res.data.tradeno)
            return false
          }
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 微信支付
    onBridgeReady (wechatstr, tradeno) {
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
            _this.$message({
              message: '支付失败！',
              type: 'error'
            })
            _this.orderdetail(tradeno)
          }
        }
      )
    },
    // 获取购物车商品
    getCart () {
      let data = new FormData()
      let requestData = {}
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/car/getCar', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$store.commit('setCart', res.data)
          if (this.cart.length) {
            let numsList = this.cart.map(item => item.amount)
            let nums = 0
            numsList.forEach(item => {
              nums += parseInt(item)
            })
            this.$store.commit('setCartnums', nums)
          } else {
            this.$store.commit('setCartnums', 0)
          }
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 去订单详情页面
    orderdetail (tradeno) {
      this.$store.commit('setOrder', '')
      this.$store.commit('setScore', '')
      this.$store.commit('setAddress', '')
      this.$store.commit('setFreightmoney', '')
      this.$store.commit('setTick', '')
      this.$store.commit('setTradeno', tradeno)
      this.getCart()
      this.$router.push({name: 'orderdetail'})
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
</style>
