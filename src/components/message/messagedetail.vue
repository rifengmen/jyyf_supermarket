<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>消息详情</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="cont_main bgffffff">
      <div class="main_desc">
        <div class="tc font34 font_blod">{{messagedetail.title}}</div>
        <div class="tc font26 color666666">{{messagedetail.addtime}}</div>
        <div class="detail" v-html="messagedetail.content"></div>
      </div>
    </div>
    <!-- 内容部分盒子 -->
    <!-- 底部导航 start -->
    <my-footer></my-footer>
    <!-- 底部导航 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import MyFooter from '@/components/common/footer/myfooter'

export default {
  name: 'messagedetail',
  data () {
    return {
      // 消息id
      id: this.$route.params.id,
      // 消息详情
      messagedetail: ''
    }
  },
  computed: {},
  components: {
    MyHeader,
    MyFooter
  },
  methods: {
    // 获取消息详情
    getMessagedetail () {
      let data = new FormData()
      let requestData = {
        id: this.id
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('info/InformationController/listDtl', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.messagedetail = res.data
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
    this.getMessagedetail()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import 'static/css/message.css';

</style>
