<template>
  <div class="container_pt110 bgeeeeee">
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
        <div class="detail" v-html="noticedetail.content" @click="previewImage"></div>
      </div>
    </div>
    <!-- 内容部分盒子 -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import wx from 'weixin-js-sdk'
import tip from '@/utils/Toast'

export default {
  name: 'noticedetail',
  data () {
    return {
      // 消息id
      id: this.$route.query.id,
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
      let self = this
      let data = {
        id: self.id
      }
      self.$api.info.listNoticeDtl(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.noticedetail = res.data
        } else {
          tip(res.msg)
        }
      })
    },
    // 放大图预览
    previewImage (e) {
      let self = this
      let imgList = []
      if (self.noticedetail) {
        let data = self.noticedetail.content
        imgList = data.match(/<img[^>]*src=['"]([^'"]+)[^>]*>/gi)
      }
      let srcList = []
      imgList.forEach(item => {
        item.replace(/<img[^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
          srcList.push(capture)
        })
      })
      let current = e.target.src
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: srcList // 需要预览图片http链接列表
      })
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    let self = this
    // 页面加载时获取消息详情
    self.getNoticedetail()
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
