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
      <div class="tick_list">
        <my-scroll-complaint
          :complaintList="complaintList"
          :loadText="loadText"
          @pullingDown="_getComplaintList"
          @pullingup="getMoreComplaintList">
        </my-scroll-complaint>
      </div>
      <!-- 零钱列表 end -->
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import MyScrollComplaint from '@/components/common/myscrollComplaint/myscrollComplaint'
import nodata from '@/components/common/nodata/nodata'
import loading from '@/components/common/loading/loading'

export default {
  name: 'complaintList',
  data () {
    return {
      // 零钱记录列表
      complaintList: [],
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
  computed: {},
  components: {
    MyHeader,
    MyScrollComplaint,
    nodata,
    loading
  },
  methods: {
    // 获取投诉建议列表
    getComplaintList () {
      let data = new FormData()
      let requestData
      requestData = {
        page: this.page,
        pageSize: this.pageSize
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/suggestion/listSuggestion', data).then(result => {
        this.$store.commit('setIsPullingDown', true)
        let res = result.data
        if (res.code === 200) {
          this.isShowLoading = false
          this.complaintList = res.data.content
          this.totalSize = res.data.rowCount
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
    _getComplaintList () {
      this.page = this.resetpage
      this.getComplaintList()
    },
    // 上拉加载更多
    getMoreComplaintList () {
      this.page++
      let currentpage = this.page
      let total = Math.ceil(this.totalSize / this.pageSize)
      let data = new FormData()
      let requestData = {
        page: this.page,
        pageSize: this.pageSize
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      if (currentpage > total) {
        this.loadText = '暂无更多数据'
      } else {
        this.$axios.post('system/suggestion/listSuggestion', data).then(result => {
          this.$store.commit('setIsPullingUp', true)
          let res = result.data
          if (res.code === 200) {
            this.isShowLoading = false
            this.complaintList.push(...res.data.content)
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
    // 获取投诉建议列表
    this.getComplaintList()
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
