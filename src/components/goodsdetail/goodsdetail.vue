<template>
  <div class="container bgeeeeee" v-title :data-title="goodsname">
    <!-- 获取微信凭证 start -->
    <wechat-config>
    </wechat-config>
    <!-- 获取微信凭证 end -->
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
        <div class="addcart goods_btn tc colorffffff bgffae89" v-if="goodsdetail.promotemode !== 6 && goodsdetail.promotemode !== 8">
          <addcart :goodsid="goodsdetail.goodsid" :froms="'goodsdetail'">加购物车</addcart>
        </div>
        <!-- 拼团按钮--hhk--start-->
        <div class="goods_btn tc colorffffff bgff6400" v-if="goodsdetail.promotemode === 6 && !groupno">
          <add-group :goodsid="goodsdetail.goodsid">发起拼团</add-group>
        </div>
        <div class="goods_btn tc colorffffff bgffae89"  v-if="goodsdetail.promotemode === 6 && !groupno">
          <div @click="setShowGroup">参与拼团</div>
        </div>
        <div class="goods_btn tc color333333 bgeeeeee ellipsis" v-if="groupno">
          拼团号：{{groupno}}
        </div>
        <div class="goods_btn tc colorffffff bgff6400" v-if="groupno" >
          <div @click="groupDetail">拼团详情</div>
        </div>
        <!-- 拼团按钮--hhk--end-->
        <!-- 砍价按钮--hhk--start-->
        <div class="goods_btn tc colorffffff bgff6400" v-if="goodsdetail.promotemode === 8 && !bargainno || flag === 0">
          <div @click="addBargain">发起砍价</div>
        </div>
        <div class="goods_btn tc colorffffff bgff6400" v-if="goodsdetail.promotemode === 8 && !bargainno || flag === 0">
          <div @click="setShowBargain">参与砍价</div>
        </div>
        <div class="goods_btn tc color333333 bgeeeeee ellipsis" v-if="bargainno && flag === 1">
          砍价号：{{bargainno}}
        </div>
        <div class="goods_btn tc colorffffff bgff6400" v-if="bargainno &&  flag === 1" >
          <div @click="bargainDetail">砍价详情</div>
        </div>
        <div class="pay goods_btn tc colorffffff bgff6400"  v-if="pay === 1 && flag === 1">
          <addorder :goods="goodsdetail" :goodsdetail="true" :pay="1">立即购买</addorder>
        </div>
        <!-- 砍价按钮--hhk--end-->
        <div class="pay goods_btn tc colorffffff bgff6400"  v-if="!bargainno && !groupno">
          <addorder :goods="goodsdetail" :goodsdetail="true">立即购买</addorder>
        </div>
      </div>
    </div>
    <!-- 购物车 end -->
    <!-- 参团弹框 start -->
    <van-dialog
      v-model="showGroup"
      title="请输入团号"
      :closeOnClickOverlay="true"
      :style="'height: 30%;'"
      @confirm="checkJoinGroup"
    >
      <van-field v-model="joinno" type="digit" placeholder="请输入团号" />
    </van-dialog>
    <!-- 参团弹框 end -->
    <!-- 拼团详情弹窗-->
    <van-dialog
      v-model="showGroupDetail"
      title="拼团详情"
      :showConfirmButton="false"
      :closeOnClickOverlay="true"
      :style="'height: 30%;'"
    >
      <div v-for="(item, index) in groupdetail.temlist" :key="index">{{item.userid}}</div>
    </van-dialog>
    <!-- 砍价详情弹窗-->
    <van-dialog
      v-model="showBargainDetail"
      title="砍价详情"
      :showConfirmButton="false"
      :closeOnClickOverlay="true"
      :style="'height: 30%;'"
      @close="closeBargainDetail"
    >
      <div v-for="(item, index) in bargaindetail" :key="index">
        <van-grid-item icon="photo-o" text="" />{{item.userid}}
      </div>
    </van-dialog>
    <!-- 参与砍价弹框 start -->
    <van-dialog
      v-model="showBargain"
      title="请输入砍价号"
      :closeOnClickOverlay="true"
      :style="'height: 30%;'"
      @confirm="joinBargain"
    >
      <van-field v-model="joinno" type="digit" placeholder="请输入砍价号" />
    </van-dialog>
    <!-- 参与砍价弹框 end -->
  </div>
</template>

<script>
import WechatConfig from '@/components/common/wechatConfig/wechatConfig'
import countdown from '@/components/common/countdown/countdown'
import addcart from '@/components/common/addcart/addcart'
import addorder from '@/components/common/addorder/addorder'
import addGroup from '@/components/common/addGroup/addGroup'

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
      // 导航显示开关
      goodsNavFlag: false,
      // 拼团的团号
      groupno: '',
      // 参与拼团弹框
      showGroup: false,
      // 参团号
      joinno: '',
      // 展示拼团详情
      showGroupDetail: false,
      // 拼团详情
      groupdetail: '',
      // 砍价号
      bargainno: '',
      // 砍价详情
      bargaindetail: '',
      // 展示砍价详情
      showBargainDetail: false,
      // 参与砍价
      showBargain: false,
      // 商品数量
      amount: 1,
      // 砍价支付状态
      pay: 0,
      // 是否是砍价发起人，即购买人
      flag: ''
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
    }
  },
  components: {
    WechatConfig,
    countdown,
    addcart,
    addorder,
    addGroup
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
          // 页面加载获取顾客商品拼团信息
          if (this.goodsdetail.promotemode === 6) {
            this.getGroupNo()
          }
          // 页面加载获取顾客商品的砍价信息
          if (this.goodsdetail.promotemode === 8) {
            this.getBargainNo()
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
    // 获取拼团groupno
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
          this.groupno = res.data.groupno
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
          this.bargainno = res.data.list[0].groupno
          this.pay = res.data.pay
          this.flag = res.data.flag
        }
      }).catch(error => {
        throw error
      })
    },
    // 导航按钮显示
    setGoodsNav () {
      this.goodsNavFlag = !this.goodsNavFlag
    },
    // 显示拼团输入框
    setShowGroup () {
      this.joinno = ''
      this.showGroup = true
    },
    // 显示砍价输入框
    setShowBargain () {
      this.joinno = ''
      this.showBargain = true
    },
    // 查看拼团详情
    groupDetail () {
      let data = new FormData()
      let requestData = {
        goodsid: this.goodsid.toString(),
        amount: this.amount,
        otc: 'group',
        isotc: 'group',
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/groupIncrease', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.showGroupDetail = true
          this.groupdetail = res.data
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
    // 填写团号验证
    checkJoinGroup () {
      if (this.joinno) {
        let data = new FormData()
        let requestData = {
          goodsid: this.goodsid.toString(),
          joinno: this.joinno,
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.$axios.post('api/goods/getGroupInfo', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            // 拼团
            this.joinGroup(res.data)
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
    // 参与拼团
    joinGroup (group) {
      let data = new FormData()
      let requestData = {
        goodsid: this.goodsid.toString(),
        amount: this.amount,
        otc: 'group',
        isotc: 'group',
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/buyEnd', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$store.commit('setOrder', res.data)
          this.$router.push({name: 'editorder', query: {goodsid: this.goodsid.toString(), group: 2, groupno: this.joinno}})
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
    // 新增砍价
    addBargain () {
      let data = new FormData()
      let requestData = {
        goodsid: this.goodsid.toString(),
        amount: this.amount,
        saleprice: this.goodsdetail.saleprice,
        discountvalue: this.goodsdetail.discountvalue,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/hackAdd', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$toast({
            message: '发起成功，快去邀人砍价0×0',
            type: 'success'
          })
          this.getBargainNo()
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
    // 参与砍价
    joinBargain (group) {
      let data = new FormData()
      let requestData = {
        goodsid: this.goodsid.toString(),
        amount: this.amount,
        groupno: this.joinno,
        saleprice: this.goodsdetail.saleprice,
        discountvalue: this.goodsdetail.discountvalue,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/hackIncrease', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$toast({
            message: '参与成功',
            type: 'success'
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
    },
    // 砍价详情
    bargainDetail () {
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
          this.bargaindetail = res.data.list
          this.showBargainDetail = true
        }
      }).catch(error => {
        throw error
      })
    },
    // 填写砍价号验证
    checkJoinBargain () {
      if (this.joinno) {
        let data = new FormData()
        let requestData = {
          goodsid: this.goodsid.toString(),
          joinno: this.joinno,
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.$axios.post('api/goods/generateHackBill', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            // 拼团
            this.joinBargain(res.data)
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
    // 关闭砍价详情窗口
    closeBargainDetail () {
      this.getBargainNo()
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
