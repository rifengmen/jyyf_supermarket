<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container_pt110 bgffffff">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>手动输入条形码</template>
    </my-header>
    <!-- 头部 end -->
    <div class="manual_cont">
      <div class="manual_input">
        <div class="inputs border_r8 bgeeeeee">
          <input type="number" v-model="goodscode" pattern="\d*" placeholder="请输入商品条码">
          <div class="clear_btn border_r500 bgffffff colorff6400 font24" v-if="goodscode" @click="clearGoodscode">
            <van-icon name="cross" />
          </div>
        </div>
        <div class="manual_btn border_r4 bgff6400 colorffffff" @click="getGoodsInfo">确认</div>
      </div>
      <div class="manual_des">
        <div class="manual_img">
          <img src="static/img/demobar.png">
        </div>
        <div class="font24 tc">请参照上图输入数字商品条形码</div>
      </div>
    </div>
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
import tip from '@/utils/Toast'

export default {
  name: 'manual',
  data () {
    return {
      // 商品条码
      goodscode: '',
      // 商品信息
      goodsInfo: '',
      // 商品信息弹框开关
      goodsInfoFlag: false,
      // 店铺信息
      shopInfo: this.$store.state.shopInfo
    }
  },
  computed: {
    // 扫码购物车
    saomacar () {
      return this.$store.state.saomacar
    }
  },
  components: {
    MyHeader
  },
  methods: {
    // 获取商品信息
    getGoodsInfo () {
      let self = this
      // 验证条码不为空
      if (!self.goodscode) {
        tip('请输入商品条码！')
        return false
      }
      // 验证店铺不为空
      if (!self.shopInfo.deptcode) {
        tip('请选择店铺！')
        return false
      }
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
    },
    // 加入返回
    addBack () {
      let self = this
      // 添加商品到购物车
      self.addSaomacar()
      // 关闭弹框
      self.closed()
      // 返回
      self.$router.back()
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
    addSaomacar () {
      let self = this
      self.$store.commit('addSaomacar', self.goodsInfo)
      tip('添加成功!')
    },
    // 清空输入框
    clearGoodscode () {
      let self = this
      self.goodscode = ''
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
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
