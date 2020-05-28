<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header :froms="'userinfo'" :addFlag="'complaint'">
      <template v-slot:userinfo>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>投诉建议</template>
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
            <router-link :to="{name: 'complaintDetail', params: {id: item.id}}" tag="div" v-for="(item, index) in complaintList" :key="index" class="complaint_item bgffffff">
              <div class="bgffae43 border_r500"></div>
              <div class="complaint_title ellipsis">{{item.content}}</div>
              <div class="font22 color999999 tr">{{item.addtime}}</div>
            </router-link>
          </van-list>
        </van-pull-refresh>
      </div>
      <!-- 零钱列表 end -->
      <!-- 无信息提示 start -->
      <nodata v-else></nodata>
      <!-- 无信息提示 end -->
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import loading from '@/components/common/loading/loading'
import nodata from '@/components/common/nodata/nodata'

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
      isShowLoading: true
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
      this.page++
      this.getComplaintList()
    },
    onRefresh () {
      this.isShowLoading = true
      // 清空列表数据
      this.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.page = 0
      this.complaintList = []
      this.onLoad()
    },
    // 获取商品列表公共方法
    getComplaintList () {
      let data = new FormData()
      let requestData = {
        page: this.page,
        pageSize: this.pageSize
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/suggestion/listSuggestion', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.isShowLoading = false
          // 无数据时
          if (!res.data.totalSize) {
            this.finished = true
          }
          if (res.data.content && res.data.content.length) {
            let currentpage = this.page
            let total = Math.ceil(res.data.rowCount / this.pageSize)
            // 页码不足或者最后一页不足的情况
            if (currentpage > total || res.data.content.length < this.pageSize) {
              this.finished = true
            }
            // 刷新
            if (this.refreshing) {
              this.complaintList = res.data.content
              this.refreshing = false
            } else {
              this.complaintList.push(...res.data.content)
            }
            this.loading = false
          }
        } else {
          this.$toast({
            message: res.msg,
            type: 'fail'
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
    this.onLoad()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/userInfo.css";
.userinfo_main {
  position: relative;
}
</style>
