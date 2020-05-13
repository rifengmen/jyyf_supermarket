<template>
  <div class="container">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>{{$route.params.header_tit}}</template>
    </my-header>
    <!-- 头部 end -->
    <div class="userlist">会员中心列表</div>
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'

export default {
  name: 'userList',
  props: {
    // 会员中心列表，通过接收到的参数判断加载信息，1：支付密码
    msg_status: {
      type: Number,
      default: function () {
        return 1
      }
    }
  },
  data () {
    return {
    }
  },
  components: {
    MyHeader
  },
  methods: {
  },
  created () {
  }
}
</script>

<style scoped>
@import "static/css/userInfo.css";

</style>
