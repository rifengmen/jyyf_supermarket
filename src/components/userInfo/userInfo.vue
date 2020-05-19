<template>
  <!--<div class="container bgeeeeee" v-if="userInfo.moneyDetail">-->
  <div class="container bgeeeeee">
    <!-- 头部标题 start -->
    <my-header>
      <template v-slot:header>会员中心</template>
    </my-header>
    <!-- 头部标题 end -->
    <!-- card start -->
    <div class="card userinfo colorffffff">
      <div class="card_name">
        <div class="card_img bgffffff border_r500">
          <img :src="headimgurl || 'static/img/userimg.png'" class="border_r500">
          <div class="vip_desc colorffc06e bgffffff border_r500 font26">v1</div>
        </div>
        <div class="card_num tl">
          <div>{{userInfo.memname}}</div>
          <div>会员号：{{userInfo.memcode}}</div>
        </div>
        <div class="card_class" @click="sendSign">
          <img src="static/img/sign_bg.png">
          <div class="sign_btn">签到</div>
        </div>
      </div>
      <div class="card_des">
        <ul>
          <router-link :to="{name: 'cardMoneyList'}" tag="li" class="card_des_item font24">
            <div>{{moneyDetail.moneyBal}}</div>
            <div>卡值</div>
          </router-link>
          <router-link :to="{name: 'scoreList'}" tag="li" class="card_des_item font24">
            <div>{{moneyDetail.totalCent}}</div>
            <div>积分</div>
          </router-link>
          <router-link :to="{name: 'tickList', params:{header_tit: '优惠券', froms: 'userinfo'}}" tag="li" class="card_des_item font24">
            <div>{{moneyDetail.couponAmount}}</div>
            <div>券数量</div>
          </router-link>
          <router-link :to="{name: 'looseChangeList'}" tag="li" class="card_des_item font24">
            <div>{{moneyDetail.smallMoneyBal}}</div>
            <div>零钱</div>
          </router-link>
        </ul>
      </div>
    </div>
    <!-- card end -->
    <!-- 功能部分 start -->
    <div class="user_cont">
      <ul class=" border_r10 bgffffff">
        <li class="user_item">
          <div class="user_item_tit font32">常用功能</div>
          <ul class="color666666">
            <!-- 积分变化 start -->
            <router-link :to="{name: 'scoreList'}" tag="li" class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_jfbh.png">
              </div>
              <div class="imgname font24">积分变化</div>
            </router-link>
            <!-- 积分变化 end -->
            <!-- 卡值变化 start -->
            <router-link :to="{name: 'cardMoneyList'}" tag="li"  class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_kzbh.png">
              </div>
              <div class="imgname font24">卡值变化</div>
            </router-link>
            <!-- 卡值变化 end -->
            <!-- 零钱变化 start -->
            <router-link :to="{name: 'looseChangeList'}" tag="li"  class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_lqbh.png">
              </div>
              <div class="imgname font24">零钱变化</div>
            </router-link>
            <!-- 零钱变化 end -->
            <!-- 购物评价 start -->
            <!--<router-link :to="{name: 'commentList'}" tag="li"  class="cont_item">-->
              <!--<div class="imgbox">-->
                <!--<img src="static/img/user_gwpj.png">-->
              <!--</div>-->
              <!--<div class="imgname font24">购物评价</div>-->
            <!--</router-link>-->
            <!-- 购物评价 end -->
            <!-- 我的订单 start -->
            <router-link :to="{name: 'orderList', params:{header_tit: '我的订单'}}" tag="li"  class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_wddd.png">
              </div>
              <div class="imgname font24">我的订单</div>
            </router-link>
            <!-- 我的订单 end -->
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
            <!-- 优惠券 start -->
            <router-link :to="{name: 'tickList', params:{header_tit: '优惠券', froms: 'userinfo'}}" tag="li"  class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_yhq.png">
              </div>
              <div class="imgname font24">优惠券</div>
            </router-link>
            <!-- 优惠券 end -->
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
                <img src="static/img/user_smyh.png">
              </div>
              <div class="imgname font24">拣配确认</div>
            </router-link>
            <!-- 拣配确认 end -->
          </ul>
        </li>
      </ul>
    </div>
    <!-- 功能部分 end -->
    <!-- 底部导航 start -->
    <my-footer></my-footer>
    <!-- 底部导航 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
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
    MyHeader,
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
          this.$message({
            message: '登陆失败，请重新登陆！',
            type: 'error'
          })
        }
      }).catch(error => {
        throw error
      })
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
          this.$message({
            message: '签到成功，' + res.msg,
            type: 'success'
          })
          this.setUserInfo()
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
