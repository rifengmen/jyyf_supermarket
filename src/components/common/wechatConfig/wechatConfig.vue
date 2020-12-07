<template>
  <div class="wechatConfig"></div>
</template>

<script>
import wx from 'weixin-js-sdk'
import tip from '@/utils/Toast'

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
      let self = this
      return self.$store.state.baseURL
    },
    // 商品详情页用，商品详情
    goodsdetail () {
      let self = this
      return self.$store.state.goodsdetail
    },
    // token
    token () {
      let self = this
      return self.$axios.defaults.headers.common.Authorization || ''
    }
  },
  components: {},
  methods: {
    // 获取微信凭证
    getWXConfig () {
      let self = this
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        self.curPageUrl = self.baseURL + sessionStorage.getItem('jyyf_beforeLoginUrl')
      } else if (/(Android|Windows)/i.test(navigator.userAgent)) {
        self.curPageUrl = window.location.href
      } else {
        self.curPageUrl = window.location.href
      }
      let data = new FormData()
      let requestData = {
        wechatID: self.$store.state.wechatID,
        curPageUrl: self.curPageUrl
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      self.$axios.post('api/payment/getWXConfig', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.wxstr = res.data
          wx.config({
            // debug: true,
            debug: false,
            appId: self.wxstr.appid,
            timestamp: self.wxstr.timestamp,
            nonceStr: self.wxstr.noncestr,
            signature: self.wxstr.signure,
            // 所有要调用的 API 都要加到这个列表中
            jsApiList: [
              'addCard', // 卡包-领卡
              'openCard', // 卡包-开卡
              'scanQRCode', // 扫一扫
              'getLocation', // 获取当前定位
              'updateAppMessageShareData', // 分享
              'updateTimelineShareData', // 分享
              'onMenuShareAppMessage', // 分享
              'onMenuShareTimeline', // 分享
              'previewImage' // 图片预览
            ]
          })
          wx.ready(() => {
            // 分享接口
            // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
            wx.updateAppMessageShareData({
              title: self.shareConfig.title,
              desc: self.shareConfig.desc,
              link: self.shareConfig.link.replace('&code=', ''),
              imgUrl: self.shareConfig.imgUrl,
              trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                // alert('用户点击分享给朋友')
              },
              success: function (res) {
                console.log('success_res', res)
              },
              cancel: function (res) {
              },
              fail: function (res) {
                console.log('fail_res', res)
              }
            })
            // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
            wx.updateTimelineShareData({
              title: self.shareConfig.title,
              link: self.shareConfig.link.replace('&code=', ''),
              imgUrl: self.shareConfig.imgUrl
            })
            // 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareAppMessage({
              title: self.shareConfig.title,
              desc: self.shareConfig.desc,
              link: self.shareConfig.link.replace('&code=', ''),
              imgUrl: self.shareConfig.imgUrl
            })
            // 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareTimeline({
              title: self.shareConfig.title,
              link: self.shareConfig.link.replace('&code=', ''),
              imgUrl: self.shareConfig.imgUrl
            })
            console.log('self.shareConfig', self.shareConfig)
            console.log('self.baseURL', self.baseURL)
          })
          wx.error((res) => {
          })
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
    // token存在时执行
    if (self.token) {
      // 获取微信凭证
      self.getWXConfig()
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
