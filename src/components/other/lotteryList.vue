<template>
  <div class="container_pt110 bgeeeeee">
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
      <div class="lotterylist" v-if="lotteryList.length">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            :offset="offset"
            finished-text="没有更多了"
            @load="onLoad">
            <div class="lottery_item bgffffff" v-for="(item, index) in lotteryList" :key="index">
              <div class="lottery_title">
                <div class="ellipsis">{{item.prizeCent}}</div>
                <div class="font24 color999999">{{item.prizeDate}}</div>
              </div>
              <div class="prize_name font32 tr">{{item.prizeName}}</div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
      <!-- 分类列表 end -->
      <!-- 无信息提示 start -->
      <nodata v-else class="bgeeeeee"></nodata>
      <!-- 无信息提示 end -->
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import loading from '@/components/common/loading/loading'
import nodata from '@/components/common/nodata/nodata'
import tip from '@/utils/Toast'

export default {
  name: 'lotteryList',
  data () {
    return {
      // 是否处在加载状态
      loading: false,
      // 是否已加载完成
      finished: false,
      // 下拉刷新
      refreshing: false,
      // 滚动条与底部距离小于 offset 时触发load事件
      offset: 100,
      // 中奖记录
      lotteryList: [],
      // 查询时间
      startdate: '',
      // 当前页码
      page: 0,
      // 每页显示条数
      pageSize: 15,
      // 目前总共多少条
      totalSize: '',
      // 目前总共多少页
      totalPages: '',
      // 加载中动画
      isShowLoading: true
    }
  },
  computed: {
    // 查询时间
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
    nodata
  },
  methods: {
    onLoad () {
      let self = this
      self.page++
      self.getLotteryList()
    },
    onRefresh () {
      let self = this
      self.isShowLoading = true
      // 清空列表数据
      self.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      self.loading = true
      self.page = 0
      self.lotteryList = []
      self.onLoad()
    },
    // 获取中奖记录列表公共方法
    getLotteryList () {
      let self = this
      let data = {
        startDate: self.date,
        page: self.page,
        pageSize: self.pageSize
      }
      self.$api.system.listPrizeLog(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.isShowLoading = false
          // 无数据时
          if (!res.data.totalSize) {
            self.finished = true
          }
          if (res.data.content && res.data.content.length) {
            let currentpage = self.page
            let total = Math.ceil(res.data.rowCount / self.pageSize)
            // 页码不足或者最后一页不足的情况
            if (currentpage >= total || res.data.content.length < self.pageSize) {
              self.finished = true
            }
            // 刷新
            if (self.refreshing) {
              self.lotteryList = res.data.content
              self.refreshing = false
            } else {
              self.lotteryList.push(...res.data.content)
            }
            self.loading = false
          }
        } else {
          tip(res.msg)
        }
      })
    },
    // 设置查询开始时间
    setStartdate (data) {
      let self = this
      self.startdate = data
      self.onRefresh()
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    let self = this
    self.onLoad()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/other.css";
.nodata {
  height: calc(100vh - 1.1rem);
}
</style>
