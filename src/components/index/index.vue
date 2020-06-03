<template>
  <div class="container bgeeeeee" v-title :data-title="userInfo.deptname">
    <!-- 获取微信凭证 start -->
    <wechat-config>
    </wechat-config>
    <!-- 获取微信凭证 end -->
    <!-- 轮播图 start -->
    <div class="banner">
      <!-- 搜索 start -->
      <router-link :to="{name: 'search'}" tag="div" class="search_cont">
        <div class="search border_r6">
          <div class="search_input fl">
            <img src="static/img/search.png" class="fl">
            <input type="text" v-model="keyword" placeholder="请输入商品信息" class="fl color333333"/>
          </div>
        </div>
      </router-link>
      <!-- 搜索 end -->
      <div class="banner_cont" v-if="bannerlist.length">
        <van-swipe
          class="banner_swipe"
          :autoplay="3000"
          indicator-color="#ff6400">
          <van-swipe-item v-for="(item, index) in bannerlist" :key="index">
            <div class="banner_img font24 color666666" @click="getLinkForSlide(item.Sort)">
              <img :src="IMGURL + 'image/' + item.Imageurl">
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <!-- 轮播图 end -->
    <!-- 内容部分 start -->
    <div class="index_main bgeeeeee">
      <!-- 加载中动画 start -->
      <!--<loading v-if="isShowLoading"></loading>-->
      <!-- 加载中动画 end -->
      <!-- 常用功能 start -->
      <div class="index_common border_r6 bgffffff color666666">
        <!-- 每日签到 start -->
        <div class="index_common_item" @click="sendSign">
          <div class="index_common_img">
            <img src="static/img/qd.png">
          </div>
          <div class="font20">每日签到</div>
        </div>
        <!-- 每日签到 end -->
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
        <!-- 我的订单 start -->
        <router-link :to="{name: 'orderList', query: {billstatus: '-2'}}" tag="div" class="index_common_item">
          <div class="index_common_img">
            <img src="static/img/wddd.png">
          </div>
          <div class="font20">我的订单</div>
        </router-link>
        <!-- 我的订单 end -->
      </div>
      <!-- 常用功能 end -->
      <!-- 通知 start -->
      <div class="notice">
        <div class="notice_img">
          <img src="static/img/lb.png">
        </div>
        <div class="notice_list ellipsis">
          <van-swipe class="notice_swipe" :autoplay="3000" v-if="noticelist.length" vertical :show-indicators="false">
            <van-swipe-item v-for="(item, index) in noticelist" :key="index">
              <router-link :to="{name: 'noticedetail', query: {id: item.id}}" tag="div" class="font24 color666666">{{item.title}}</router-link>
            </van-swipe-item>
          </van-swipe>
        </div>
        <router-link :to="{name:'noticeList'}" tag="div" class="notice_more font24 tr">更多 > </router-link>
      </div>
      <!-- 通知 end -->
      <!-- 推荐模块 start -->
      <div class="recommend_cont" v-if="recommendList.length" v-for="(item, index) in recommendList" :key="index">
        <!-- 推荐一 start -->
        <div class="recommend1" v-if="item.showway === 1">
          <!-- 标题1 start -->
          <router-link :to="{name: 'recommendList', query: {recommendid: item.Id, recommendName: item.storecategoryname}}" tag="div" class="recommend1_tit bgffffff border_r6 ellipsis" v-if="item.storecategorydescription !== ''">
            <div class="recommend1_tit_img">
              <img src="static/img/ms.png">
            </div>
            <div class="recommend1_tits font32 font_blod">{{item.storecategoryname}}</div>
            <div class="font24 font_normal color666666">{{item.storecategorydescription}}</div>
          </router-link>
          <!-- 标题1 end -->
          <!-- 标题2 start -->
          <router-link :to="{name: 'recommendList', query: {recommendid: item.Id, recommendName: item.storecategoryname}}" tag="div" class="recommend3_tit border_r6 ellipsis" v-if="item.storecategorydescription === ''">
            <div class="font_blod colorfa2a2a font_recommend">-&nbsp;</div>
            <div class="recommend3_tits colorfa2a2a font_recommend">{{item.storecategoryname}}</div>
            <div class="font_blod colorfa2a2a font_recommend">&nbsp;-</div>
          </router-link>
          <!-- 标题2 end -->
          <!-- 内容列表 start -->
          <div class="recommend1_list" v-if="item.gdscodelist.length">
            <div @click="goodsdetail(goods)" class="recommend1_item bgffffff border_r6" v-for="(goods, index) in item.gdscodelist" :key="index">
              <div class="recommend1_item_img border_r6">
                <img :src="(goods.picture1 ? (imgurl + 'image/' + goods.picture1.replace('.', '-zip-300.')) : ('static/img/goods.png'))" class="border_r6">
                <div v-if="goods.promotemode !== 0" class="goods_age ellipsis font24 font_normal colorffffff">{{goods.modenote}}</div>
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
          <router-link :to="{name: 'recommendList', query: {recommendid: item.Id, recommendName: item.storecategoryname}}" tag="div" class="recommend3_tit border_r6 ellipsis">
            <div class="font_blod colorfa2a2a font_recommend">-&nbsp;</div>
            <div class="recommend3_tits colorfa2a2a font_recommend">{{item.storecategoryname}}</div>
            <div class="font_blod colorfa2a2a font_recommend">&nbsp;-</div>
          </router-link>
          <!-- 标题2 end -->
          <!-- 标题 start -->
          <router-link :to="{name: 'recommendList', query: {recommendid: item.Id, recommendName: item.storecategoryname}}" tag="div" class="recommend2_img bgffffff">
            <img :src="imgurl + 'image/' + item.ico">
          </router-link>
          <!-- 标题 end -->
          <!-- 内容列表 start -->
          <div class="recommend1_list" v-if="item.gdscodelist.length">
            <div @click="goodsdetail(goods)" class="recommend1_item bgffffff border_r6" v-for="(goods, index) in item.gdscodelist" :key="index">
              <div class="recommend1_item_img border_r6">
                <img :src="(goods.picture1 ? (imgurl + 'image/' + goods.picture1.replace('.', '-zip-300.')) : ('static/img/goods.png'))" class="border_r6">
                <div v-if="goods.promotemode !== 0" class="goods_age ellipsis font24 font_normal colorffffff">{{goods.modenote}}</div>
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
      <!-- 推荐模块 end -->
    </div>
    <!-- 内容部分 end -->
    <!-- 底部导航 start -->
    <my-footer></my-footer>
    <!-- 底部导航 end -->
  </div>
</template>

<script>
import WechatConfig from '@/components/common/wechatConfig/wechatConfig'
import MyFooter from '@/components/common/footer/myfooter'
import loading from '@/components/common/loading/loading'

export default {
  name: 'index',
  data () {
    return {
      // banner图配置项
      swiperBanner: {
        // 自动切换
        autoplay: true,
        // 轮播间隔
        speed: 1000,
        // 循环
        loop: true,
        // 分页器
        pagination: {
          // 分页器元素
          el: '.pagination_banner'
        }
      },
      // banner跳转类型,0:无，2：分类，3：推荐，4：公告，5：充值，6：积分抽奖，7：领券
      bannerType: [
        {linktype: 0, name: 'index'},
        {linktype: 2, name: 'classList'},
        {linktype: 3, name: 'recommendList'},
        {linktype: 4, name: 'noticedetail'},
        {linktype: 5, name: 'recharge'},
        {linktype: 6, name: 'lottery'},
        {linktype: 7, name: 'tickList'}
      ],
      // 通知轮播配置项
      swiperNotice: '',
      // 轮播图列表
      bannerlist: [],
      // 通知信息列表
      noticelist: [],
      // 推荐
      recommendList: [],
      // 图片路径
      imgurl: this.IMGURL,
      // 加载中动画
      isShowLoading: true
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
    WechatConfig,
    MyFooter,
    loading
  },
  methods: {
    // 设置用户信息
    setUserInfo () {
      this.isShowLoading = true
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
          // 获取banner列表
          this.getBanner()
          // 获取通知信息
          this.getNotice()
          // 获取推荐
          this.getRecommend()
        } else {
          this.$toast({
            message: '登陆失败，请重新登陆！',
            type: 'fail'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 获取banner列表
    getBanner () {
      let data = new FormData()
      let requestData = {
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/slide/listShopHomeSlide', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.bannerlist = res.data
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
    // 获取banner跳转链接
    getLinkForSlide (Sort) {
      let data = new FormData()
      let requestData = {
        ImageID: Sort
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/slide/getLinkForSlide', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.bannerType.forEach(item => {
            if (item.linktype === res.data.linktype) {
              // banner跳转类型,0:无，2：分类，3：推荐，4：公告，5：充值，6：积分抽奖，7：领券
              if (res.data.linktype === 2) {
                this.$router.push({name: item.name, query: {classcode: res.data.linkcode, classname: res.data.linkname}})
              } else if (res.data.linktype === 3) {
                this.$router.push({name: item.name, query: {recommendid: res.data.linkcode, recommendName: res.data.linkname}})
              } else if (res.data.linktype === 4) {
                this.$router.push({name: item.name, query: {id: res.data.linkcode}})
              } else if (res.data.linktype === 5) {
                this.$router.push({name: item.name})
              } else if (res.data.linktype === 6) {
                this.$router.push({name: item.name})
              } else if (res.data.linktype === 7) {
                this.$router.push({name: item.name, params: {header_tit: '领券中心', froms: 'index'}})
              }
            }
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
      let requestData = {
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/listThemeAndGdscode', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.isShowLoading = false
          this.recommendList = res.data
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
    // 商品详情
    goodsdetail (goodsdetail) {
      this.$store.commit('setGoodsdetail', goodsdetail)
      this.$router.push({name: 'goodsdetail', query: {goodsid: goodsdetail.goodsid}})
    },
    // 签到
    sendSign () {
      let data = new FormData()
      let requestData = {}
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('pay/bill/member/signInCentChange', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$toast({
            message: '签到成功，' + res.msg,
            type: 'success'
          })
          this.setUserInfo()
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
  created () {
    // 检查token，判断是否重新加载
    if (!sessionStorage.getItem('jyyf_token')) {
      // 设置用户信息
      this.setUserInfo()
    } else {
      // 获取banner列表
      this.getBanner()
      // 获取通知信息
      this.getNotice()
      // 获取推荐
      this.getRecommend()
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/index.css";
.index_main{
  position: relative;
}
input.el-input__inner {
  border: 1px solid #dcdfe6!important;
  text-align: center;
}
.search_cont {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
}
.search_cont .search {
  background-color: rgba(255, 255, 255, .7);
}
.search_cont .search input {
  background-color: unset;
}
.banner_swipe >>> .van-swipe__indicator {
  width: .3rem;
  height: .04rem;
  border-radius: 500rem;
}
</style>
