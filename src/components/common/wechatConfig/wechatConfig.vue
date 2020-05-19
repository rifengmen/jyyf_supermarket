<template>
  <div class="wechatConfig">
    <!--<div class="scan_btn" v-if="wechats === 'scan'" @click="scanTradeno">-->
      <!--<img src="static/img/scan.png">-->
    <!--</div>-->
    <!--<div v-else></div>-->
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'

export default {
  name: 'wechatConfig',
  props: {
    wechats: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
      // 请求地址url,IOS为进入时url,Android为当前页面url
      curPageUrl: '',
      // 微信签名信息
      wxstr: '',
      // 分享时展示信息
      shareConfig: {
        title: this.$store.state.userInfo.deptname,
        // desc: this.$store.state.userInfo.sharedesc,
        desc: '这是测试，这是一段测试文字，这里是测试分享简介，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字，测试文字',
        link: 'https://www.spzlk.cn/index.html?dianpu=' + this.$store.state.wechatID,
        // imgUrl: this.$store.state.IMGURL + this.$store.state.userInfo.picture
        imgUrl: 'https://www.spzlk.cn/static/img/timg.jpg'
      }
    }
  },
  computed: {},
  components: {},
  methods: {
    // 请求微信参数
    getWXConfig () {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        this.curPageUrl = 'https://www.spzlk.cn/author'
      } else if (/(Android)/i.test(navigator.userAgent)) {
        this.curPageUrl = window.location.href
      }
      let data = new FormData()
      let requestData = {
        wechatID: this.$store.state.wechatID,
        curPageUrl: this.curPageUrl
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/payment/getWXConfig', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.wxstr = res.data
          let _this = this
          wx.config({
            // debug: true,
            debug: false,
            appId: _this.wxstr.appid,
            timestamp: _this.wxstr.timestamp,
            nonceStr: _this.wxstr.noncestr,
            signature: _this.wxstr.signure,
            // 所有要调用的 API 都要加到这个列表中
            jsApiList: [
              'scanQRCode',
              'updateAppMessageShareData',
              'updateTimelineShareData',
              'onMenuShareAppMessage',
              'onMenuShareTimeline',
              'onMenuShareWeibo'
            ]
          })
          wx.ready(() => {
            // 分享接口
            // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
            wx.updateAppMessageShareData({
              title: _this.shareConfig.title,
              desc: _this.shareConfig.desc,
              link: _this.shareConfig.link,
              imgUrl: _this.shareConfig.imgUrl,
              trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                // alert('用户点击分享给朋友')
              },
              success: function (res) {
                // alert('已分享')
              },
              cancel: function (res) {
                alert('已取消')
              },
              fail: function (res) {
                alert(JSON.stringify(res))
              }
            })
            // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
            wx.updateTimelineShareData({
              title: _this.shareConfig.title,
              link: _this.shareConfig.link,
              imgUrl: _this.shareConfig.imgUrl,
              trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                // alert('用户点击分享到朋友圈')
              },
              success: function (res) {
                // alert('已分享')
              },
              cancel: function (res) {
                alert('已取消')
              },
              fail: function (res) {
                alert(JSON.stringify(res))
              }
            })
            // 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareAppMessage({
              title: _this.shareConfig.title,
              desc: _this.shareConfig.desc,
              link: _this.shareConfig.link,
              imgUrl: _this.shareConfig.imgUrl,
              trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                // alert('用户点击发送给朋友')
              },
              success: function (res) {
                // alert('已分享')
              },
              cancel: function (res) {
                alert('已取消')
              },
              fail: function (res) {
                alert(JSON.stringify(res))
              }
            })
            // 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareTimeline({
              title: _this.shareConfig.title,
              link: _this.shareConfig.link,
              imgUrl: _this.shareConfig.imgUrl,
              trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                // alert('用户点击发送给朋友')
              },
              success: function (res) {
                // alert('已分享')
              },
              cancel: function (res) {
                alert('已取消')
              },
              fail: function (res) {
                alert(JSON.stringify(res))
              }
            })
            // 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareWeibo({
              title: _this.shareConfig.title,
              desc: _this.shareConfig.desc,
              link: _this.shareConfig.link,
              imgUrl: _this.shareConfig.imgUrl,
              trigger: function (res) {
                // alert('用户点击分享到微博')
              },
              complete: function (res) {
                alert(JSON.stringify(res))
              },
              success: function (res) {
                // alert('已分享')
              },
              cancel: function (res) {
                alert('已取消')
              },
              fail: function (res) {
                alert(JSON.stringify(res))
              }
            })
          })
          wx.error((res) => {
          })
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
    // 获取微信凭证
    this.getWXConfig()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
.wechatConfig {
  /*display: none;*/
}
.scan_btn {
  width: 100%;
  height: 100%;
}
.scan_btn img {
  width: 100%;
  height: 100%;
}
</style>
