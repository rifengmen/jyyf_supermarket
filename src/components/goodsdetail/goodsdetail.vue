<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container bgeeeeee" v-title :data-title="goodsname">
    <!-- 商品介绍 start -->
    <div class="goods_cont bgeeeeee">
      <!-- 商品视频简介 start -->
      <div class="goods_img bgffffff" v-if="playerOptions.sources[0].src">
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
        ></video-player>
      </div>
      <!-- 商品视频简介 start -->
      <!-- 商品轮播图简介 start -->
      <div class="goods_img bgffffff" v-if="!playerOptions.sources[0].src && goodsPictureList.length">
        <van-swipe
          class="banner_swipe"
          :autoplay="3000"
          indicator-color="#ff6400"
          @change="onChangePage">
          <van-swipe-item v-for="(item, index) in goodsPictureList" :key="index">
            <div class="img_box" @click="enlargedView">
              <img v-lazy="item">
            </div>
          </van-swipe-item>
          <template #indicator>
            <div class="custom-indicator bgff6400 border_r8 font22 colorffffff">
              {{ goodsPage + 1 }}/{{goodsPictureList.length}}
            </div>
          </template>
        </van-swipe>
      </div>
      <!-- 商品轮播图简介 end -->
      <div class="goods_desc bgffffff border_r6">
        <div class="goods_promot">
          <div class="goods_price_cont">
            <div class="goods_price" v-if="goodsdetail.promotemode === 0 || goodsdetail.promotemode === 2 || goodsdetail.promotemode === 3 || goodsdetail.promotemode === 8">
              <div class="goods_promot_age font24 colorffffff borderffffff border_r4" v-if="goodsdetail.promotemode !== 0">{{goodsdetail.modenote}}</div>
              <div class="font32 font_blod colorffffff">￥{{goodsdetail.saleprice}}</div>
            </div>
            <div class="goods_price" v-if="goodsdetail.promotemode === 1 || goodsdetail.promotemode === 6 || goodsdetail.promotemode === 7">
              <div class="goods_promot_age font24 colorffffff borderffffff border_r4">{{goodsdetail.modenote}}</div>
              <div class="font32 font_blod colorffffff">￥{{goodsdetail.promotevalue}}</div>
              <del class="font20 colorffc06e">￥{{goodsdetail.saleprice}}</del>
            </div>
          </div>
          <div class="countdown" v-if="goodsdetail.startstate === 1 && goodsdetail.promotemode !== 0 && goodsdetail.promoteend">
            <div class="font20 colorffffff">距结束还剩:</div>
            <div class="countdown_cont">
              <countdown :times="goodsdetail.promoteend"></countdown>
            </div>
          </div>
          <div class="countdown" v-if="goodsdetail.startstate === 0 && goodsdetail.promotemode !== 0 && goodsdetail.promoteend">
            <div class="font20 colorffffff">距开始还剩：</div>
            <div class="countdown_cont">
              <countdown :times="goodsdetail.promotestart"></countdown>
            </div>
          </div>
        </div>
        <div class="goods_desc_name">
          <div class="goods_name">{{goodsdetail.cusgoodsname}}</div>
          <div class="goods_name colorff6400 font24" v-if="goodsdetail.promotemode === 6">【{{goodsdetail.topamount}}人成团】</div>
          <div class="goods_name colorff6400 font24" v-if="goodsdetail.promotemode === 8">【{{goodsdetail.topamount}}人砍价】</div>
          <div class="goods_name colorfa2a2a font24">{{goodsdetail.remark}}</div>
        </div>
      </div>
    </div>
    <!-- 商品介绍 end -->
    <!-- 商品放大图 start -->
    <van-image-preview
      v-model="showFlag"
      @change="onChangeEnlarged"
      :images="goodsPictureList"
      :max-zoom="3"
      :min-zoom="1/3"
      :start-position="startPage"
      :closeable="true">
      <template v-slot:index>{{ enlargedViewPage + 1 }}/{{goodsPictureList.length}}</template>
    </van-image-preview>
    <!-- 商品放大图 end -->
    <!-- 购物车 start -->
    <div class="carts bgffffff">
      <div class="carts_btn">
        <router-link :to="{name: 'index'}" tag="div" class="carts_img">
          <img src="static/img/index.png">
        </router-link>
        <router-link :to="{name: 'cart'}" tag="div" class="carts_img">
          <img src="static/img/cart.png">
          <div class="carts_num tc border_r500 bgf75050 colorffffff font18 ellipsis">{{cartnums}}</div>
        </router-link>
        <router-link :to="{name: 'userInfo'}" tag="div" class="carts_img">
          <img src="static/img/userinfo.png">
        </router-link>
      </div>
      <div class="btns">
        <div class="addcart goods_btn tc colorffffff bgf7bb1f" v-if="goodsdetail.promotemode !== 6 && goodsdetail.promotemode !== 8">
          <addcart :goodsid="goodsdetail.goodsid" :froms="'goodsdetail'">加购物车</addcart>
        </div>
        <div class="pay goods_btn tc colorffffff bgff6400"  v-if="goodsdetail.promotemode !== 6 && goodsdetail.promotemode !== 8">
          <addorder :goods="goodsdetail" :goodsdetail="true">立即购买</addorder>
        </div>
        <!-- 拼团按钮--hhk--start-->
        <div class="btns_cont" v-if="goodsdetail.promotemode === 6">
          <group
            :goodsdetail="goodsdetail"
            :groupno="groupno"
            :joinno="joinno"
            :groupdetail="groupdetail"
          ></group>
        </div>
        <!-- 拼团按钮--hhk--end-->
        <!-- 砍价按钮--hhk--start-->
        <div class="btns_cont" v-if="goodsdetail.promotemode === 8">
          <bargain
            :goodsdetail="goodsdetail"
            :bargainno="bargainno"
            :joinno="joinno"
            :pay="pay"
            :flag="flag"
            @getBargainNo="getBargainNo"
          ></bargain>
        </div>
        <!-- 砍价按钮--hhk--end-->
      </div>
    </div>
    <!-- 购物车 end -->
  </div>
</template>

<script>
import countdown from '@/components/common/countdown/countdown'
import addcart from '@/components/common/addcart/addcart'
import addorder from '@/components/common/addorder/addorder'
import group from '@/components/common/goodsDetailBtn/group'
import bargain from '@/components/common/goodsDetailBtn/bargain'
import wx from 'weixin-js-sdk'

export default {
  name: 'goodsdetail',
  data () {
    return {
      // 放大图
      showFlag: false,
      // 放大图页码
      enlargedViewPage: 0,
      // 放大图开始页码
      startPage: 0,
      // 商品图片页码
      goodsPage: 0,
      // 商品goodsid
      goodsid: this.$route.query.goodsid,
      // 商品详情
      goodsdetail: {},
      // 促销类型
      Promotemode: this.$store.state.Promotemode,
      // 购物车列表
      cartList: [],
      // 拼团的团号
      groupno: '',
      // 参团号
      joinno: '',
      // 砍价号
      bargainno: '',
      // 拼团详情
      groupdetail: [],
      // 商品数量
      amount: 1,
      // 砍价支付状态
      pay: 0,
      // 是否是砍价发起人，即购买人
      flag: 0,
      // 商品视频简介
      playerOptions: {
        // playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          src: '', // 路径
          // src: '//img.tukuppt.com/video_show/8321488/00/17/55/5ec90401b03fe.mp4', // 路径
          type: 'video/mp4' // 类型
        }],
        // poster: '../../static/images/test.jpg', // 你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: false // 全屏按钮
        }
      },
      // 请求地址url,IOS为进入时url,Android为当前页面url
      curPageUrl: '',
      // 微信签名信息
      wxstr: '',
      // 分享时展示信息
      shareConfig: {}
    }
  },
  computed: {
    // 页面标题
    goodsname () {
      return this.$route.query.goodsname
    },
    // 购物车商品数量
    cartnums () {
      return this.$store.state.cartnums
    },
    // 图片列表
    goodsPictureList () {
      let arr = []
      let data = this.goodsdetail
      if (data) {
        if (data.picture1) {
          let str = this.IMGURL + 'image/' + data.picture1
          arr.push(str)
        }
        if (data.picture2) {
          let str = this.IMGURL + 'image/' + data.picture2
          arr.push(str)
        }
        if (data.picture3) {
          let str = this.IMGURL + 'image/' + data.picture3
          arr.push(str)
        }
        if (data.gdsimg2) {
          let str = this.IMGURL + 'image/' + data.gdsimg2
          arr.push(str)
        }
        if (data.gdsimg3) {
          let str = this.IMGURL + 'image/' + data.gdsimg3
          arr.push(str)
        }
        if (data.ingredientImage) {
          let str = this.IMGURL + 'image/' + data.ingredientImage
          arr.push(str)
        }
      }
      return arr
    },
    // baseURL
    baseURL () {
      return this.$store.state.baseURL
    }
  },
  components: {
    countdown,
    addcart,
    addorder,
    group,
    bargain
  },
  methods: {
    // 页码指示器
    onChangePage (index) {
      this.goodsPage = index
    },
    // 放大图预览
    enlargedView () {
      this.showFlag = true
      this.startPage = this.goodsPage
    },
    // 放大图页码
    onChangeEnlarged (index) {
      this.enlargedViewPage = index
    },
    // 获取商品详情
    getGoodsdetail () {
      let data = new FormData()
      let requestData = {
        goodsid: this.goodsid,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/getById', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.goodsdetail = res.data
          this.$store.commit('setGoodsdetail', res.data)
          this.playerOptions.sources[0].src = res.data.videourl
          // 页面加载获取顾客商品拼团信息
          if (this.goodsdetail.promotemode === 6) {
            this.getGroupNo()
          }
          // 页面加载获取顾客商品的砍价信息
          if (this.goodsdetail.promotemode === 8) {
            this.getBargainNo()
          }
          // 获取微信凭证
          this.getWXConfig()
        } else {
          this.$toast({
            message: res.msg,
            type: 'fail'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 获取拼团信息
    getGroupNo () {
      let data = new FormData()
      let requestData = {
        goodsid: this.goodsid,
        amount: 1,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/groupIncrease', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          if (res.data && res.data.temlist.length) {
            this.groupno = res.data.groupno
            this.groupdetail = res.data.temlist
          }
        }
      }).catch(error => {
        throw error
      })
    },
    // 获取砍价信息
    getBargainNo () {
      let data = new FormData()
      let requestData = {
        goodsid: this.goodsid.toString(),
        amount: 1,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/generateHackBill', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          if (res.data && res.data.list.length) {
            this.bargainno = res.data.list[0].groupno
            this.pay = res.data.pay
            this.flag = res.data.flag
          }
        }
      }).catch(error => {
        throw error
      })
    },
    // 获取微信凭证
    getWXConfig () {
      if (this.goodsid) {
        this.shareConfig = {
          title: this.goodsdetail.cusgoodsname,
          desc: this.goodsdetail.remark,
          link: this.$store.state.baseURL + '/goodsdetail?dianpu=' + this.$store.state.wechatID + '&goodsid=' + this.goodsdetail.goodsid + '&goodsname=' + encodeURIComponent(this.goodsdetail.cusgoodsname),
          imgUrl: this.IMGURL + 'image/' + this.goodsdetail.picture1
        }
      }
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
              link: _this.shareConfig.link.replace('&code=', ''),
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
              link: _this.shareConfig.link.replace('&code=', ''),
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
              link: _this.shareConfig.link.replace('&code=', ''),
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
              link: _this.shareConfig.link.replace('&code=', ''),
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
              link: _this.shareConfig.link.replace('&code=', ''),
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
  // 返回列表页需要缓存，去其他页面不需要缓存
  beforeRouteLeave (to, from, next) {
    let toReg = /classify/
    let toReg2 = /searchList/
    let toReg3 = /recommendList/
    let toReg4 = /classList/
    if (!toReg.test(to.name)) {
      this.$store.commit('addExcludeComponent', 'classify')
    } else if (toReg.test(to.name)) {
      this.$store.commit('removeExcludeComponent', 'classify')
    }
    if (!toReg2.test(to.name)) {
      this.$store.commit('addExcludeComponent', 'searchList')
    } else if (toReg2.test(to.name)) {
      this.$store.commit('removeExcludeComponent', 'searchList')
    }
    if (!toReg3.test(to.name)) {
      this.$store.commit('addExcludeComponent', 'recommendList')
    } else if (toReg3.test(to.name)) {
      this.$store.commit('removeExcludeComponent', 'recommendList')
    }
    if (!toReg4.test(to.name)) {
      this.$store.commit('addExcludeComponent', 'classList')
    } else if (toReg4.test(to.name)) {
      this.$store.commit('removeExcludeComponent', 'classList')
    }
    next()
  },
  beforeCreate () {
  },
  created () {
    // 页面加载时获取商品详情
    this.getGoodsdetail()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/goodsdetail.css";
</style>
