<template>
  <!--<div class="container bgeeeeee" v-if="userInfo.moneyDetail">-->
  <div class="container bgeeeeee">
    <!-- 获取微信凭证 start -->
    <wechat-config>
    </wechat-config>
    <!-- 获取微信凭证 end -->
    <!-- card start -->
    <div class="userinfo colorffffff">
      <div class="card">
        <div class="card_name">
          <div class="card_img bgffffff border_r500">
            <img :src="headimgurl || 'static/img/userimg.png'" class="border_r500">
            <div class="vip_desc colorffffff bge7cb92 border_r500 font24">v{{userInfo.mem_type || 0}}</div>
          </div>
          <div class="card_num tl">
            <div>{{userInfo.memname}}</div>
            <div class="font_lighter">NO：{{userInfo.memcode}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- card end -->
    <!-- 功能部分 start -->
    <div class="user_cont userinfo_cont">
      <ul class="">
        <!-- 我的钱包 start -->
        <li class="user_item border_r10 bgffffff">
          <div class="card_des">
            <ul>
              <router-link :to="{name: 'cardMoneyList'}" tag="li" class="card_des_item font24">
                <div class="font32">{{moneyDetail.moneyBal || 0}}</div>
                <div class="font22">卡值</div>
              </router-link>
              <li class="card_des_item bgd9d9d9"></li>
              <router-link :to="{name: 'scoreList'}" tag="li" class="card_des_item font24">
                <div class="font32">{{moneyDetail.totalCent || 0}}</div>
                <div class="font22">积分</div>
              </router-link>
              <li class="card_des_item bgd9d9d9"></li>
              <router-link :to="{name: 'tickList', params:{header_tit: '优惠券', froms: 'userinfo'}}" tag="li" class="card_des_item font24">
                <div class="font32">{{moneyDetail.couponAmount || 0}}</div>
                <div class="font22">券数量</div>
              </router-link>
              <li class="card_des_item bgd9d9d9"></li>
              <router-link :to="{name: 'looseChangeList'}" tag="li" class="card_des_item font24">
                <div class="font32">{{moneyDetail.smallMoneyBal || 0}}</div>
                <div class="font22">零钱</div>
              </router-link>
            </ul>
          </div>
        </li>
        <!-- 我的钱包 end -->
        <!-- 我的订单 start -->
        <li class="user_item border_r10 bgffffff">
          <div class="user_item_tit font32">
            <div>我的订单</div>
            <router-link :to="{name: 'orderList', query: {billstatus: '-2'}}" tag="div" class="font24 color666666">全部订单 <i class="el-icon-arrow-right" style="font-size: .28rem!important;"></i></router-link>
          </div>
          <ul class="color666666">
            <!-- 未完成 start -->
            <router-link :to="{name: 'orderList', query: {billstatus: '-1'}}" tag="li" class="cont_item cont_order">
              <div class="imgbox">
                <img src="static/img/order_-1.png">
              </div>
              <div class="imgname font24">未完成</div>
            </router-link>
            <!-- 未完成 end -->
            <!-- 未受理 start -->
            <router-link :to="{name: 'orderList', query: {billstatus: '0'}}" tag="li" class="cont_item cont_order">
              <div class="imgbox">
                <img src="static/img/order_0.png">
              </div>
              <div class="imgname font24">未受理</div>
            </router-link>
            <!-- 未受理 end -->
            <!-- 待配送 start -->
            <router-link :to="{name: 'orderList', query: {billstatus: '10'}}" tag="li"  class="cont_item cont_order">
              <div class="imgbox">
                <img src="static/img/order_10.png">
              </div>
              <div class="imgname font24">待配送</div>
            </router-link>
            <!-- 待配送 end -->
            <!-- 配送中 start -->
            <router-link :to="{name: 'orderList', query: {billstatus: '11'}}" tag="li"  class="cont_item cont_order">
              <div class="imgbox">
                <img src="static/img/order_11.png">
              </div>
              <div class="imgname font24">配送中</div>
            </router-link>
            <!-- 配送中 end -->
            <!-- 已完成 start -->
            <router-link :to="{name: 'orderList', query: {billstatus: '12'}}" tag="li"  class="cont_item cont_order">
              <div class="imgbox">
                <img src="static/img/order_12.png">
              </div>
              <div class="imgname font24">已完成</div>
            </router-link>
            <!-- 已完成 end -->
          </ul>
        </li>
        <!-- 我的订单 end -->
        <!-- 常用功能 start -->
        <li class="user_item border_r10 bgffffff">
          <div class="user_item_tit font32">常用功能</div>
          <ul class="color666666">
            <!-- 购物评价 start -->
            <!--<router-link :to="{name: 'commentList'}" tag="li"  class="cont_item">-->
            <!--<div class="imgbox">-->
            <!--<img src="static/img/user_gwpj.png">-->
            <!--</div>-->
            <!--<div class="imgname font24">购物评价</div>-->
            <!--</router-link>-->
            <!-- 购物评价 end -->
            <!-- 我的资料 start -->
            <router-link :to="{name: 'userDetail', params:{header_tit: '我的资料'}}" tag="li"  class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_wdzl.png">
              </div>
              <div class="imgname font24">我的资料</div>
            </router-link>
            <!-- 我的资料 end -->
            <!-- 我的地址 start -->
            <router-link :to="{name: 'addressList', params:{header_tit: '我的地址'}}" tag="li"  class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_wddz.png">
              </div>
              <div class="imgname font24">我的地址</div>
            </router-link>
            <!-- 我的地址 end -->
            <!-- 支付密码 start -->
            <router-link :to="{name: 'payPassword', params:{header_tit: '支付密码', msg_status: 1}}" tag="li"  class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_zfmm.png">
              </div>
              <div class="imgname font24">支付密码</div>
            </router-link>
            <!-- 支付密码 end -->
            <!-- 我的消息 start -->
            <router-link :to="{name: 'messageList'}" tag="li"  class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_message.png">
              </div>
              <div class="imgname font24">我的消息</div>
            </router-link>
            <!-- 我的消息 end -->
            <!-- 投诉建议 start -->
            <router-link :to="{name: 'complaintList', params:{froms: 'userinfo'}}" tag="li"  class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_tsjy.png">
              </div>
              <div class="imgname font24">投诉建议</div>
            </router-link>
            <!-- 投诉建议 end -->
            <!-- 消费记录 start -->
            <router-link :to="{name: 'expendList'}" tag="li"  class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_xfjl.png">
              </div>
              <div class="imgname font24">消费记录</div>
            </router-link>
            <!-- 消费记录 end -->
            <!-- 会员解绑 start -->
            <!--<router-link :to="{name: 'userList', params:{header_tit: '会员解绑'}}" tag="li"  class="cont_item">-->
            <!--<div class="imgbox">-->
            <!--<img src="static/img/user_hyjb.png">-->
            <!--</div>-->
            <!--<div class="imgname font24">会员解绑</div>-->
            <!--</router-link>-->
            <!-- 会员解绑 end -->
            <!-- 拣配确认 start -->
            <router-link :to="{name: 'scan', params:{header_tit: '拣配确认'}}" tag="li"  class="cont_item" v-if="userInfo.role">
              <div class="imgbox">
                <img src="static/img/user_jpqr.png">
              </div>
              <div class="imgname font24">拣配确认</div>
            </router-link>
            <!-- 拣配确认 end -->
          </ul>
        </li>
        <!-- 常用功能 end -->
      </ul>
    </div>
    <!-- 功能部分 end -->
    <!-- 底部导航 start -->
    <my-footer></my-footer>
    <!-- 底部导航 end -->
  </div>
</template>

<script>
import WechatConfig from '@/components/common/wechatConfig/wechatConfig'
import MyFooter from '@/components/common/footer/myfooter'
// import { mapState } from 'vuex'

export default {
  name: 'userInfo',
  data () {
    return {
    }
  },
  computed: {
    // 用户信息
    userInfo () {
      return this.$store.state.userInfo
    },
    // 卡片信息
    moneyDetail () {
      return this.$store.state.moneyDetail
    },
    // 用户头像
    headimgurl () {
      return this.$store.state.headimgurl
    }
    // ...mapState({
    //   // 用户信息 把 `this.userInfo` 映射为 `this.$store.state.userInfo`
    //   userInfo: 'userInfo'
    // })
  },
  components: {
    WechatConfig,
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
        } else {
          this.$toast({
            message: '登陆失败，请重新登陆！',
            type: 'fail'
          })
        }
      }).catch(error => {
        throw error
      })
    }
  },
  watch: {
  },
  created () {
    // 设置用户信息
    this.setUserInfo()
  }
}
</script>

<style scoped>
@import "static/css/userInfo.css";

</style>
