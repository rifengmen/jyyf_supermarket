<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header @setStartdate="setStartdate" :addFlag="'dateFlag'">
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>购物评价</template>
      <template v-slot:addComplaint>
        <i class="el-icon-circle-plus"></i>
      </template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff">
      <!-- 加载中动画 start -->
      <loading v-if="isShowLoading"></loading>
      <!-- 下拉刷新动画 end -->
      <!-- 购物列表 start -->
      <div class="complaint_list" v-if="commentList.length">
        <div class="score_list">
          <ul>
            <div tag="li" v-for="(item, index) in commentList" :key="index">
              <router-link :to="{name: 'addComment', query: {goods: item}}" class="score_item color000000">
                {{item.gdsname}}
              </router-link>
            </div>
          </ul>
        </div>
      </div>
      <!-- 购物列表 end -->
      <!-- 无信息提示 start -->
      <nodata v-else class="bgeeeeee"></nodata>
      <!-- 无信息提示 end -->
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
  name: 'commentList',
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
      // 评价记录列表
      commentList: [],
      // 查询开始时间
      startdate: '',
      // 加载中动画
      isShowLoading: true,
      // 当前页码
      page: 0,
      // 每页显示条数
      pageSize: 15,
      // 目前总共多少条
      totalSize: '',
      // 目前总共多少页
      totalPages: ''
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
    // 获取评价记录列表
    getCommentList () {
      let self = this
      self.isShowLoading = true
      let data = {
        Cardnum: self.$store.state.userInfo.memcode,
        Startday: self.date,
        page: self.page,
        pageSize: self.pageSize
      }
      self.$api.mem.listShopEvaluation(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.isShowLoading = false
          self.loading = false
          self.commentList = JSON.parse(res.data)
        } else {
          tip(res.msg)
        }
      })
    },
    // 设置查询开始时间
    setStartdate (data) {
      let self = this
      self.startdate = data
      // 获取评价记录列表
      self.getCommentList()
    }
  },
  watch: {},
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('removeExcludeComponent', 'commentList')
      next()
    })
  },
  beforeRouteLeave (to, from, next) {
    let self = this
    let reg = /commentList/
    if (reg.test(to.name)) {
      self.$store.commit('removeExcludeComponent', 'commentList')
    } else {
      self.$store.commit('addExcludeComponent', 'commentList')
    }
    next()
  },
  beforeCreate () {
  },
  created () {
    let self = this
    // 获取评价记录列表
    self.getCommentList()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
.score_item {
  width: calc(100% - .48rem);
  min-height: 1.6rem;
  padding: 0 .24rem;
  border-bottom: 1px solid #f4f4f4;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nodata {
  height: calc(100vh - 1.1rem);
}
</style>
