<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header :froms="'userinfo'" @setStartdate="setStartdate" :addFlag="'dateFlag'">
      <template v-slot:userinfo>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>购物评价</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff">
      <!-- 加载中动画 start -->
      <loading v-if="isShowLoading"></loading>
      <!-- 下拉刷新动画 end -->
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import nodata from '@/components/common/nodata/nodata'
import loading from '@/components/common/loading/loading'

export default {
  name: 'commentList',
  data () {
    return {
      // 评价记录列表
      commentList: '',
      // 查询开始时间
      startdate: '',
      // 加载中动画
      isShowLoading: true
    }
  },
  computed: {
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
    nodata,
    loading
  },
  methods: {
    // 获取评价记录列表
    getCommentList () {
      this.isShowLoading = true
      let data = new FormData()
      let requestData
      requestData = {
        Cardnum: this.$store.state.userInfo.memcode,
        Startday: this.date,
        Page: 1,
        pageSize: 20
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('mem/member/listMemberConsumGdscode', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.isShowLoading = false
          this.commentList = res.data
        } else {
          this.$toast({
            message: res.msg,
            type: 'fail'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 设置查询开始时间
    setStartdate (data) {
      this.startdate = data
      this.getScoreList()
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    // 获取评价记录列表
    this.getCommentList()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>
