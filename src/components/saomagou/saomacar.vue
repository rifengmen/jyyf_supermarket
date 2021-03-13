<template>
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header :addFlag="'saomacar'" @setEditflag="setEditflag">
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>购物车</template>
      <template v-slot:editflag>
        <div class="colorff6400 font24" v-if="editflag">完成</div>
        <div class="colorff6400 font24" v-else>编辑</div>
      </template>
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
              <div class="goods_input bgffffff" @click="delbtn(item.barcode)" v-if="editflag">
                <div class="delbtn bge42739 border_r500 font32 colorffffff tc">×</div>
              </div>
              <div class="goods_item bgffffff ellipsis">
                <div class="goods_item_cont">
                  <div class="goods_item_name ellipsis font26">{{item.productName}}</div>
                  <div class="goods_item_editnum" v-if="item.scalageScanProduct">
                    <div class="goods_item_price">
                      <div class="ellipsis font32 font_blod colorf84242">￥{{item.actualSaleMoney}}</div>
                      <del class="ellipsis font26 color999999" v-if="item.actualSaleMoney !== item.saleMoney">￥{{item.saleMoney}}</del>
                    </div>
                    <div class="goods_num">
                      <div class="goods_num_input tc color999999 font30">×1</div>
                    </div>
                  </div>
                  <div class="goods_item_editnum" v-else>
                    <div class="goods_item_price">
                      <div class="ellipsis font32 font_blod colorf84242">￥{{item.actualPrice}}</div>
                      <del class="ellipsis font26 color999999" v-if="item.actualPrice !== item.salePrice">￥{{item.salePrice}}</del>
                    </div>
                    <div class="goods_num">
                      <div class="goods_num_btn goods_num_countnum borderc7c7c7 border_r4 tc font40 font_lighter color999999" @click="countAmount(item)">-</div>
                      <div class="goods_num_input borderc7c7c7 border_r4 tc colorff6400 font30">
                        <input type="tel" v-model="item.quantity" @change="editAmount(item)" class="tc">
                      </div>
                      <div class="goods_num_btn goods_num_addnum borderc7c7c7 border_r4 tc font40 font_lighter color999999" @click="addAmount(item)">+</div>
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
            <div class="settlement bge42739 colorffffff tc" v-if="editflag">
              <div @click="clearSaomacar"  class="font34">清空购物车</div>
            </div>
            <div class="settlement bgff6400 colorffffff tc" v-else>
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
import tip from '@/utils/tip'

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
      flowno: '',
      // 编辑开关
      editflag: false
    }
  },
  computed: {
    // 扫码购物车
    saomacar () {
      let self = this
      return self.$store.state.saomacar
    }
  },
  components: {
    MyHeader,
    nodata
  },
  methods: {
    // 扫一扫
    scangoodscode () {
      let self = this
      if (!self.shopInfo.deptcode) {
        tip('请选择店铺！')
        return false
      }
      self.scanFlag = false
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
            self.goodscode = str1[1]
            self.scanFlag = true
            self.getGoodsInfo()
          } else {
            tip('请对准条形码扫码！')
          }
        }
      })
    },
    // 获取商品信息
    getGoodsInfo () {
      let self = this
      if (self.goodscode && self.shopInfo.deptcode) {
        let data = {
          barcode: self.goodscode,
          deptcode: self.shopInfo.deptcode
        }
        self.$api.invest.getProductDetailsByBarcode(data).then(result => {
          let res = result.data
          if (res.code === 200) {
            self.goodsInfo = res.data
            self.goodsInfo.addorder = true
            self.goodsInfoFlag = true
          } else {
            tip(res.msg)
          }
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
    // 编辑开关
    setEditflag () {
      let self = this
      if (!self.saomacar.length && !self.editflag) {
        tip('暂无扫码购商品！')
        return
      }
      self.editflag = !self.editflag
    },
    // 删除商品
    delbtn (barcode) {
      let self = this
      self.$store.commit('delSaomacar', barcode)
      // 计算商品总价
      self.setTotalmoney()
    },
    // 加
    addAmount (goods) {
      let self = this
      self.saomacar.forEach(item => {
        if (item.barcode === goods.barcode) {
          item.quantity++
        }
      })
      // 提交修改信息
      self.editAmount()
    },
    // 减
    countAmount (goods) {
      let self = this
      self.saomacar.forEach(item => {
        if (item.barcode === goods.barcode) {
          if (item.quantity > 1) {
            item.quantity--
          }
        }
      })
      // 提交修改信息
      self.editAmount()
    },
    // 提交修改信息
    editAmount () {
      let self = this
      self.$store.commit('setSaomacar', self.saomacar)
      // 计算商品总价
      self.setTotalmoney()
    },
    // 清空购物车
    clearSaomacar () {
      let self = this
      self.$store.commit('clearSaomacar')
    },
    // 计算商品总价
    setTotalmoney () {
      let self = this
      let money = 0
      self.saomacar.forEach(item => {
        let _money
        if (item.scalageScanProduct) {
          _money = parseFloat(item.actualSaleMoney)
        } else {
          _money = parseFloat(item.actualPrice) * item.quantity
        }
        money += _money
      })
      self.totalmoney = money.toFixed(2)
    },
    // 结算
    setTlement () {
      let self = this
      if (!self.saomacar.length) {
        tip('请添加商品！')
        return false
      }
      let data = {
        productList: self.saomacar,
        deptcode: self.shopInfo.deptcode
      }
      self.$api.invest.saveFlow(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.flowno = res.data.flowno
          self.$store.commit('clearSaomacar')
          self.$router.push({name: 'saomaorder', query: {flowno: self.flowno, deptcode: self.shopInfo.deptcode, deptname: self.shopInfo.deptname}})
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
    if (self.$route.query.type === 1) {
      // 扫一扫
      self.scangoodscode()
    }
    // 计算商品总价
    self.setTotalmoney()
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
