<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container">
    <!-- 头部 start -->
    <my-header v-if="!userInfo.typeflag">
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>电子会员</template>
    </my-header>
    <!-- 头部 end -->
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
    <my-footer v-if="userInfo.typeflag"></my-footer>
    <!-- 底部导航 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import MyFooter from '@/components/common/footer/myfooter'
import tip from '../../utils/Toast'

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
      // 获取付款码是否需要密码0:需要；1:不需要
      password_on: 0,
      // 储值卡支付密码
      Cpassword: ''
    }
  },
  computed: {
    // 用户信息
    userInfo () {
      return this.$store.state.userInfo
    },
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
    MyHeader,
    MyFooter
  },
  methods: {
    // 获取用户会员卡信息
    getMyInfo () {
      let self = this
      let data = {}
      self.$api.system.getMyInfo(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.$store.commit('setMemType', res.data.mem_type)
          self.$store.commit('setMoneyDetail', res.data.moneyDetail)
          self.password_on = parseFloat(res.data.password_on)
        }
      })
    },
    // 获取电子会员卡
    getOnlineVip () {
      let self = this
      let data = {}
      self.$api.system.myCard(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.codename = '会员码'
          self.codetype = 1
          self.online_bar = res.data.mybarcode
          self.online_qr = res.data.myqrcode
        } else {
          tip(res.msg)
        }
      })
    },
    onInput (key) {
      let self = this
      self.Cpassword = (self.Cpassword + key).slice(0, 4)
    },
    onDelete () {
      let self = this
      self.Cpassword = self.Cpassword.slice(0, self.Cpassword.length - 1)
    },
    // 输入储值卡支付密码
    sendCpassword () {
      let self = this
      // 判断获取付款码是否需要密码
      if (self.password_on) {
        // 获取储值卡付款码
        self.getOnlinecard()
      } else {
        self.passwordShow = true
        self.showKeyboard = true
        self.Cpassword = ''
      }
    },
    // 获取储值卡付款码
    getOnlinecard () {
      let self = this
      let data = {
        Cpassword: self.Cpassword
      }
      self.$api.mem.createPayMoneyStr(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.codename = '付款码'
          self.codetype = 2
          self.online_bar = res.data.payBarcode
          self.online_qr = res.data.payQrcode
        } else {
          tip(res.msg)
        }
      })
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    let self = this
    // 获取用户会员卡信息
    self.getMyInfo()
    // 获取电子会员
    self.getOnlineVip()
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
