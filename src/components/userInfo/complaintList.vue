<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header :addFlag="'complaint'" :evaluateflag="evaluateflag">
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header v-if="evaluateflag === 1">商品建议</template>
      <template v-slot:header v-else>我要投诉</template>
      <template v-slot:addComplaint>
        <i class="el-icon-circle-plus"></i>
      </template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff">
      <!-- 加载中动画 start -->
      <loading v-if="isShowLoading"></loading>
      <!-- 加载中动画 end -->
      <!-- 零钱列表 start -->
      <div class="complaint_list" v-if="complaintList.length">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            :offset="offset"
            finished-text="没有更多了"
            @load="onLoad">
            <router-link :to="{name: 'complaintDetail', query: {id: item.id, evaluateflag: evaluateflag}}" tag="div" v-for="(item, index) in complaintList" :key="index" class="complaint_item bgffffff">
              <div class="complaint_title ellipsis">{{item.content}}</div>
              <div class="font22 color999999 tr">{{item.addtime}}</div>
            </router-link>
          </van-list>
        </van-pull-refresh>
      </div>
      <!-- 零钱列表 end -->
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
  name: 'complaintList',
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
      // 零钱记录列表
      complaintList: [],
      // 当前页码
      page: 0,
      // 每页显示条数
      pageSize: 15,
      // 目前总共多少条
      totalSize: '',
      // 目前总共多少页
      totalPages: '',
      // 加载中动画
      isShowLoading: true,
      // 业务标识
      evaluateflag: parseFloat(this.$route.query.evaluateflag)
    }
  },
  computed: {},
  components: {
    MyHeader,
    loading,
    nodata
  },
  methods: {
    onLoad () {
      let self = this
      self.page++
      self.getComplaintList(self.evaluateflag)
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
      self.complaintList = []
      self.onLoad()
    },
    // 获取投诉建议列表公共方法
    getComplaintList (flag) {
      let self = this
      let data = {
        page: self.page,
        pageSize: self.pageSize,
        flag: flag
      }
      self.$api.system.listSuggestion(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.isShowLoading = false
          // 无数据时
          if (!res.data.rowCount) {
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
              self.complaintList = res.data.content
              self.refreshing = false
            } else {
              self.complaintList.push(...res.data.content)
            }
            self.loading = false
          }
        } else {
          tip(res.msg)
        }
      })
    }
  },
  watch: {},
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('removeExcludeComponent', 'complaintList')
      next()
    })
  },
  beforeRouteLeave (to, from, next) {
    let self = this
    let reg = /complaintDetail/
    if (reg.test(to.name)) {
      self.$store.commit('removeExcludeComponent', 'complaintList')
    } else {
      self.$store.commit('addExcludeComponent', 'complaintList')
    }
    next()
  },
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
@import "static/css/userInfo.css";
.nodata {
  height: calc(100vh - 1.1rem);
}
</style>
