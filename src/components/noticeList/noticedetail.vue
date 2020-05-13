<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>通知详情</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="cont_main bgffffff">
      <div class="main_desc">
        <div class="tc font34 font_blod">{{noticedetail.title}}</div>
        <div class="tc font26 color666666">{{noticedetail.pubdate}}</div>
        <div class="detail" v-html="noticedetail.content"></div>
      </div>
    </div>
    <!-- 内容部分盒子 -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'

export default {
  name: 'noticedetail',
  data () {
    return {
      // 消息id
      id: this.$route.params.id,
      // 消息详情
      noticedetail: ''
    }
  },
  computed: {},
  components: {
    MyHeader
  },
  methods: {
    // 获取消息详情
    getNoticedetail () {
      let data = new FormData()
      let requestData = {
        id: this.id
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('info/InformationController/listNoticeDtl', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.noticedetail = res.data
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
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    // 页面加载时获取消息详情
    this.getNoticedetail()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import 'static/css/noticeList.css';

</style>
