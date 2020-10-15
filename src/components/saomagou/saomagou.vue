<template>
  <div class="container bgeeeeee">
    <div class="saomagou_cont">
      <div class="saoma bgffffff border_r12">
        <!-- 地址列表 start -->
        <div class="saoma_shopList border_r500" @click="isSetShopListFlag">
          <van-icon name="location-o" />
          <div class="shopname ellipsis" v-if="shopInfo">{{shopInfo.deptname}}</div>
        </div>
        <!-- 地址列表 end -->
        <!-- 扫码按钮 start -->
        <router-link :to="{name: 'saomacar', query: {type: 1}}" class="saomacar_btn border_r500">
          <div class="saoma_img">
            <img src="static/img/saomagou.png">
          </div>
          <div class="font32 colorffffff">扫商品</div>
        </router-link>
        <!-- 扫码按钮 end -->
      </div>
      <!-- 底部导航 start-->
      <div class="saoma_nav bgffffff border_r12">
        <!-- 购物车 start -->
        <router-link :to="{name: 'saomacar', query: {type: 2}}" tag="div" class="nav">
          <div class="nav_img">
            <img src="static/img/saomacar.png">
          </div>
          <div class="font32">购物车</div>
        </router-link>
        <!-- 购物车 end -->
        <!-- 订单 start -->
        <div class="nav" @click="toSaomaorderList">
          <div class="nav_img">
            <img src="static/img/saomaorderList.png">
          </div>
          <div class="font32">订单</div>
        </div>
        <!-- 订单 end -->
        <!-- 出场码 start -->
        <div class="nav" @click="toSaomaobar">
          <div class="nav_img">
            <img src="static/img/saomabar.png">
          </div>
          <div class="font32">出场码</div>
        </div>
        <!-- 出场码 end -->
      </div>
      <!-- 底部导航 end-->
    </div>
    <!-- 切换门店弹框 start -->
    <van-dialog v-model="shopListFlag" @confirm="setDeptcode" title="附件门店" show-cancel-button>
      <div class="shopList">
        <van-radio-group v-model="deptcode">
          <van-radio :name="item.deptcode" v-for="(item, index) in shopList" :key="index" class="van_radio">{{item.deptname}}</van-radio>
        </van-radio-group>
      </div>
    </van-dialog>
    <!-- 切换门店弹框 end -->
    <!-- 回到首页 start -->
    <router-link :to="{name: 'index'}" tag="div" class="toIndex border_r500 bgffffff">
      <img src="static/img/indexactive.png">
      <div class="font22">首页</div>
    </router-link>
    <!-- 回到首页 end -->
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'

export default {
  name: 'saomagou',
  data () {
    return {
      // 请求地址url,IOS为进入时url,Android为当前页面url
      curPageUrl: '',
      // 微信签名信息
      wxstr: '',
      // 店铺列表页显示开关
      shopListFlag: false,
      // 店铺编号
      deptcode: this.$store.state.shopInfo.deptcode,
      // 扫码购店铺列表
      shopList: [],
      // 经度
      lat: 0,
      // 纬度
      lng: 0
    }
  },
  computed: {
    // baseURL
    baseURL () {
      return this.$store.state.baseURL
    },
    // 店铺信息
    shopInfo () {
      return this.$store.state.shopInfo
    },
    // 扫码购物车
    saomacar () {
      return this.$store.state.saomacar
    }
  },
  components: {
  },
  methods: {
    // 获取用户地址信息
    getAddressInfo (isGet) {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        this.curPageUrl = this.baseURL + sessionStorage.getItem('jyyf_beforeLoginUrl')
      } else if (/(Android|Windows)/i.test(navigator.userAgent)) {
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
              'getLocation'
            ]
          })
          wx.ready(() => {
            // 获取定位
            wx.getLocation({
              type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function (res) {
                _this.lat = res.latitude // 纬度，浮点数，范围为90 ~ -90
                _this.lng = res.longitude // 经度，浮点数，范围为180 ~ -180。
                if (isGet || !_this.shopInfo) {
                  _this.getShopList(isGet)
                }
              },
              fail: function (res) {
                // alert(JSON.stringify(res))
              },
              cancel: function (res) {
                _this.$toast({
                  message: '已取消！',
                  type: 'fail'
                })
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
      // // 测试数据
      // this.lat = 37.858363
      // this.lng = 112.581113
      // if (isGet || !this.shopInfo) {
      //   this.getShopList(isGet)
      // }
    },
    // 获取附近店铺信息
    getShopList (isGet) {
      let data = new FormData()
      let requestData = {
        Latitude: this.lat,
        Longitude: this.lng
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/dept/listDeptInfo', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          // 如果没有店铺
          if (!res.data.list.length) {
            this.$toast({
              message: '附近暂无扫码购店铺!',
              type: 'fail'
            })
          } else if (res.data.list.length >= 1) { // 如果有多家店铺
            // 点击店铺获取附近店铺时不默认赋值
            if (!isGet) {
              this.$store.commit('setShopInfo', res.data.list[0])
              this.deptcode = res.data.list[0].deptcode
            }
            this.shopList = res.data.list
            if (isGet) {
              this.shopListFlag = true
            }
          }
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
    // 是否显示门店列表
    isSetShopListFlag () {
      if (this.saomacar.length) {
        this.$toast({
          message: '购物车存在商品，如需切换门店请退出重进！',
          type: 'fail',
          duration: 3000
        })
        return false
      }
      this.getAddressInfo(true)
    },
    // 设置购物门店
    setDeptcode () {
      let shopInfo = this.shopList.filter(item => item.deptcode === this.deptcode)[0]
      this.$store.commit('setShopInfo', shopInfo)
    },
    // 去订单列表页面
    toSaomaorderList () {
      // if (!this.shopInfo.deptcode) {
      //   this.$toast({
      //     message: '请选择店铺！',
      //     type: 'fail'
      //   })
      //   return false
      // }
      this.$router.push({name: 'saomaorderList'})
    },
    // 去出场码页面
    toSaomaobar () {
      if (!this.shopInfo.deptcode) {
        this.$toast({
          message: '请选择店铺！',
          type: 'fail'
        })
        return false
      }
      let data = new FormData()
      let requestData = {
        deptcode: this.shopInfo.deptcode
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/getFlowno', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$router.push({name: 'saomabar', query: {saomabar: res.data.barimg, flowno: res.data.orderInfo.flowno}})
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
  beforeCreate () {
  },
  created () {
    // 不存在店铺信息时请求定位
    if (!this.shopInfo) {
      this.getAddressInfo(false)
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
