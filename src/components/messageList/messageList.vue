<template>
    <div class="container bgeeeeee" v-title :data-title="$store.state.userInfo.deptname">
      <!-- 头部 start -->
      <my-header>
        <template v-slot:header>消息中心</template>
      </my-header>
      <!-- 头部 end -->
      <!-- 内容部分盒子 start -->
      <div class="cont_main bgffffff">
        <!-- 下拉刷新动画 start -->
        <loading v-if="isShowLoading"></loading>
        <!-- 下拉刷新动画 end -->
        <!-- 分类列表 start -->
        <div class="message_list">
          <my-scroll-message
            :messageList="messageList"
            :loadText="loadText"
            @pullingDown="_getMessageList"
            @pullingup="getMoreMessageList">
          </my-scroll-message>
        </div>
        <!-- 分类列表 end -->
      </div>
      <!-- 内容部分盒子 end -->
      <!-- 底部导航 start -->
      <my-footer></my-footer>
      <!-- 底部导航 end -->
    </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import MyFooter from '@/components/common/footer/myfooter'
import MyScrollMessage from '@/components/common/myscrollMessage/myscrollMessage'
import nodata from '@/components/common/nodata/nodata'
import loading from '@/components/common/loading/loading'

export default {
  name: 'messageList',
  data () {
    return {
      // 消息列表
      messageList: [],
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
      // 下拉刷新
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
    MyScrollMessage,
    nodata,
    loading
  },
  methods: {
    // 获取消息列表
    getMessageList () {
      this.isShowLoading = true
      let data = new FormData()
      let requestData = {
        messageFlag: '1',
        Page: this.page,
        pageSize: this.pageSize
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('info/InformationController/listmessage', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.isShowLoading = false
          this.messageList = res.data.content
          this.totalSize = res.data.totalSize
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
    // 下拉刷新
    _getMessageList () {
      this.page = this.resetpage
      this.getMessageList()
    },
    // 上拉加载更多
    getMoreMessageList () {
      this.page++
      let currentpage = this.page
      let total = Math.ceil(this.totalSize / this.pageSize)
      let data = new FormData()
      let requestData = {
        messageFlag: '1',
        Page: this.page,
        pageSize: this.pageSize
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      if (currentpage > total) {
        this.loadText = '暂无更多数据'
      } else {
        this.$axios.post('info/InformationController/listmessage', data).then(result => {
          this.$store.commit('setIsPullingUp', true)
          let res = result.data
          if (res.code === 200) {
            this.isShowLoading = false
            this.messageList.push(...res.data.content)
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
    this.getMessageList()
  }
}
</script>

<style scoped>
@import "./static/css/messageList.css";

</style>
