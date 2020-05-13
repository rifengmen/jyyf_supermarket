<template>
  <div class="container bgeeeeee" v-title :data-title="userInfo.deptname">
    <!-- 搜索 start -->
    <router-link :to="{name: 'search'}" tag="div" class="search_cont">
      <div class="search border_r6 bgffffff">
        <div class="search_input fl">
          <img src="static/img/search.png" class="fl">
          <input type="text" v-model="keyword" placeholder="请输入您要搜索的商品" class="fl color333333"/>
        </div>
      </div>
    </router-link>
    <!-- 搜索 end -->
    <!-- 通知 start -->
    <div class="swiper-container notice">
      <div class="notice_img">
        <img src="static/img/lb.png">
      </div>
      <swiper ref="mySwiper" :options="swiperOptions" class="notice_list">
        <swiper-slide class="ellipsis" v-for="(item, index) in noticelist" :key="index">
          <router-link :to="{name: 'noticedetail', params: {id: item.id}}" tag="div" class="font24 color666666">{{item.title}}</router-link>
        </swiper-slide>
      </swiper>
      <router-link :to="{name:'noticeList'}" tag="div" class="notice_more font24 tr">更多 > </router-link>
    </div>
    <!-- 通知 end -->
    <!-- 常用功能 start -->
    <div class="index_common border_r6 bgffffff color666666">
      <!-- 在线充值 start -->
      <router-link :to="{name: 'recharge'}" tag="div" class="index_common_item">
        <div class="index_common_img">
          <img src="static/img/zxcz.png">
        </div>
        <div class="font20">在线充值</div>
      </router-link>
      <!-- 在线充值 end -->
      <!-- 领券中心 start -->
      <router-link :to="{name: 'tickList', params: {header_tit: '领券中心', froms: 'index'}}" tag="div" class="index_common_item">
        <div class="index_common_img">
          <img src="static/img/lqzx.png">
        </div>
        <div class="font20">领券中心</div>
      </router-link>
      <!-- 领券中心 end -->
      <!-- 积分抽奖 start -->
      <router-link :to="{name: 'lottery'}" tag="div" class="index_common_item">
        <div class="index_common_img">
          <img src="static/img/jfcj.png">
        </div>
        <div class="font20">积分抽奖</div>
      </router-link>
      <!-- 积分抽奖 end -->
      <!-- 电子会员 start -->
      <div class="index_common_item" @click="openOnline">
        <div class="index_common_img">
          <img src="static/img/dzhy.png">
        </div>
        <div class="font20">电子会员</div>
      </div>
      <!-- 电子会员 end -->
      <!-- 我的订单 start -->
      <router-link :to="{name: 'orderList'}" tag="div" class="index_common_item">
        <div class="index_common_img">
          <img src="static/img/wddd.png">
        </div>
        <div class="font20">我的订单</div>
      </router-link>
      <!-- 我的订单 end -->
    </div>
    <!-- 常用功能 end -->
    <!-- 推荐模块 start -->
    <div class="recommend">
      <div class="recommend_cont" v-if="recommendList.length" v-for="(item, index) in recommendList" :key="index">
        <!-- 推荐一 start -->
        <div class="recommend1" v-if="item.showway === 1">
          <!-- 标题1 start -->
          <div class="recommend1_tit bgffffff border_r6 ellipsis" @click="setRecommendList(item.Id, item.storecategoryname)" v-if="item.storecategorydescription !== ''">
            <div class="recommend1_tit_img">
              <img src="static/img/ms.png">
            </div>
            <div class="recommend1_tits font32 font_blod">{{item.storecategoryname}}</div>
            <div class="font24 font_normal color666666">{{item.storecategorydescription}}</div>
          </div>
          <!-- 标题1 end -->
          <!-- 标题2 start -->
          <div class="recommend3_tit border_r6 ellipsis" @click="setRecommendList(item.Id, item.storecategoryname)" v-if="item.storecategorydescription === ''">
            <div class="font_blod colorfa2a2a">-&nbsp;</div>
            <div class="recommend3_tits colorfa2a2a font36 font_blod">{{item.storecategoryname}}</div>
            <div class="font_blod colorfa2a2a">&nbsp;-</div>
          </div>
          <!-- 标题2 end -->
          <!-- 内容列表 start -->
          <div class="recommend1_list" v-if="item.gdscodelist.length">
            <div @click="goodsdetail(goods.goodsid)" class="recommend1_item bgffffff border_r6" v-for="(goods, index) in item.gdscodelist" :key="index">
              <div class="recommend1_item_img border_r6">
                <img :src="(goods.picture1 ? (imgurl + 'image/' + goods.picture1.replace('.', '-zip-300.')) : ('static/img/goods.png'))" class="border_r6">
                <div v-if="goods.promotemode !== 0" class="goods_age font24 font_normal colorffffff tc">{{Promotemode[goods.promotemode]}}</div>
              </div>
              <div class="recommend1_name ellipsis font24">{{goods.cusgoodsname}}</div>
              <div class="recommend1_price" v-if="goods.promotemode === 0 || goods.promotemode === 2 || goods.promotemode === 3 || goods.promotemode === 8">
                <div class="font24 font_blod colorf84242">￥{{goods.saleprice}}</div>
              </div>
              <div class="recommend1_price" v-if="goods.promotemode === 1 || goods.promotemode === 7">
                <div class="font24 font_blod colorf84242">￥{{goods.promotevalue}}</div>
                <del class="font20 color999999">￥{{goods.saleprice}}</del>
              </div>
              <div class="recommend1_price" v-if="goods.promotemode === 6">
                <div class="font24 font_blod colorf84242">￥{{goods.groupprice}}</div>
                <del class="font20 color999999">￥{{goods.saleprice}}</del>
              </div>
              <div class="recommend1_item_btn tc colorffffff bgff6400 border_r4">购买</div>
            </div>
          </div>
          <!-- 内容列表 end -->
        </div>
        <!-- 推荐一 end -->
        <!-- 推荐二 start -->
        <div class="recommend2 border_r6" v-if="item.showway === 2">
          <!-- 标题2 start -->
          <div class="recommend3_tit border_r6 ellipsis" @click="setRecommendList(item.Id, item.storecategoryname)">
            <div class="font_blod colorfa2a2a">-&nbsp;</div>
            <div class="recommend3_tits colorfa2a2a font36 font_blod">{{item.storecategoryname}}</div>
            <div class="font_blod colorfa2a2a">&nbsp;-</div>
          </div>
          <!-- 标题2 end -->
          <!-- 标题 start -->
          <div class="recommend2_img bgffffff" @click="setRecommendList(item.Id, item.storecategoryname)">
            <img :src="imgurl + 'image/' + item.ico">
          </div>
          <!-- 标题 end -->
          <!-- 内容列表 start -->
          <div class="recommend1_list" v-if="item.gdscodelist.length">
            <div @click="goodsdetail(goods.goodsid)" class="recommend1_item bgffffff border_r6" v-for="(goods, index) in item.gdscodelist" :key="index">
              <div class="recommend1_item_img border_r6">
                <img :src="(goods.picture1 ? (imgurl + 'image/' + goods.picture1.replace('.', '-zip-300.')) : ('static/img/goods.png'))" class="border_r6">
                <div v-if="goods.promotemode !== 0" class="goods_age font24 font_normal colorffffff tc">{{Promotemode[goods.promotemode]}}</div>
              </div>
              <div class="recommend1_name ellipsis font24">{{goods.cusgoodsname}}</div>
              <div class="recommend1_price" v-if="goods.promotemode === 0 || goods.promotemode === 2 || goods.promotemode === 3 || goods.promotemode === 8">
                <div class="font24 font_blod colorf84242">￥{{goods.saleprice}}</div>
              </div>
              <div class="recommend1_price" v-if="goods.promotemode === 1 || goods.promotemode === 7">
                <div class="font24 font_blod colorf84242">￥{{goods.promotevalue}}</div>
                <del class="font20 color999999">￥{{goods.saleprice}}</del>
              </div>
              <div class="recommend1_price" v-if="goods.promotemode === 6">
                <div class="font24 font_blod colorf84242">￥{{goods.groupprice}}</div>
                <del class="font20 color999999">￥{{goods.saleprice}}</del>
              </div>
              <div class="recommend1_item_btn tc colorffffff bgff6400 border_r4">购买</div>
            </div>
          </div>
          <!-- 内容列表 end -->
        </div>
        <!-- 推荐二 end -->
      </div>
    </div>
    <!-- 推荐模块 end -->
    <!-- 底部导航 start -->
    <my-footer></my-footer>
    <!-- 底部导航 end -->
    <!-- 电子会员 start -->
    <div class="online" v-if="onlineFlag" @click="closeOnline">
      <div class="online_cont bgffffff" @click="stop">
        <div class="online_tit font32">电子会员卡</div>
        <div class="online_bar online_img">
          <img :src="online_bar !== 'static/img/goods.png' ? imgurl + online_bar : online_bar">
        </div>
        <div class="online_qr online_img">
          <img :src="online_qr !== 'static/img/goods.png' ? imgurl + online_qr : online_qr">
        </div>
        <div class="online_btn">
          <div class="online_vip colorffffff border_r4 tc bgff6400" @click="getOnlineVip">电子会员卡</div>
          <div class="online_pay colorffffff border_r4 tc bgffae43" @click="sendCpassword">付款码</div>
        </div>
      </div>
    </div>
    <!-- 电子会员 end -->
  </div>
</template>

<script>
import MyFooter from '@/components/common/footer/myfooter'

export default {
  name: 'index',
  data () {
    return {
      // 通知轮播配置项
      swiperOptions: {
        // 自动切换
        autoplay: true,
        // 循环
        loop: true,
        // 纵向切换
        direction: 'vertical'
      },
      // 通知信息列表
      noticelist: [],
      // 推荐
      recommendList: [],
      // 图片路径
      imgurl: this.IMGURL,
      // 促销类型
      Promotemode: this.$store.state.Promotemode,
      // 电子会员开关
      onlineFlag: false,
      // 条码
      online_bar: 'static/img/goods.png',
      // 二维码
      online_qr: 'static/img/goods.png',
      // 储值卡支付密码
      Cpassword: ''
    }
  },
  computed: {
    // 用户信息
    userInfo () {
      return this.$store.state.userInfo
    },
    // 搜索关键字
    keyword () {
      return this.$store.state.keyword
    }
  },
  components: {
    MyFooter
  },
  methods: {
    // 设置用户信息
    setUserInfo () {
      let data = new FormData()
      let requestData = {
        wechatID: this.$store.state.wechatID,
        wexinID: this.$store.state.openid
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/customlogin/login', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$store.commit('setUserInfo', res.data)
          this.$store.commit('setMoneyDetail', res.data.moneyDetail)
          sessionStorage.setItem('jyyf_token', res.data.token)
          this.$axios.defaults.headers.common.Authorization = res.data.token
          // 获取通知信息
          this.getNotice()
          // 获取推荐
          this.getRecommend()
        } else {
          this.$message({
            message: '登陆失败，请重新登陆！',
            type: 'error'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 获取通知信息
    getNotice () {
      let data = new FormData()
      let requestData = {
        listtype: '2',
        page: 1,
        pageSize: 10
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('info/InformationController/listNotice', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.noticelist = res.data.content
        }
      }).catch(error => {
        throw error
      })
    },
    // 获取推荐
    getRecommend () {
      let data = new FormData()
      let requestData = {}
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/listThemeAndGdscode', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.recommendList = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 设置推荐主题id
    setRecommendList (id, storecategoryname) {
      this.$store.commit('setRecommendid', id)
      this.$store.commit('setRecommendName', storecategoryname)
      this.$router.push({name: 'recommendList'})
    },
    // 商品详情
    goodsdetail (goodsid) {
      this.$store.commit('setGoodsid', goodsid)
      this.$router.push({name: 'goodsdetail', query: {dianpu: this.$store.state.wechatID}})
    },
    // 电子会员
    openOnline () {
      this.onlineFlag = true
      this.getOnlineVip()
    },
    // 关闭电子会员
    closeOnline () {
      this.onlineFlag = false
      this.online_bar = 'static/img/goods.png'
      this.online_qr = 'static/img/goods.png'
    },
    // 取消冒泡
    stop () {
      window.event.stopPropagation()
    },
    // 获取电子会员卡
    getOnlineVip () {
      let data = new FormData()
      let requestData = {
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/customlogin/myCard', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.online_bar = res.data.mybarcode
          this.online_qr = res.data.myqrcode
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 输入储值卡支付密码
    sendCpassword () {
      this.$prompt('请输入会员密码！', '在线支付', {
        confirmButtonText: '确定',
        inputPlaceholder: '请输入四位会员密码',
        inputType: 'password'
      }).then(({ value }) => {
        this.Cpassword = value
        this.getOnlinecard()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    // 获取储值卡付款码
    getOnlinecard () {
      let data = new FormData()
      let requestData = {
        Cpassword: this.Cpassword
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('mem/member/createPayMoneyStr', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.online_bar = res.data.payBarcode
          this.online_qr = res.data.payQrcode
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
  created () {
    // 设置用户信息
    this.setUserInfo()
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "./static/css/index.css";
</style>
