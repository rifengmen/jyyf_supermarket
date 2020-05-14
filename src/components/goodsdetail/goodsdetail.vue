<template>
  <div class="container bgeeeeee" v-title :data-title="$store.state.userInfo.deptname">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>商品详情</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 商品介绍 start -->
    <div class="goods_cont bgeeeeee">
      <div class="goods_img bgffffff">
        <img :src="(goodsdetail.picture1 ? (imgurl + 'image/' + goodsdetail.picture1) : ('static/img/goods.png'))">
      </div>
      <div class="goods_desc bgffffff border_r6">
        <div class="goods_promot">
          <div class="goods_price_cont">
            <div class="goods_price" v-if="goodsdetail.promotemode === 0 || goodsdetail.promotemode === 2 || goodsdetail.promotemode === 3 || goodsdetail.promotemode === 8">
              <div class="goods_promot_age font24 colorffffff borderffffff border_r4" v-if="goodsdetail.promotemode !== 0">{{goodsdetail.modenote}}</div>
              <div class="font32 font_blod colorffffff">￥{{goodsdetail.saleprice}}</div>
            </div>
            <div class="goods_price" v-if="goodsdetail.promotemode === 1 || goodsdetail.promotemode === 7">
              <div class="goods_promot_age font24 colorffffff borderffffff border_r4">{{Promotemode[goodsdetail.promotemode]}}</div>
              <div class="font32 font_blod colorffffff">￥{{goodsdetail.promotevalue}}</div>
              <del class="font20 color999999">￥{{goodsdetail.saleprice}}</del>
            </div>
            <div class="goods_price" v-if="goodsdetail.Promotemode === 6">
              <div class="goods_promot_age font24 colorffffff borderffffff border_r4">{{Promotemode[goodsdetail.promotemode]}}</div>
              <div class="font32 font_blod colorffffff">￥{{goodsdetail.groupprice}}</div>
              <del class="font20 color999999">￥{{goodsdetail.saleprice}}</del>
            </div>
          </div>
          <div class="countdown" v-if="goodsdetail.startstate === 1 && goodsdetail.promotemode !== 0">
            <div class="font20 colorffffff">距结束还剩：</div>
            <div class="countdown_cont">
              <countdown :times="goodsdetail.promoteend"></countdown>
            </div>
          </div>
          <div class="countdown" v-if="goodsdetail.startstate === 0 && goodsdetail.promotemode !== 0">
            <div class="font20 colorffffff">距开始还剩：</div>
            <div class="countdown_cont">
              <countdown :times="goodsdetail.promotestart"></countdown>
            </div>
          </div>
        </div>
        <div class="goods_desc_name">
          <div class="goods_name ellipsis">{{goodsdetail.cusgoodsname}}</div>
          <div class="goods_name colorfa2a2a font24 ellipsis">{{goodsdetail.remark}}</div>
        </div>
      </div>
    </div>
    <!-- 商品介绍 end -->
    <!-- 购物车 start -->
    <div class="carts bgffffff">
      <router-link :to="{name: 'cart'}" tag="div" class="carts_img">
        <img src="static/img/cart.png">
        <div class="carts_num tc border_r500 bgf75050 colorffffff font22">{{cartnums}}</div>
      </router-link>
      <div class="btns">
        <div class="addcart tc font34 colorffffff bgffae43">
          <addcart :goodsid="goodsdetail.goodsid" :froms="'goodsdetail'">加入购物车</addcart>
        </div>
        <div class="pay tc font34 colorffffff bgff6400">
          <addorder :goodsid="goodsdetail.goodsid" :goodsdetail="true">立即购买</addorder>
        </div>
      </div>
    </div>
    <!-- 购物车 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import countdown from '@/components/common/countdown/countdown'
import addcart from '@/components/common/addcart/addcart'
import addorder from '@/components/common/addorder/addorder'

export default {
  name: 'goodsdetail',
  data () {
    return {
      // 商品goodsid
      goodsid: this.$store.state.goodsid,
      // 商品详情
      goodsdetail: {},
      // 图片路径
      imgurl: this.IMGURL,
      // 促销类型
      Promotemode: this.$store.state.Promotemode,
      // 购物车列表
      cartList: []
    }
  },
  computed: {
    // 购物车商品数量
    cartnums () {
      return this.$store.state.cartnums
    }
  },
  components: {
    MyHeader,
    countdown,
    addcart,
    addorder
  },
  methods: {
    // 获取商品详情
    getGoodsdetail () {
      let data = new FormData()
      let requestData = {
        goodsid: this.goodsid
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/getById', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.goodsdetail = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
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
@import "./static/css/goodsdetail.css";
</style>
