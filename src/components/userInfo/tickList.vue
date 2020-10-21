<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>{{$route.query.header_tit}}</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main">
      <ticklist
        :froms="froms"
      ></ticklist>
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import ticklist from '@/components/common/tickList/tickList'

export default {
  name: 'tickList',
  data () {
    return {
    }
  },
  computed: {
    froms () {
      return this.$route.query.froms || 'userinfo'
    }
  },
  components: {
    MyHeader,
    ticklist
  },
  methods: {
  },
  watch: {},
  beforeCreate () {
  },
  created () {
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
