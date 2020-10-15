<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>评价详情</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff">
      <!-- 商品信息 start -->
      <div class="order_section bgffffff">
        <div class="orderdesc">
          <div>商品名称</div>
          <div class="color666666">{{gdsname}}</div>
        </div>
      </div>
      <!-- 商品信息 end -->
      <!-- 评论区 start -->
      <div class="comment_cont">
        <div class="comment_desc">
        </div>
      </div>
      <!-- 评论区 end -->
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'

export default {
  name: 'commentdetail',
  data () {
    return {
      // 评价详情
      commentdetail: '',
      // 商品名称
      gdsname: this.$route.query.gdsname
    }
  },
  computed: {},
  components: {
    MyHeader
  },
  methods: {
    // 获取评价详情
    getCommentDetail () {
      let data = new FormData()
      let requestData = {
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.commentdetail = res.data
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
    // 页面加载时获取评价详情
    // this.getCommentDetail()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/userInfo.css";
</style>
