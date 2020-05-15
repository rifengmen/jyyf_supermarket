<template>
  <div class="container bgeeeeee" v-title :data-title="$store.state.userInfo.deptname">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>通知中心</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="cont_main bgffffff">
      <!-- 加载中动画 start -->
      <loading v-if="isShowLoading"></loading>
      <!-- 加载中动画 end -->
      <!-- 分类列表 start -->
      <div class="message_list">
        <my-scroll-notice
          :noticeList="noticeList"
          :loadText="loadText"
          @pullingDown="_getNoticeList"
          @pullingup="getMoreNoticeList">
        </my-scroll-notice>
      </div>
      <!-- 分类列表 end -->
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import MyFooter from '@/components/common/footer/myfooter'
import MyScrollNotice from '@/components/common/myscrollNotice/myscrollNotice'
import nodata from '@/components/common/nodata/nodata'
import loading from '@/components/common/loading/loading'

export default {
  name: 'noticeList',
  data () {
    return {
      // 消息列表
      noticeList: [],
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
  },
  components: {
    MyHeader,
    MyFooter,
    MyScrollNotice,
    nodata,
    loading
  },
  methods: {
    // 获取消息列表
    getNoticeList () {
      this.isShowLoading = true
      let data = new FormData()
      let requestData = {
        listtype: '2',
        page: this.page,
        pageSize: this.pageSize
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('info/InformationController/listNotice', data).then(result => {
        this.$store.commit('setIsPullingDown', true)
        let res = result.data
        if (res.code === 200) {
          this.isShowLoading = false
          this.noticeList = res.data.content
          this.totalSize = res.data.totalSize
        }
      }).catch(error => {
        throw error
      })
    },
    // 下拉刷新
    _getNoticeList () {
      this.page = this.resetpage
      this.getNoticeList()
    },
    // 上拉加载更多
    getMoreNoticeList () {
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
        this.$axios.post('info/InformationController/listNotice', data).then(result => {
          this.$store.commit('setIsPullingUp', true)
          let res = result.data
          if (res.code === 200) {
            this.isShowLoading = false
            this.noticeList.push(...res.data.content)
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
  created () {
    // 页面加载时获取消息列表
    this.getNoticeList()
  }
}
</script>

<style scoped>
@import "static/css/message.css";
.cont_main {
  position: relative;
}
</style>
