<template>
  <div class="wechatConfig"></div>
</template>

<script>
import wx from 'weixin-js-sdk'

export default {
  name: 'wechatConfig',
  props: {
  },
  data () {
    return {
      // 商品详情页用，goodsid
      goodsid: this.$route.query.goodsid || '',
      // 请求地址url,IOS为进入时url,Android为当前页面url
      curPageUrl: '',
      // 微信签名信息
      wxstr: '',
      // 分享时展示信息
      shareConfig: {
        title: this.$store.state.userInfo.deptname,
        desc: this.$store.state.userInfo.sharedesc,
        link: this.$store.state.baseURL + '/?dianpu=' + this.$store.state.wechatID,
        imgUrl: this.IMGURL + 'image/' + this.$store.state.userInfo.picture
      }
    }
  },
  computed: {
    // baseURL
    baseURL () {
      return this.$store.state.baseURL
    },
    // 商品详情页用，商品详情
    goodsdetail () {
      return this.$store.state.goodsdetail
    },
    // token
    token () {
      return this.$axios.defaults.headers.common.Authorization || ''
    }
  },
  components: {},
  methods: {
    // 获取微信凭证
    getWXConfig () {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        this.curPageUrl = this.baseURL + sessionStorage.getItem('jyyf_beforeLoginUrl')
      } else if (/(Android|Windows)/i.test(navigator.userAgent)) {
        this.curPageUrl = window.location.href
      } else {
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
              'addCard',
              'openCard',
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
                // alert(JSON.stringify(res))
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
                // alert(JSON.stringify(res))
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
                // alert(JSON.stringify(res))
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
                // alert(JSON.stringify(res))
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
                // alert(JSON.stringify(res))
              }
            })
          })
          wx.error((res) => {
          })
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
    // token存在时执行
    if (this.token) {
      // 获取微信凭证
      this.getWXConfig()
    }
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
</style>
