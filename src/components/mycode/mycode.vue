<template>
  <div class="container">
    <!-- 电子会员 start -->
    <div class="online bg373947">
      <div class="online_cont bgffffff border_r8">
        <div class="online_tit tc font32 colorffffff">{{codename}}</div>
        <div class="online_bar online_img">
          <img :src="online_bar !== 'static/img/goods.png' ? imgurl + online_bar : online_bar">
        </div>
        <div class="online_qr online_img">
          <img :src="online_qr !== 'static/img/goods.png' ? imgurl + online_qr : online_qr">
        </div>
        <div class="online_age">
          <img src="static/img/code_phone.png">
          <div class="font24 color999999">使用时向收银员展示</div>
        </div>
        <div class="online_num">
          <img src="static/img/code_score.png" v-if="codetype === 1">
          <img src="static/img/code_score.png" v-else>
          <div v-if="codetype === 1">积分<span class="colorff6400">{{score}}</span>分</div>
          <div v-else>余额￥<span class="colorff6400">{{money}}</span></div>
        </div>
      </div>
      <div class="online_btn">
        <div class="online_vip colorffffff border_r4 tc" @click="getOnlineVip">
          <img :src="codetype === 1 ? 'static/img/usercodeactive.png' : 'static/img/usercode.png'">
          <div :class="codetype === 1 ? 'colorff6400' : 'colorffffff'">会员码</div>
        </div>
        <div class="online_pay colorffffff border_r4 tc" @click="sendCpassword">
          <img :src="codetype === 1 ? 'static/img/paycode.png' : 'static/img/paycodeactive.png'">
          <div :class="codetype === 1 ? 'colorffffff' : 'colorff6400'">付款码</div>
        </div>
      </div>
    </div>
    <!-- 电子会员 end -->
    <!-- 密码弹框 start -->
    <van-dialog
      v-model="passwordShow"
      title="请输入会员密码"
      @confirm="getOnlinecard"
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
      :show="showKeyboard"
      @input="onInput"
      @delete="onDelete"
      @blur="showKeyboard = false"
    />
    <!-- 数字键盘 end -->
    <!-- 底部导航 start -->
    <my-footer></my-footer>
    <!-- 底部导航 end -->
  </div>
</template>

<script>
import MyFooter from '@/components/common/footer/myfooter'

export default {
  name: 'mycode',
  data () {
    return {
      // 密码弹框
      passwordShow: false,
      // 密码框是否聚焦
      showKeyboard: false,
      // 电子码名称
      codename: '会员码',
      // 电子码类型 codetype，1：会员码；2：付款码
      codetype: 1,
      // 图片路径
      imgurl: this.IMGURL,
      // 条码
      online_bar: 'static/img/goods.png',
      // 二维码
      online_qr: 'static/img/goods.png',
      // 储值卡支付密码
      Cpassword: ''
    }
  },
  computed: {
    // 积分
    score () {
      return this.$store.state.moneyDetail.totalCent
    },
    // 余额
    money () {
      return this.$store.state.moneyDetail.moneyBal
    }
  },
  components: {
    MyFooter
  },
  methods: {
    // 获取电子会员卡
    getOnlineVip () {
      let data = new FormData()
      let requestData = {
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/customlogin/myCard', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.codename = '会员码'
          this.codetype = 1
          this.online_bar = res.data.mybarcode
          this.online_qr = res.data.myqrcode
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
    onInput (key) {
      this.Cpassword = (this.Cpassword + key).slice(0, 4)
    },
    onDelete () {
      this.Cpassword = this.Cpassword.slice(0, this.Cpassword.length - 1)
    },
    // 输入储值卡支付密码
    sendCpassword () {
      this.passwordShow = true
      this.showKeyboard = true
      this.Cpassword = ''
    },
    // 获取储值卡付款码
    getOnlinecard () {
      let data = new FormData()
      let requestData = {
        Cpassword: this.Cpassword
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('mem/member/createPayMoneyStr', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.codename = '付款码'
          this.codetype = 2
          this.online_bar = res.data.payBarcode
          this.online_qr = res.data.payQrcode
        } else {
          this.$toast({
            message: res.msg,
            type: 'fail'
          })
        }
      }).catch(error => {
        throw error
      })
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    // 获取电子会员
    this.getOnlineVip()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/mycode.css";
</style>
