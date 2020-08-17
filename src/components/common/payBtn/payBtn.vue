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
      return this.$store.state.address
    },
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
    },
    // 订单类型标识,1: 发起拼团，2：参与拼团，3：砍价订单
    ordertype () {
      return this.$route.query.ordertype || 0
    },
    // 团号
    groupno () {
      return this.$route.query.groupno || ''
    }
  },
  components: {},
  methods: {
    onInput (key) {
      this.Cpassword = (this.Cpassword + key).slice(0, 4)
    },
    onDelete () {
      this.Cpassword = this.Cpassword.slice(0, this.Cpassword.length - 1)
    },
    // 支付
    pay (e) {
      e.stopPropagation()
      if (!this.tradeno) {
        // 验证选择收货地址
        if (!this.address) {
          this.$toast({
            message: '请选择收货地址！',
            type: 'fail'
          })
          return false
        }
      }
      // 设置支付信息
      this.setPaymoney()
      // 验证输入会员密码
      if (this.paymodeid === '3') {
        let data = new FormData()
        let requestData = {
          paymode: 3,
          paymoney: (this.paylist.reverse()[0].paymoney).toFixed(2)
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.$axios.post('invest/microFlow/getInputPayPasswdFlag', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            // passwdflag,0:不输密码，1:输密码
            if (res.data.passwdflag) {
              this.passwordShow = true
              this.showKeyboard = true
              this.Cpassword = ''
            } else {
              this.sendpay()
            }
          } else {
            this.$toast({
              type: 'fail',
              message: res.msg
            })
          }
        }).catch(error => {
          throw error
        })
        return false
      }
      this.sendpay()
    },
    // 设置支付信息
    setPaymoney () {
      // 订单总金额
      let totalMoney
      if (this.froms === 'editorder') {
        totalMoney = this.order.totalMoney + parseFloat(this.freightmoney.freightmoney)
      } else {
        totalMoney = this.order.canPayMoney
      }
      // 零钱金额
      let smallmoney = this.order.smallmoney
      // console.log(totalMoney, '订单总金额')
      // 支付金额
      let paymoney = totalMoney
      // console.log(paymoney, '支付金额')
      // 支付列表下标
      let index = 0
      // 优惠券类型 1：金额券；2：折扣券
      // 优惠券
      if (this.tick) {
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
        paymoney = paymoney - paylist4.paymoney
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
      // 零钱
      if (this.order.smallmoney !== 0) {
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
        this.paylist[index] = paylist10
        index++
        if (this.froms !== 'againpay') {
          paymoney = paymoney - paylist10.paymoney
        }
      }
      // 储值卡
      if (this.paymodeid === '3') {
        let paylist3 = {}
        paylist3.paymode = 3
        if (paymoney < 0) {
          paymoney = 0
        }
        paylist3.paymoney = parseFloat(paymoney.toFixed(2))
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
        paylist7.paymoney = parseFloat(paymoney.toFixed(2))
        this.paylist[index] = paylist7
        index++
      }
    },
    // 发送支付信息
    sendpay () {
      let data = new FormData()
      let requestData = {
        totalmoney: this.order.totalMoney,
        ordertype: this.ordertype,
        otc: this.order.otc,
        isotc: this.order.isotc,
        goodsid: this.$route.query.goodsid || '',
        groupno: this.$route.query.groupno,
        amount: this.amount || 1,
        Sendid: this.address.addressid,
        Usernote: this.usernote,
        paylist: this.paylist,
        Memcode: this.Memcode,
        Cpassword: this.Cpassword,
        channel: this.channel,
        freight: this.freightmoney.freightmoney,
        Tradeno: this.tradeno,
        // 支付完成后返回路径
        frontUrl: this.$store.state.baseURL + '/userInfo?dianpu=' + this.$store.state.wechatID,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/orderCommit', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          // 微信支付
          if (res.data.beecloud) {
            let beecloud = res.data.beecloud
            if (beecloud.paymentchannel === 3) { // 银联商务结算
              alert('银联商务结算' + JSON.stringify(beecloud.unifiedPayStr.payUrl))
              window.location.href = beecloud.unifiedPayStr.payUrl
            } else if (beecloud.paymentchannel === 4) { // 太米结算
              sessionStorage.removeItem('jyyf_openid')
              window.location.href = beecloud.tmPayStr.payUrl
            } else if (beecloud.paymentchannel === 2) { // 微信官方结算
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
            }
          } else {
            if (parseInt(this.group) === 1) {
              this.groupAdd(res.data.tradeno)
              this.orderdetail(res.data.tradeno)
            } else if (parseInt(this.group) === 2) {
              this.groupEnd(res.data.tradeno)
              this.orderdetail(res.data.tradeno)
            } else {
              this.$toast({
                message: '支付成功！',
                type: 'success'
              })
              this.orderdetail(res.data.tradeno)
            }
          }
          return false
        } else {
          if (res.data) {
            this.$toast({
              message: res.msg,
              type: 'fail'
            })
            this.orderdetail(res.data.tradeno)
            return false
          }
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
    onBridgeReady (wechatstr, tradeno) {
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
            _this.$router.push({name: 'userInfo'})
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          } else if (_res.err_msg === 'get_brand_wcpay_request:cancel' || _res.err_msg === 'get_brand_wcpay_request:fail') {
            _this.$toast({
              message: '支付失败！',
              type: 'fail'
            })
            _this.orderdetail(tradeno)
          }
        }
      )
    },
    // 获取购物车商品
    getCart () {
      let data = new FormData()
      let requestData = {
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
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
          this.$toast({
            message: res.msg,
            type: 'fail'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 生成团信息
    groupAdd (tradeno) {
      let data = new FormData()
      let requestData = {
        goodsid: this.$route.query.goodsid,
        amount: this.amount,
        tradeno: tradeno,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/groupAdd', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$toast({
            message: '建团成功!',
            type: 'success'
          })
        } else {
          this.$toast({
            message: res.msg,
            type: 'fail'
          })
        }
      })
    },
    // 加入团信息
    groupEnd (tradeno) {
      let data = new FormData()
      let requestData = {
        goodsid: this.$route.query.goodsid,
        amount: this.amount,
        tradeno: tradeno,
        groupno: this.groupno,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/groupEnd', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$toast({
            message: '参团成功!',
            type: 'success'
          })
        } else {
          this.$toast({
            message: res.msg,
            type: 'fail'
          })
        }
      })
    },
    // 去会员中心页面
    orderdetail (tradeno) {
      this.$store.commit('setOrder', '')
      this.$store.commit('setScore', '')
      this.$store.commit('setAddress', '')
      this.$store.commit('setFreightmoney', '')
      this.$store.commit('setTick', '')
      this.getCart()
      this.$router.push({name: 'userInfo'})
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
