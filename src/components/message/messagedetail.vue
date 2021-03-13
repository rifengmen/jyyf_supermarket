<template>
  <div class="container_pt110 bgeeeeee">
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
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import tip from '@/utils/tip'

export default {
  name: 'messagedetail',
  data () {
    return {
      // 消息id
      id: this.$route.query.id,
      // 消息详情
      messagedetail: ''
    }
  },
  computed: {},
  components: {
    MyHeader
  },
  methods: {
    // 获取消息详情
    getMessagedetail () {
      let self = this
      let data = {
        id: self.id
      }
      self.$api.info.listDtl(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.messagedetail = res.data
        } else {
          tip(res.msg)
        }
      })
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    let self = this
    // 页面加载时获取消息详情
    self.getMessagedetail()
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
