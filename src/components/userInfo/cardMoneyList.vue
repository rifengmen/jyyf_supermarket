<template>
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header @setStartdate="setStartdate" :addFlag="'dateFlag'">
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>卡值变化</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff">
      <div class="userinfo_cont">
        <!-- card start -->
        <div class="card_card card1 border_r8 colorffffff bgffffff">
          <div class="font36 colorffffff">可用余额</div>
          <div class="card_desc">
            <div class="font96 font_blod">{{Balancemoney}}</div>
            <div>元</div>
          </div>
        </div>
        <!-- card end -->
        <div class="score_cont">
          <!-- 加载中动画 start -->
          <loading v-if="isShowLoading"></loading>
          <!-- 下拉刷新动画 end -->
          <!-- 卡值列表 start -->
          <div class="score_list">
            <ul v-if="cardMoneyList.length">
              <li class="score_item" v-for="(item, index) in cardMoneyList" :key="index">
                <div>
                  <div class="ellipsis">{{item.changeType}}</div>
                  <div class="font24 color999999">{{item.Saletime}}</div>
                </div>
                <div class="font32">{{item.Changemoney}}元</div>
              </li>
            </ul>
            <!-- 无信息提示 start -->
            <nodata v-else></nodata>
            <!-- 无信息提示 end -->
          </div>
          <!-- 卡值列表 end -->
        </div>
      </div>
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import nodata from '@/components/common/nodata/nodata'
import loading from '@/components/common/loading/loading'
import tip from '@/utils/Toast'

export default {
  name: 'cardMoneyList',
  data () {
    return {
      maxDate: new Date(),
      currentDate: new Date(),
      // 卡值记录列表
      cardMoneyList: '',
      // 查询开始时间
      startdate: '',
      // 当前卡值
      Balancemoney: 0,
      // 加载中动画
      isShowLoading: true
    }
  },
  computed: {
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
    nodata,
    loading
  },
  methods: {
    // 获取卡值变化记录列表
    getCardMoneyList () {
      let self = this
      self.isShowLoading = true
      let data = {
        memcode: self.$store.state.userInfo.memcode,
        startdate: self.date
      }
      self.$api.mem.listMoneyCardDtl(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.isShowLoading = false
          self.cardMoneyList = res.data.dataList
          self.Balancemoney = res.data.Balancemoney
        } else {
          tip(res.msg)
        }
      })
    },
    // 设置查询开始时间
    setStartdate (data) {
      let self = this
      self.startdate = data
      self.getCardMoneyList()
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    let self = this
    // 获取积分记录列表
    self.getCardMoneyList()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/userInfo.css";
.score_cont {
  position: relative;
}
</style>
