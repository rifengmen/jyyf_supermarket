<template>
  <div class="container bgffffff">
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
    <van-dialog v-model="goodsInfoFlag" @confirm="addSaomacar" title="商品信息" show-cancel-button>
      <div class="goodsInfo_cont">
        <div class="goodsInfo_name font32">{{goodsInfo.productName}}</div>
        <div class="">{{goodsInfo.barcode}}</div>
        <div class="font32 font_blod colorf84242">￥{{goodsInfo.actualSaleMoney}}</div>
        <del class="font26 color999999" v-if="goodsInfo.actualSaleMoney !== goodsInfo.salePrice">￥{{goodsInfo.salePrice}}</del>
      </div>
    </van-dialog>
    <!-- 商品信息弹框 end-->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'

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
  },
  components: {
    MyHeader
  },
  methods: {
    // 获取商品信息
    getGoodsInfo () {
      // 验证条码不为空
      if (!this.goodscode) {
        this.$toast({
          message: '请输入商品条码！',
          type: 'fail'
        })
        return false
      }
      // 验证店铺不为空
      if (!this.shopInfo.deptcode) {
        this.$toast({
          message: '请选择店铺！',
          type: 'fail'
        })
        return false
      }
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
    },
    // 添加商品到购物车
    addSaomacar () {
      this.$store.commit('addSaomacar', this.goodsInfo)
      this.$toast({
        message: '添加成功!',
        type: 'success'
      })
    },
    // 清空输入框
    clearGoodscode () {
      this.goodscode = ''
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
