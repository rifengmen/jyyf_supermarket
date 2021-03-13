<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container bgeeeeee" v-title :data-title="goodsname">
    <!-- 商品 start -->
    <div class="goods_cont bgeeeeee">
      <!-- 商品banner start -->
      <div class="goods_img bgffffff">
        <!-- 商品视频简介 start -->
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
          v-if="playerOptions.sources[0].src"></video-player>
        <!-- 商品视频简介 end -->
        <!-- 商品轮播图简介 start -->
        <van-swipe
          class="banner_swipe"
          :autoplay="3000"
          indicator-color="#ff6400"
          @change="onChangePage"
          v-if="!playerOptions.sources[0].src && goodsPictureList.length">
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
        <!-- 商品轮播图简介 end -->
        <!-- 活动提醒 start -->
        <div class="promotemode_age bg000000_40" v-if="!goodsdetail.startstate && goodsdetail.promotestart && goodsdetail.oldpromotemode">
          <div class="desc">
            <div class="modenote colorffffff bgff6400 font28 border_r4">{{goodsdetail.modenote}}</div>
            <div class="colorffffff font22">活动时间：{{goodsdetail.promotestart}} - {{goodsdetail.promoteend}}</div>
          </div>
          <div class="price colorff6400 font36">¥{{goodsdetail.oldpromotevalue}}</div>
        </div>
        <!-- 活动提醒 end -->
      </div>
      <!-- 商品banner end -->
      <!-- 商品简介 start -->
      <div class="goods_desc bgffffff border_r6">
        <div class="goods_promot">
          <div class="goods_price_cont">
            <div class="goods_price">
              <!-- 标签 start -->
              <div class="goods_promot_age font24 colorffffff borderffffff border_r4" v-if="goodsdetail.promotemode">{{goodsdetail.modenote}}</div>
              <!-- 标签 end -->
              <!-- 销售价 start -->
              <div class="font32 font_blod colorffffff" v-if="goodsdetail.promotevalue">￥{{goodsdetail.promotevalue}}</div>
              <div class="font32 font_blod colorffffff" v-else>￥{{goodsdetail.saleprice}}</div>
              <!-- 销售价 end -->
              <!-- 原价 start -->
              <del class="font20 color999999" v-if="goodsdetail.promotevalue && goodsdetail.promotevalue !== goodsdetail.saleprice">￥{{goodsdetail.saleprice}}</del>
              <!-- 原价 end -->
            </div>
          </div>
          <!-- 倒计时 start -->
          <div class="countdown" v-show="goodsdetail.startstate && goodsdetail.promotemode">
            <div class="font20 colorffffff">距结束还剩:</div>
            <div class="countdown_cont">
              <countdown
                      :times="goodsdetail.promoteend"
                      :type="0"
                      @promotemodeEnd="promotemodeEnd"></countdown>
            </div>
          </div>
          <div class="countdown" v-if="!goodsdetail.startstate && goodsdetail.promotestart">
            <div class="font20 colorffffff">距开始还剩：</div>
            <div class="countdown_cont">
              <countdown
                      :times="goodsdetail.promotestart"
                      :type="1"
                      @promotemodeStart="promotemodeStart"></countdown>
            </div>
          </div>
          <!-- 倒计时 end -->
        </div>
        <div class="goods_desc_name">
          <div class="goods_name">{{goodsdetail.cusgoodsname}}</div>
          <div class="goods_name colorff6400 font24" v-if="goodsdetail.promotemode === 6">【{{goodsdetail.topamount + 1}}人成团】</div>
          <div class="goods_name colorff6400 font24" v-if="goodsdetail.promotemode === 8">【{{goodsdetail.topamount}}人砍价】</div>
          <div class="goods_name colorfa2a2a font24">{{goodsdetail.remark}}</div>
          <div class="goods_name color999999 font24" v-if="goodsdetail.deliverdesc">配送费说明：{{goodsdetail.deliverdesc}}</div>
        </div>
      </div>
      <!-- 商品简介 end -->
    </div>
    <!-- 商品 end -->
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
    <!-- 商品数量/样式 start -->
    <div class="amount_style bg000000_60" v-if="standardflag" @click="setStandardflag">
      <div class="amount_style_cont bgffffff">
        <!-- 商品简介 start -->
        <div class="goods_li">
          <div class="goods_item bgffffff">
            <div class="goods_item_img">
              <img :src="(goodsdetail.picture1 ? (imgurl + 'image/' + goodsdetail.picture1.replace('.', '-zip-300.')) : ('static/img/goods.png'))">
            </div>
            <div class="goods_item_cont">
              <div class="goods_item_name ellipsis2 font26">{{goodsdetail.cusgoodsname}}</div>
              <div class="goods_item_editnum">
                <div class="goods_item_price goods_item_prices">
                  <!-- 销售价 start -->
                  <div class="font32 font_blod colorff6400" v-if="goodsdetail.promotevalue">￥{{goodsdetail.promotevalue}}</div>
                  <div class="font32 font_blod colorff6400" v-else>￥{{goodsdetail.saleprice}}</div>
                  <!-- 销售价 end -->
                  <!-- 原价 start -->
                  <del class="font20 color999999" v-if="goodsdetail.promotevalue && goodsdetail.promotevalue !== goodsdetail.saleprice">￥{{goodsdetail.saleprice}}</del>
                  <!-- 原价 end -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 商品简介 end -->
        <!-- 数量 start -->
        <div class="goods_amount">
          <div class="">购买数量</div>
          <div class="goods_nums">
            <div class="goods_num_btn goods_num_countnum borderc7c7c7 border_r4 tc font40 font_lighter color999999" @click.stop="countAmount">-</div>
            <div class="goods_num_input borderc7c7c7 border_r4 tc colorff6400 font30">{{amount}}</div>
            <div class="goods_num_btn goods_num_addnum borderc7c7c7 border_r4 tc font40 font_lighter color999999" @click.stop="addAmount">+</div>
          </div>
        </div>
        <!-- 数量 end -->
      </div>
    </div>
    <!-- 商品数量/样式 end -->
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
        <div class="addcart goods_btn tc colorffffff bgf7bb1f" v-if="goodsdetail.promotemode < 6 || goodsdetail.promotemode > 9">
          <addcart
                  :goodsid="goodsdetail.goodsid"
                  :amount="amount"
                  :froms="'goodsdetail'"
                  @setStandardflag="setStandardflag"
                  @isSetStandard="isSetStandard">加购物车</addcart>
        </div>
        <div class="pay goods_btn tc colorffffff bgff6400" v-if="goodsdetail.promotemode < 6 || goodsdetail.promotemode > 9">
          <addorder
                  :goods="goodsdetail"
                  :amount="amount"
                  :goodsdetail="true"
                  @isSetStandard="isSetStandard">立即购买</addorder>
        </div>
        <!-- 秒杀 start -->
        <div class="pay goods_btn tc colorffffff bgff6400" v-if="goodsdetail.promotemode === 7">
          <addorder
                  :goods="goodsdetail"
                  :amount="amount"
                  :goodsdetail="true"
                  @isSetStandard="isSetStandard">立即购买</addorder>
        </div>
        <!-- 秒杀 end -->
        <!-- 预售 start -->
        <div class="pay goods_btn tc colorffffff bgff6400" v-if="goodsdetail.promotemode === 9">
          <addorder
                  :goods="goodsdetail"
                  :amount="amount"
                  :goodsdetail="true"
                  @isSetStandard="isSetStandard">立即购买</addorder>
        </div>
        <!-- 预售 end -->
        <!-- 拼团按钮 start -->
        <div class="btns_cont" v-if="goodsdetail.promotemode === 6">
          <group
                  :goodsdetail="goodsdetail"
                  :groupno="groupno"
                  :joinno="joinno"
                  :groupdetail="groupdetail"
                  @isSetStandard="isSetStandard"></group>
        </div>
        <!-- 拼团按钮 end -->
        <!-- 砍价按钮 start -->
        <div class="btns_cont" v-if="goodsdetail.promotemode === 8">
          <bargain
                  :goodsdetail="goodsdetail"
                  :groupno="groupno"
                  :joinno="joinno"
                  :pay="pay"
                  :flag="flag"
                  @setStandardflag="setStandardflag"
                  @isSetStandard="isSetStandard"
                  @getBargainNo="getBargainNo"></bargain>
        </div>
        <!-- 砍价按钮 end -->
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
import tip from '@/utils/tip'

export default {
  name: 'goodsdetail',
  data () {
    return {
      // 图片路径
      imgurl: this.IMGURL,
      // 规格显示开关
      standardflag: false,
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
      // 活动号
      groupno: '',
      // 参团号
      joinno: '',
      // 拼团详情
      groupdetail: [],
      // 商品数量
      amount: 0,
      // 砍价支付状态
      pay: 0,
      // 是否是砍价发起人，即购买人
      flag: 0,
      // 促销类型
      Promotemode: this.$store.state.Promotemode,
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
    // 重定向对象
    redirect () {
      let self = this
      return self.$store.state.redirect
    },
    // 页面标题
    goodsname () {
      let self = this
      return self.$route.query.goodsname
    },
    // 购物车商品数量
    cartnums () {
      let self = this
      return self.$store.state.cartnums
    },
    // 图片列表
    goodsPictureList () {
      let self = this
      let arr = []
      let data = self.goodsdetail
      if (data) {
        if (data.picture1) {
          let str = self.IMGURL + 'image/' + data.picture1
          arr.push(str)
        }
        if (data.picture2) {
          let str = self.IMGURL + 'image/' + data.picture2
          arr.push(str)
        }
        if (data.picture3) {
          let str = self.IMGURL + 'image/' + data.picture3
          arr.push(str)
        }
        if (data.gdsimg2) {
          let str = self.IMGURL + 'image/' + data.gdsimg2
          arr.push(str)
        }
        if (data.gdsimg3) {
          let str = self.IMGURL + 'image/' + data.gdsimg3
          arr.push(str)
        }
        if (data.ingredientImage) {
          let str = self.IMGURL + 'image/' + data.ingredientImage
          arr.push(str)
        }
      }
      return arr
    },
    // baseURL
    baseURL () {
      let self = this
      return self.$store.state.baseURL
    }
  },
  components: {
    countdown,
    addcart,
    addorder,
    group,
    bargain
  },
  inject: ['reload'],
  methods: {
    // 是否弹出商品规格
    isSetStandard () {
      let self = this
      self.standardflag = true
      // 判断商品活动类别显示初始数量,有活动显示最大限购量，无活动显示1
      if (self.goodsdetail.promotemode === 7) {
        self.amount = self.goodsdetail.perlimit
      } else {
        self.amount = 1
      }
    },
    // 隐藏商品规格
    setStandardflag () {
      let self = this
      self.standardflag = !self.amount
      self.amount = 0
    },
    // 加
    addAmount () {
      let self = this
      let goodsdetail = self.goodsdetail
      // 判断限量
      if (goodsdetail.promotemode && goodsdetail.perlimit && (self.amount >= goodsdetail.perlimit)) {
        tip('已达最大限购量！')
        return false
      }
      self.amount++
    },
    // 减
    countAmount () {
      let self = this
      if (self.amount >= 2) {
        self.amount--
      }
    },
    // 页码指示器
    onChangePage (index) {
      let self = this
      self.goodsPage = index
    },
    // 放大图预览
    enlargedView () {
      let self = this
      self.showFlag = true
      self.startPage = self.goodsPage
    },
    // 放大图页码
    onChangeEnlarged (index) {
      let self = this
      self.enlargedViewPage = index
    },
    // 获取商品详情
    getGoodsdetail () {
      let self = this
      let data = {
        goodsid: self.goodsid,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.getById(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.goodsdetail = res.data
          self.$store.commit('setGoodsdetail', res.data)
          self.playerOptions.sources[0].src = res.data.videourl
          // 页面加载获取顾客商品拼团信息
          if (self.goodsdetail.promotemode === 6) {
            self.getGroupNo()
          }
          // 页面加载获取顾客商品的砍价信息
          if (self.goodsdetail.promotemode === 8) {
            self.getBargainNo()
          }
          // 获取微信凭证
          self.getWXConfig()
        } else {
          tip(res.msg)
        }
      })
    },
    // 开始商品活动
    promotemodeStart () {
      let self = this
      self.goodsdetail.startstate = 1
      self.goodsdetail.promotemode = self.goodsdetail.oldpromotemode
      self.goodsdetail.promotevalue = self.goodsdetail.oldpromotevalue
    },
    // 结束商品活动
    promotemodeEnd () {
      let self = this
      self.goodsdetail.promotemode = 0
      self.goodsdetail.startstate = 0
      self.goodsdetail.promotevalue = self.goodsdetail.saleprice
      self.goodsdetail.promotestart = ''
      self.goodsdetail.promoteend = ''
    },
    // 获取拼团信息
    getGroupNo () {
      let self = this
      let data = {
        goodsid: self.goodsid,
        amount: 1,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.groupIncrease(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          if (res.data && res.data.temlist.length) {
            self.groupno = res.data.groupno
            self.groupdetail = res.data.temlist
          }
        }
      })
    },
    // 获取砍价信息
    getBargainNo () {
      let self = this
      let data = {
        goodsid: self.goodsid.toString(),
        amount: 1,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.generateHackBill(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          if (res.data && res.data.list.length) {
            self.groupno = res.data.list[0].groupno
            self.pay = res.data.pay
            self.flag = res.data.flag
          }
        }
      })
    },
    // 获取微信凭证
    getWXConfig () {
      let self = this
      if (self.goodsid) {
        self.shareConfig = {
          title: self.goodsdetail.cusgoodsname,
          desc: self.goodsdetail.remark,
          link: self.$store.state.baseURL + '/goodsdetail?dianpu=' + self.$store.state.wechatID + '&goodsid=' + self.goodsdetail.goodsid + '&goodsname=' + encodeURIComponent(self.goodsdetail.cusgoodsname),
          imgUrl: self.IMGURL + 'image/' + self.goodsdetail.picture1
        }
      }
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        self.curPageUrl = self.baseURL + self.redirect.fullPath
      } else if (/(Android|Windows)/i.test(navigator.userAgent)) {
        self.curPageUrl = window.location.href
      } else {
        self.curPageUrl = window.location.href
      }
      let data = {
        wechatID: self.$store.state.wechatID,
        curPageUrl: self.curPageUrl
      }
      self.$api.api.getWXConfig(data).then(result => {
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
              title: self.shareConfig.title,
              desc: self.shareConfig.desc,
              link: self.shareConfig.link.replace('&code=', ''),
              imgUrl: self.shareConfig.imgUrl,
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
              title: self.shareConfig.title,
              link: self.shareConfig.link.replace('&code=', ''),
              imgUrl: self.shareConfig.imgUrl,
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
              title: self.shareConfig.title,
              desc: self.shareConfig.desc,
              link: self.shareConfig.link.replace('&code=', ''),
              imgUrl: self.shareConfig.imgUrl,
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
              title: self.shareConfig.title,
              link: self.shareConfig.link.replace('&code=', ''),
              imgUrl: self.shareConfig.imgUrl,
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
              title: self.shareConfig.title,
              desc: self.shareConfig.desc,
              link: self.shareConfig.link.replace('&code=', ''),
              imgUrl: self.shareConfig.imgUrl,
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
          tip({
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
    let self = this
    // 页面加载时获取商品详情
    self.getGoodsdetail()
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
