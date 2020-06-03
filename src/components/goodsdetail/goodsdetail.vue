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
      <div class="goods_img bgffffff" v-if="goodsPictureList.length">
        <van-swipe
          class="banner_swipe"
          :autoplay="3000"
          indicator-color="#ff6400"
          @change="onChangePage">
          <van-swipe-item v-for="(item, index) in goodsPictureList" :key="index">
            <div class="img_box" @click="enlargedView">
              <img :src="item">
            </div>
          </van-swipe-item>
          <template #indicator>
            <div class="custom-indicator bgff6400 border_r8 font22 colorffffff">
              {{ goodsPage + 1 }}/{{goodsPictureList.length}}
            </div>
          </template>
        </van-swipe>
      </div>
      <div class="goods_desc bgffffff border_r6">
        <div class="goods_promot">
          <div class="goods_price_cont">
            <div class="goods_price" v-if="goodsdetail.promotemode === 0 || goodsdetail.promotemode === 2 || goodsdetail.promotemode === 3 || goodsdetail.promotemode === 8">
              <div class="goods_promot_age font24 colorffffff borderffffff border_r4" v-if="goodsdetail.promotemode !== 0">{{goodsdetail.modenote}}</div>
              <div class="font32 font_blod colorffffff">￥{{goodsdetail.saleprice}}</div>
            </div>
            <div class="goods_price" v-if="goodsdetail.promotemode === 1 || goodsdetail.promotemode === 7">
              <div class="goods_promot_age font24 colorffffff borderffffff border_r4">{{goodsdetail.modenote}}</div>
              <div class="font32 font_blod colorffffff">￥{{goodsdetail.promotevalue}}</div>
              <del class="font20 colorffc06e">￥{{goodsdetail.saleprice}}</del>
            </div>
            <div class="goods_price" v-if="goodsdetail.Promotemode === 6">
              <div class="goods_promot_age font24 colorffffff borderffffff border_r4">{{goodsdetail.modenote}}</div>
              <div class="font32 font_blod colorffffff">￥{{goodsdetail.groupprice}}</div>
              <del class="font20 colorffc06e">￥{{goodsdetail.saleprice}}</del>
            </div>
          </div>
          <div class="countdown" v-if="goodsdetail.startstate === 1 && goodsdetail.promotemode !== 0">
            <div class="font20 colorffffff">距结束还剩:</div>
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
    <!-- 商品介绍 end -->
    <!-- 购物车 start -->
    <div class="carts bgffffff">
      <router-link :to="{name: 'cart'}" tag="div" class="carts_img">
        <img src="static/img/cart.png">
        <div class="carts_num tc border_r500 bgf75050 colorffffff font22">{{cartnums}}</div>
      </router-link>
      <div class="btns">
        <div class="addcart goods_btn tc font34 colorffffff bgffae43">
          <addcart :goodsid="goodsdetail.goodsid" :froms="'goodsdetail'">加入购物车</addcart>
        </div>
        <div class="pay goods_btn tc font34 colorffffff bgff6400">
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
      cartList: []
    }
  },
  computed: {
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
    }
  },
  components: {
    MyHeader,
    countdown,
    addcart,
    addorder
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
