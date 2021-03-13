<template>
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header @setStartdate="setStartdate" :addFlag="'dateFlag'">
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>积分变化</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff">
      <div class="userinfo_cont">
        <!-- card start -->
        <div class="card1 card_card colorffffff bgffffff">
          <div class="font36 colorffffff">可用积分</div>
          <div class="card_desc">
            <div class="font96 font_blod">{{Score}}</div>
            <div>分</div>
          </div>
        </div>
        <!-- card end -->
        <div class="score_cont">
          <!-- 加载中动画 start -->
          <loading v-if="isShowLoading"></loading>
          <!-- 下拉刷新动画 end -->
          <!-- 积分列表 start -->
          <div class="score_list">
            <ul v-if="scoreList.length">
              <li class="score_item" v-for="(item, index) in scoreList" :key="index">
                <div>
                  <div class="ellipsis">{{item.changetype}}</div>
                  <div class="font24 color999999">{{item.saletime}}</div>
                </div>
                <div class="font32">{{item.Score}}分</div>
              </li>
            </ul>
            <!-- 无信息提示 start -->
            <nodata v-else></nodata>
            <!-- 无信息提示 end -->
          </div>
          <!-- 积分列表 end -->
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
import tip from '@/utils/tip'

export default {
  name: 'scoreList',
  data () {
    return {
      // 积分记录列表
      scoreList: '',
      // 查询开始时间
      startdate: '',
      // 年度积分
      yearScore: 0,
      // 当前积分
      Score: 0,
      // 加载中动画
      isShowLoading: true
    }
  },
  computed: {
    date () {
      let self = this
      if (!self.startdate) {
        let nowdate = new Date()
        let timelength = 6 * 30 * 24 * 60 * 60 * 1000
        let startdate = new Date(nowdate - timelength).toLocaleString().split('午')[0]
        startdate = startdate.slice(0, startdate.length - 1)
        self.startdate = startdate
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
    // 获取积分记录列表
    getScoreList () {
      let self = this
      self.isShowLoading = true
      let data = {
        memcode: self.$store.state.userInfo.memcode,
        startdate: self.date
      }
      self.$api.mem.listScoreDtl(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.isShowLoading = false
          self.scoreList = res.data.dataList
          self.yearScore = res.data.yearScore
          self.Score = res.data.Score
        } else {
          tip(res.msg)
        }
      })
    },
    // 设置查询开始时间
    setStartdate (data) {
      let self = this
      self.startdate = data
      self.getScoreList()
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    let self = this
    // 获取积分记录列表
    self.getScoreList()
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
