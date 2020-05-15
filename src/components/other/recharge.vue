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
      <!-- card start -->
      <div class="card card_card colorffffff bgffffff">
        <div class="font36 colorffffff">账户余额</div>
        <div class="card_desc">
          <div class="font96 font_blod">{{moneyDetail.moneyBal}}</div>
          <div>元</div>
        </div>
      </div>
      <!-- card end -->
      <!-- 本卡充值 start -->
      <div class="card_cont" v-if="!flag">
        <div class="section borderc7c7c7 border_r6">
          <input type="text" v-model="money" placeholder="请输入充值金额（元）">
        </div>
      </div>
      <!-- 本卡充值 end -->
      <!-- 他人充值 start -->
      <div class="card_cont" v-else>
        <div class="section borderc7c7c7 border_r6">
          <input type="text" v-model="cardno" placeholder="请输入会员卡号" onKeyUp="this.value = this.value.replace(/\D/g,'')">
        </div>
        <div class="section borderc7c7c7 border_r6">
          <input type="text" v-model="cardnos" placeholder="请再次输入会员卡号" onKeyUp="this.value = this.value.replace(/\D/g,'')">
        </div>
        <div class="section borderc7c7c7 border_r6">
          <input type="text" v-model="money" placeholder="请输入充值金额（元）" onKeyUp="this.value = this.value.replace(/\D\./g,'')">
        </div>
      </div>
      <!-- 他人充值 end -->
      <!-- 切换按钮 start -->
      <div class="section">
        <el-checkbox v-model="flag" @change="resetrecharge">为其他卡充值</el-checkbox>
      </div>
      <!-- 切换按钮 end -->
      <!-- 按钮部分 start -->
      <div class="btn_box section">
        <!-- 注册按钮 start -->
        <div class="send_btn border_r6 bgff7e42 colorffffff font32 font_normal" @click="isSend">去支付</div>
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
  name: 'recharge',
  data () {
    return {
      // 充值人员判断
      flag: false,
      // 充值金额
      money: '',
      // 充值卡号
      cardno: '',
      // 确认卡号
      cardnos: ''
    }
  },
  computed: {
    // 用户信息
    userInfo () {
      return this.$store.state.userInfo
    },
    // 户头信息
    moneyDetail () {
      return this.$store.state.moneyDetail
    }
  },
  components: {
    MyHeader
  },
  methods: {
    // 切换充值人员清空填写
    resetrecharge () {
      this.money = ''
      this.cardno = ''
      this.cardnos = ''
    },
    // 去充值
    isSend () {
      if (this.flag) {
        if (!this.cardno) {
          this.$message({
            message: '请输入会员卡号！',
            type: 'error'
          })
          return false
        }
        if (!this.cardnos) {
          this.$message({
            message: '请再次输入会员卡号！',
            type: 'error'
          })
          return false
        }
        if (this.cardno !== this.cardnos) {
          this.$message({
            message: '两次会员卡号不一致，请重新输入！',
            type: 'error'
          })
          return false
        }
        if (!this.money) {
          this.$message({
            message: '请输入充值金额！',
            type: 'error'
          })
          return false
        }
        this.sendRecharge()
      } else {
        if (!this.money) {
          this.$message({
            message: '请输入充值金额！',
            type: 'error'
          })
          return false
        }
        this.cardno = this.userInfo.memcode
        this.sendRecharge()
      }
    },
    // 发送充值信息
    sendRecharge () {
      let data = new FormData()
      let requestData = {
        card_no: this.cardno,
        toMoney: this.money,
        moneyType: 'add'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/reChargeToPay', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$router.push({name: 'rechargePay', params: {payData: res.data}})
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
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
