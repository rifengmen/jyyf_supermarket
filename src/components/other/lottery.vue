<template>
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>积分抽奖</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="other_main">
      <!-- 加载中动画 start -->
      <loading v-if="isShowLoading"></loading>
      <!-- 加载中动画 end -->
      <div class="lottery_main" :style="{backgroundImage: 'url(' + (isturnbg ? IMGURL + 'image/' + bgUrl : './static/img/lotteryBgUrl.png') + ')', backgroundSize: '100%', backgroundRepeat: 'no-repeat'}">
        <div class="prizeUseCent">
          <router-link :to="{name: 'scoreList'}" class="myscore colorff6400 bgffffff font24 tc" tag="div">我的积分</router-link>
          <div class="use_cent colorff6400 bgffffff border_r500 tc">{{activeObj.prizeUseCent}}积分可抽奖一次</div>
          <router-link :to="{name: 'lotteryList'}" class="mylotterylist colorff6400 bgffffff font24 tc" tag="div">中奖记录</router-link>
        </div>
        <div class="lottery">
          <lottery-circle
            :activeObj="activeObj"
            :totalCent="totalCent"
            :isturnbg="isturnbg"
            :turnUrl="turnUrl"
            :btnUrl="btnUrl"
            @getResult="getResult"></lottery-circle>
        </div>
      </div>
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import loading from '@/components/common/loading/loading'
import LotteryCircle from '@/components/common/lottery_circle/lottery_circle'
import tip from '@/utils/Toast'

export default {
  name: 'lottery',
  data () {
    return {
      // 图片路径
      IMGURL: this.IMGURL,
      // 加载中动画
      isShowLoading: true,
      // 自定义抽奖图开关
      isturnbg: 0,
      // 背景图路径
      bgUrl: '',
      // 转盘图路径
      turnUrl: '',
      // 抽奖按钮图路径
      btnUrl: '',
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
      let self = this
      return self.$store.state.moneyDetail
    },
    // 查询时间，查询积分用
    date () {
      let self = this
      if (!self.startdate) {
        let dt = new Date()
        dt.setMonth(dt.getMonth() - 6)
        dt = dt.toLocaleString()
        dt = (dt.replace(/\//g, '-')).split(' ')[0]
        self.startdate = dt
      }
      return self.startdate
    }
  },
  components: {
    MyHeader,
    loading,
    LotteryCircle
  },
  methods: {
    // 获取奖项信息
    getActiveObj () {
      let self = this
      self.isShowLoading = true
      let data = {}
      self.$api.system.getPrizeList(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.isShowLoading = false
          self.activeObj = res.data
          self.isturnbg = parseFloat(res.data.isturnbg)
          self.bgUrl = res.data.bgUrl
          self.turnUrl = res.data.turnUrl
          self.btnUrl = res.data.prize_btnurl
        } else {
          tip(res.msg)
        }
      })
    },
    // 中奖
    getResult (prize) {
      // 抽奖成功弹窗
      tip(prize.prizename)
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    let self = this
    // 页面加载时获取奖项信息
    self.getActiveObj()
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
