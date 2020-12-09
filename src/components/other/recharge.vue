<template>
  <div class="container_pt110 bgeeeeee">
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
      <div class="other_cont">
        <!-- card start -->
        <div class="card1 card_card colorffffff bgffffff">
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
          <van-checkbox
            v-model="flag"
            checked-color="#ff6400"
            @change="resetrecharge">
            为其他卡充值
          </van-checkbox>
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
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import tip from '@/utils/Toast'

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
      cardnos: '',
      // 充值类型
      moneyType: ''
    }
  },
  computed: {
    // 用户信息
    userInfo () {
      let self = this
      return self.$store.state.userInfo
    },
    // 户头信息
    moneyDetail () {
      let self = this
      return self.$store.state.moneyDetail
    }
  },
  components: {
    MyHeader
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
          self.moneyType = res.data.moneyType
        }
      })
    },
    // 切换充值人员清空填写
    resetrecharge () {
      let self = this
      self.money = ''
      self.cardno = ''
      self.cardnos = ''
    },
    // 去充值
    isSend () {
      let self = this
      if (self.flag) {
        if (!self.cardno) {
          tip('请输入会员卡号！')
          return false
        }
        if (!self.cardnos) {
          tip('请再次输入会员卡号！')
          return false
        }
        if (self.cardno !== self.cardnos) {
          tip('两次会员卡号不一致，请重新输入！')
          return false
        }
        if (!self.money) {
          tip('请输入充值金额！')
          return false
        }
        self.sendRecharge()
      } else {
        if (!self.money) {
          tip('请输入充值金额！')
          return false
        }
        self.cardno = self.userInfo.memcode
        // 发送充值信息
        self.sendRecharge()
      }
    },
    // 发送充值信息
    sendRecharge () {
      let self = this
      let data = {
        card_no: self.cardno,
        toMoney: self.money,
        moneyType: self.moneyType
      }
      self.$api.invest.reChargeToPay(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.$router.push({name: 'rechargePay', query: {payData: res.data, moneyType: self.moneyType}})
        } else {
          tip(res.msg)
        }
      })
    }
  },
  watch: {},
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('removeExcludeComponent', 'recharge')
      next()
    })
  },
  beforeRouteLeave (to, from, next) {
    let self = this
    let reg = /rechargePay/
    if (reg.test(to.name)) {
      self.$store.commit('removeExcludeComponent', 'recharge')
    } else {
      self.$store.commit('addExcludeComponent', 'recharge')
    }
    next()
  },
  beforeCreate () {
  },
  created () {
    let self = this
    // 获取用户会员卡信息
    self.getMyInfo()
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
