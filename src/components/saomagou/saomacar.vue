<template>
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>购物车</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 购物车 start -->
    <div class="car_cont">
      <div class="carlist">
        <!-- 购物车列表 start -->
        <div class="goodslist bgeeeeee">
          <ul ref="cartlist" v-if="saomacar.length">
            <!-- 商品简介 start -->
            <li class="goods_li" v-for="(item, index) in saomacar" :key="index">
              <div class="goods_item bgffffff ellipsis">
                <div class="goods_item_cont">
                  <div class="goods_item_name ellipsis font26">{{item.productName}}</div>
                  <div class="goods_item_editnum">
                    <div class="goods_item_price">
                      <div class="ellipsis font32 font_blod colorf84242">￥{{item.actualSaleMoney}}</div>
                      <del class="ellipsis font26 color999999" v-if="item.actualSaleMoney !== item.saleMoney">￥{{item.saleMoney}}</del>
                    </div>
                    <div class="goods_num">
                      <div class="goods_num_input tc color999999 font30" v-if="item.scalageFlag">×1</div>
                      <div class="goods_num_input tc color999999 font30" v-else>×{{item.quantity}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <!-- 商品简介 end -->
          </ul>
          <!-- 无信息提示 start -->
          <nodata v-else class="bgeeeeee"></nodata>
          <!-- 无信息提示 end -->
        </div>
        <!-- 购物车列表 end -->
        <!-- 结算信息 start -->
        <div class="pay_cont bgeeeeee">
          <div class="scan_manual">
            <div class="saomagou_img_up border_r500 bgffffff"></div>
            <div class="manual border_r500 bgffffff">
              <span class="font24">扫不出来，试试</span>
              <router-link :to="{name: 'manual'}" tag="span" class="font24 colorff6400">手动输入条形码</router-link>
            </div>
          </div>
          <div class="pay_des bgffffff">
            <div class="saomagou_img_down border_r500" @click="scangoodscode">
              <img src="static/img/saomagou.png">
            </div>
            <div class="cart_nums">
              <span class="font24 color666666">合计：</span>
              <span class="colorf86442 font32">￥{{totalmoney}}</span>
            </div>
            <div class="settlement bgff6400 colorffffff tc">
              <div @click="setTlement">结算（{{saomacar.length}}）</div>
            </div>
          </div>
        </div>
        <!-- 结算信息 end -->
      </div>
    </div>
    <!-- 购物车 end -->
    <!-- 商品信息弹框 start-->
    <van-dialog v-model="goodsInfoFlag" title="商品信息" :show-confirm-button="false">
      <div class="goodsInfo_cont">
        <div class="goodsInfo_name font32">{{goodsInfo.productName}}</div>
        <div class="">{{goodsInfo.barcode}}</div>
        <div class="font32 font_blod colorf84242">￥{{goodsInfo.actualSaleMoney}}</div>
        <del class="font26 color999999" v-if="goodsInfo.actualSaleMoney !== goodsInfo.saleMoney">￥{{goodsInfo.saleMoney}}</del>
      </div>
      <div class="scan_btn">
        <div class="btn color999999 bgffffff borderc7c7c7 border_r500" @click="addBack">加入返回</div>
        <div class="btn colorffffff bgff6400 borderff6400 border_r500" @click="addGoOn">加入继续</div>
      </div>
      <div class="closed font40" @click="closed">
        <van-icon name="close" />
      </div>
    </van-dialog>
    <!-- 商品信息弹框 end-->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import nodata from '@/components/common/nodata/nodata'
import wx from 'weixin-js-sdk'

export default {
  name: 'saomacar',
  data () {
    return {
      // 打开摄像头方式，1：页面打开时打开；2：点击扫一扫按钮打开
      type: this.$route.query.type,
      // 店铺信息
      shopInfo: this.$store.state.shopInfo,
      // 扫一扫调用开关
      scanFlag: true,
      // 商品条码
      goodscode: '',
      // 商品信息
      goodsInfo: '',
      // 商品信息弹框开关
      goodsInfoFlag: false,
      // 商品总价
      totalmoney: 0,
      // 流水号
      flowno: ''
    }
  },
  computed: {
    // 扫码购物车
    saomacar () {
      return this.$store.state.saomacar
    }
  },
  components: {
    MyHeader,
    nodata
  },
  methods: {
    // 扫一扫
    scangoodscode () {
      if (!this.shopInfo.deptcode) {
        this.$toast({
          message: '请选择店铺！',
          type: 'fail'
        })
        return false
      }
      // if (this.scanFlag) {
      // }
      this.scanFlag = false
      let _this = this
      wx.scanQRCode({
        // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
        needResult: 1,
        scanType: ['barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        desc: 'scanQRCode desc',
        success (res) {
          // 扫码后获取结果参数赋值给Input
          let result = res.resultStr
          if (result.indexOf(',') >= 0) {
            let str1 = result.split(',')
            // 订单号码
            _this.goodscode = str1[1]
            _this.scanFlag = true
            _this.getGoodsInfo()
          } else {
            _this.$toast({
              message: '请对准条形码扫码!',
              type: 'fail'
            })
          }
        }
      })
    },
    // 获取商品信息
    getGoodsInfo () {
      if (this.goodscode && this.shopInfo.deptcode) {
        let data = new FormData()
        let requestData = {
          barcode: this.goodscode,
          deptcode: this.shopInfo.deptcode
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.$axios.post('invest/microFlow/getProductDetailsByBarcode', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            this.goodsInfo = res.data
            this.goodsInfoFlag = true
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
    // 加入返回
    addBack () {
      let self = this
      // 添加商品到购物车
      self.addSaomacar()
      // 关闭弹框
      self.closed()
    },
    // 加入继续
    addGoOn () {
      let self = this
      // 添加商品到购物车
      self.addSaomacar('goOn')
      // 关闭弹框
      self.closed()
    },
    // 关闭弹框
    closed () {
      let self = this
      self.goodsInfoFlag = false
    },
    // 添加商品到购物车
    addSaomacar (e) {
      let self = this
      self.$store.commit('addSaomacar', self.goodsInfo)
      // 计算商品总价
      self.setTotalmoney()
      if (e) {
        // 扫一扫
        self.scangoodscode()
      }
    },
    // 计算商品总价
    setTotalmoney () {
      let money = 0
      this.saomacar.forEach((val, index) => {
        let _money
        // _money = parseFloat(val.quantity) * parseFloat(val.actualPrice)
        _money = parseFloat(val.actualSaleMoney)
        money += _money
      })
      this.totalmoney = money.toFixed(2)
    },
    // 结算
    setTlement () {
      if (!this.saomacar.length) {
        this.$toast({
          message: '请添加商品！',
          type: 'fail'
        })
        return false
      }
      let data = new FormData()
      let requestData = {
        productList: this.saomacar,
        deptcode: this.shopInfo.deptcode
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/saveFlow', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.flowno = res.data.flowno
          this.$store.commit('clearSaomacar')
          this.$router.push({name: 'saomaorder', query: {flowno: this.flowno, deptcode: this.shopInfo.deptcode, deptname: this.shopInfo.deptname}})
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
    if (this.$route.query.type === 1) {
      // 扫一扫
      this.scangoodscode()
    }
    // 计算商品总价
    this.setTotalmoney()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import 'static/css/saomagou.css';
.nodata {
  height: calc(100vh - 1.72rem - 1.1rem);
}
</style>
