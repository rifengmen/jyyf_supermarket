<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header @setStartdate="setStartdate" :addFlag="'dateFlag'">
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>中奖记录</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="other_main bgffffff">
      <!-- 加载中动画 start -->
      <loading v-if="isShowLoading"></loading>
      <!-- 加载中动画 end -->
      <!-- 分类列表 start -->
      <div class="lotterylist">
        <my-scroll-lottery
          :lotteryList="lotteryList"
          :loadText="loadText"
          @pullingDown="_getLotteryList"
          @pullingup="getMoreLotteryList">
        </my-scroll-lottery>
      </div>
      <!-- 分类列表 end -->
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import MyScrollLottery from '@/components/common/myscrollLottery/myscrollLottery'
import nodata from '@/components/common/nodata/nodata'
import loading from '@/components/common/loading/loading'

export default {
  name: 'lotteryList',
  data () {
    return {
      // 中奖记录
      lotteryList: [],
      // 查询时间
      startdate: '',
      // 重置当前页码
      resetpage: 1,
      // 当前页码
      page: 1,
      // 每页显示条数
      pageSize: 15,
      // 目前总共多少条
      totalSize: '',
      // 目前总共多少页
      totalPages: '',
      // 加载中动画
      isShowLoading: true,
      // 加载提示语
      loadText: '加载更多...'
    }
  },
  computed: {
    // 查询时间
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
    MyScrollLottery,
    nodata,
    loading
  },
  methods: {
    // 获取中奖记录
    getLotteryList () {
      this.isShowLoading = true
      let data = new FormData()
      let requestData = {
        startDate: this.date,
        Page: this.page,
        pageSize: this.pageSize
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/prize/listPrizeLog', data).then(result => {
        this.$store.commit('setIsPullingDown', true)
        let res = result.data
        if (res.code === 200) {
          this.isShowLoading = false
          this.lotteryList = res.data.content
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
    // 设置查询开始时间
    setStartdate (data) {
      this.startdate = data
      this.page = this.resetpage
      this.getLotteryList()
    },
    // 下拉刷新
    _getLotteryList () {
      this.page = this.resetpage
      this.getLotteryList()
    },
    // 上拉加载更多
    getMoreLotteryList () {
      this.page++
      let currentpage = this.page
      let total = Math.ceil(this.totalSize / this.pageSize)
      let data = new FormData()
      let requestData = {
        listtype: '2',
        Page: this.page,
        pageSize: this.pageSize
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      if (currentpage > total) {
        this.loadText = '暂无更多数据'
      } else {
        this.$axios.post('system/prize/listPrizeLog', data).then(result => {
          this.$store.commit('setIsPullingUp', true)
          let res = result.data
          if (res.code === 200) {
            this.isShowLoading = false
            this.lotteryList.push(...res.data.content)
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
      this.$store.commit('setIsPullingUp', false)
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    // 获取中奖记录
    this.getLotteryList()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/other.css";
.userinfo_main {
  position: relative;
}
</style>
