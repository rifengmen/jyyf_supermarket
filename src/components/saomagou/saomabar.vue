<template>
  <div class="container saomabar_cont">
    <!-- 出场码 start -->
    <div class="online bg373947" v-if="flag">
      <div class="online_cont bgffffff border_r8">
        <div class="online_tit tc font32 colorffffff">出场码</div>
        <div class="online_bar online_img">
          <img :src="saomabar !== 'static/img/goods.png' ? imgurl + saomabar : saomabar" @error="setSrc">
        </div>
        <div class="online_age">
          <img src="static/img/code_phone.png">
          <div class="font24 color999999">使用时向收银员展示</div>
        </div>
      </div>
      <div class="online_btn">
        <div class="online_vip colorffffff borderff6400 bgff6400 border_r4 tc" @click="toggleFlag">订单详情</div>
        <div class="online_pay colorffffff borderffffff border_r4 tc" @click="closeBar">关闭</div>
      </div>
    </div>
    <!-- 出场码 end -->
    <!-- 订单详情 start -->
    <div class="online bg373947" v-else>
      <div class="online_cont bgffffff border_r8">
        <div class="online_detailtit font32 font_blod bgf7f7f7">订单详情</div>
        <div class="online_detail">
          <ul>
            <!-- 商品简介 start -->
            <li class="goods_li" v-for="(item, index) in goodsList" :key="index">
              <div class="goods_item bgffffff ellipsis">
                <div class="goods_item_cont">
                  <div class="goods_item_name ellipsis font26">{{item.goodsName}}</div>
                  <div class="goods_item_editnum">
                    <div class="goods_item_price">
                      <div class="ellipsis color999999">￥{{item.actualPrice}}</div>
                      <del class="ellipsis color999999" v-if="item.actualPrice !== item.salePrice">￥{{item.salePrice}}</del>
                    </div>
                    <div class="goods_num">
                      <div class="goods_num_input tc color999999">×{{item.saleAmount}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <!-- 商品简介 end -->
          </ul>
        </div>
      </div>
      <div class="online_btn">
        <div class="online_vip colorffffff borderff6400 bgff6400 border_r4 tc" @click="toggleFlag">出场码</div>
        <div class="online_pay colorffffff borderffffff border_r4 tc" @click="closeBar">关闭</div>
      </div>
    </div>
    <!-- 订单详情 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import wx from 'weixin-js-sdk'
import tip from '@/utils/tip'

export default {
  name: 'saomabar',
  data () {
    return {
      // 出场码显示开关
      flag: true,
      // 图片基础路径
      imgurl: this.IMGURL,
      // 条码
      saomabar: this.$route.query.saomabar,
      // 订单flowno
      flowno: this.$route.query.flowno,
      // 订单详情
      saomaorderDetail: '',
      // 订单商品列表
      goodsList: ''
    }
  },
  computed: {
    // 重定向对象
    redirect () {
      let self = this
      return self.$store.state.redirect
    },
    // 店铺信息
    deptcode () {
      let self = this
      return self.$store.state.shopInfo.deptcode
    },
    deptname () {
      let self = this
      return self.$store.state.shopInfo.deptname
    }
  },
  components: {
    MyHeader
  },
  inject: ['reload'],
  methods: {
    // 获取用户地址信息
    wxGetLocation () {
      let self = this
      // 获取定位
      wx.ready(() => {
        wx.getLocation({
          type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
            self.lat = res.latitude // 纬度，浮点数，范围为90 ~ -90
            self.lng = res.longitude // 经度，浮点数，范围为180 ~ -180。
            self.getShopList()
          },
          fail: function (res) {
            // alert(JSON.stringify(res))
          },
          cancel: function (res) {
            tip('已取消')
          }
        })
      })
    },
    // 获取用户地址信息
    getAddressInfo () {
      let self = this
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
              'addCard',
              'openCard',
              'scanQRCode',
              'getLocation',
              'updateAppMessageShareData',
              'updateTimelineShareData',
              'onMenuShareAppMessage',
              'onMenuShareTimeline'
            ]
          })
          // 微信api注册
          self.wxGetLocation()
        }
      })
    },
    // 获取附近店铺信息
    getShopList () {
      let self = this
      let data = {
        Latitude: self.lat,
        Longitude: self.lng
      }
      self.$api.system.listDeptInfo(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          // 如果没有店铺
          if (!res.data.list.length) {
            tip('附近暂无扫码购店铺')
          } else if (res.data.list.length >= 1) { // 如果有多家店铺
            self.$store.commit('setShopInfo', res.data.list[0])
            // 设置页面title
            self.setTitle(res.data.list[0].deptname)
            // 去出场码页面
            self.toSaomaobar()
          }
        } else {
          tip(res.msg)
        }
      })
    },
    // 设置页面title
    setTitle (title) {
      let self = this
      document.title = title || self.$store.state.userInfo.deptname
    },
    // 去出场码页面
    toSaomaobar () {
      let self = this
      let data = {
        deptcode: self.deptcode
      }
      self.$api.invest.getFlowno(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.saomabar = res.data.barimg
          self.flowno = res.data.orderInfo.flowno
        } else {
          tip(res.msg)
        }
      })
    },
    // 切换出场码和详情
    toggleFlag () {
      let self = this
      self.flag = !self.flag
      if (!self.flag && !self.saomaorderDetail) {
        // 获取订单详情
        self.getSaomaorderDetail()
      }
    },
    // 获取订单详情
    getSaomaorderDetail () {
      let self = this
      let data = {
        flowno: self.flowno,
        deptcode: self.deptcode
      }
      self.$api.invest.listMicroFlowDtl(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.saomaorderDetail = res.data
          self.goodsList = res.data.gdscodeList
        } else {
          tip(res.msg)
        }
      })
    },
    // 设置图片路径
    setSrc () {
      let self = this
      if (self.$route.query.saomabar && self.$route.query.flowno) {
        self.reload()
      }
    },
    // 关闭出场码
    closeBar () {
      let self = this
      self.$router.push({name: 'saomagou'})
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    let self = this
    if (!self.$route.query.saomabar && !self.$route.query.flowno) {
      // 获取用户地址信息
      self.getAddressInfo(false)
    }
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import 'static/css/saomagou.css';

</style>
