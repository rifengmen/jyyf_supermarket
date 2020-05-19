<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>积分抽奖</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="other_main lottery_main bge42739">
      <!--<div class="tc color666666">功能开发中，敬请期待...</div>-->
      <div class="lottery_list">
        <lottery-circle
          :activeObj="activeObj"
          :totalCent="totalCent"
          @getTotalCent="getTotalCent"
          @getResult="getResult"></lottery-circle>
      </div>
      <div class="score_desc bge42739">
        <div class="lottery_score">
          <p class="font34 tc colorffffff" >剩余积分: {{totalCent}}</p>
          <p class="tc colorffffff">每{{activeObj.prizeUseCent}}积分可抽奖一次</p>
        </div>
        <div class="btn_box scan_section">
          <!-- 确认按钮 start -->
          <router-link :to="{name: 'lotteryList'}" class="send_btn border_r6 borderff7e42 bgff7e42 colorffffff font32 font_normal" tag="div">我的中奖纪录</router-link>
          <!-- 确认按钮 end -->
        </div>
      </div>
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import LotteryCircle from '@/components/common/lottery_circle/lottery_circle'

export default {
  name: 'lottery',
  data () {
    return {
      // 用户积分
      totalCent: 0,
      // 奖项设置
      activeObj: {},
      // 查询积分用
      startdate: ''
    }
  },
  computed: {
    // 用户卡片信息
    moneyDetail () {
      return this.$store.state.moneyDetail
    },
    // 查询时间，查询积分用
    date () {
      let _this = this
      if (!this.startdate) {
        let dt = new Date()
        dt.setMonth(dt.getMonth() - 6)
        dt = dt.toLocaleString()
        dt = (dt.replace(/\//g, '-')).split(' ')[0]
        _this.startdate = dt
      }
      return this.startdate
    }
  },
  components: {
    MyHeader,
    LotteryCircle
  },
  methods: {
    // 获取奖项信息
    getActiveObj () {
      let data = new FormData()
      let requestData = {
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/prize/getPrizeList', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.activeObj = res.data
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
    // 获取积分
    getTotalCent () {
      let data = new FormData()
      let requestData = {
        memcode: this.$store.state.userInfo.memcode,
        startdate: this.date
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('mem/card/listScoreDtl', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.totalCent = res.data.Score
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
    // 中奖
    getResult (prize) {
      // 刷新积分
      this.getTotalCent()
      // 抽奖成功弹窗
      this.$message({
        message: prize.prizename,
        type: 'success'
      })
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    // 页面加载时获取奖项信息
    this.getActiveObj()
    // 获取积分
    this.getTotalCent()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/other.css";
.scan_section {
  margin: 0 auto;
}
.btn_box {
  padding-top: 0;
}
.send_btn {
  margin-bottom: .2rem;
}
</style>
