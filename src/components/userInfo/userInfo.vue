<template>
  <div class="container bgeeeeee" v-title :data-title="userInfo.deptname">
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
            <div class="vip_desc colorffffff bge7cb92 border_r500 font24">v{{mem_type || 0}}</div>
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
    <div class="user_cont user_conts">
      <ul class="">
        <!-- 我的钱包 start -->
        <li class="user_item border_r10 bgffffff">
          <div class="card_des">
            <ul>
              <router-link :to="{name: 'cardMoneyList'}" tag="li" class="card_des_item font24">
                <div class="font32">{{moneyDetail.moneyBal || 0}}</div>
                <div class="font22 card_des_item_name"><img src="static/img/user_cardmoney.png">卡值</div>
              </router-link>
              <li class="card_des_item bgd9d9d9"></li>
              <router-link :to="{name: 'scoreList'}" tag="li" class="card_des_item font24">
                <div class="font32">{{moneyDetail.totalCent || 0}}</div>
                <div class="font22 card_des_item_name"><img src="static/img/user_score.png">积分</div>
              </router-link>
              <li class="card_des_item bgd9d9d9"></li>
              <router-link :to="{name: 'tickList', query:{header_tit: '电子券'}}" tag="li" class="card_des_item font24">
                <div class="font32">{{moneyDetail.couponAmount || 0}}</div>
                <div class="font22 card_des_item_name"><img src="static/img/user_coupons.png">券数量</div>
              </router-link>
              <li class="card_des_item bgd9d9d9"></li>
              <router-link :to="{name: 'looseChangeList'}" tag="li" class="card_des_item font24">
                <div class="font32">{{moneyDetail.smallMoneyBal || 0}}</div>
                <div class="font22 card_des_item_name"><img src="static/img/user_smallmoney.png">零钱</div>
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
                <div
                  class="agenums border_r500 font18 bgff6400 colorffffff ellipsis"
                  v-if="ordernums1"
                >{{ordernums1}}</div>
              </div>
              <div class="imgname font24">未完成</div>
            </router-link>
            <!-- 未完成 end -->
            <!-- 未受理 start -->
            <router-link :to="{name: 'orderList', query: {billstatus: '0'}}" tag="li" class="cont_item cont_order">
              <div class="imgbox">
                <img src="static/img/order_0.png">
                <div
                  class="agenums border_r500 font18 bgff6400 colorffffff ellipsis"
                  v-if="ordernums2"
                >{{ordernums2}}</div>
              </div>
              <div class="imgname font24">未受理</div>
            </router-link>
            <!-- 未受理 end -->
            <!-- 待配送 start -->
            <router-link :to="{name: 'orderList', query: {billstatus: '10'}}" tag="li"  class="cont_item cont_order">
              <div class="imgbox">
                <img src="static/img/order_10.png">
                <div
                  class="agenums border_r500 font18 bgff6400 colorffffff ellipsis"
                  v-if="ordernums3"
                >{{ordernums3}}</div>
              </div>
              <div class="imgname font24">待配送</div>
            </router-link>
            <!-- 待配送 end -->
            <!-- 配送中 start -->
            <router-link :to="{name: 'orderList', query: {billstatus: '11'}}" tag="li"  class="cont_item cont_order">
              <div class="imgbox">
                <img src="static/img/order_11.png">
                <div
                  class="agenums border_r500 font18 bgff6400 colorffffff ellipsis"
                  v-if="ordernums4"
                >{{ordernums4}}</div>
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
            <!-- 我的资料 start -->
            <router-link :to="{name: 'userDetail'}" tag="li"  class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_wdzl.png">
              </div>
              <div class="imgname font24">我的资料</div>
            </router-link>
            <!-- 我的资料 end -->
            <!-- 我的地址 start -->
            <router-link :to="{name: 'addressList'}" tag="li"  class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_wddz.png">
              </div>
              <div class="imgname font24">我的地址</div>
            </router-link>
            <!-- 我的地址 end -->
            <!-- 支付密码 start -->
            <router-link :to="{name: 'payPassword', query:{msg_status: 1}}" tag="li"  class="cont_item">
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
                <div
                  class="agenums border_r500 font18 bgff6400 colorffffff ellipsis"
                  v-if="messagenums"
                >{{messagenums}}</div>
              </div>
              <div class="imgname font24">我的消息</div>
            </router-link>
            <!-- 我的消息 end -->
            <!-- 我要投诉 start -->
            <router-link :to="{name: 'complaintList', query:{froms: 'userinfo', evaluateflag: 0}}" tag="li" class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_tsjy.png">
              </div>
              <div class="imgname font24">我要投诉</div>
            </router-link>
            <!-- 我要投诉 end -->
            <!-- 商品建议 start -->
            <router-link :to="{name: 'complaintList', query:{froms: 'userinfo', evaluateflag: 1}}" tag="li" class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_goodsuggest.png">
              </div>
              <div class="imgname font24">商品建议</div>
            </router-link>
            <!-- 商品建议 end -->
            <!-- 购物评价 start -->
            <router-link :to="{name: 'commentList'}" tag="li"  class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_gwpj.png">
              </div>
              <div class="imgname font24">购物评价</div>
            </router-link>
            <!-- 购物评价 end -->
            <!-- 消费记录 start -->
            <router-link :to="{name: 'expendList'}" tag="li"  class="cont_item">
              <div class="imgbox">
                <img src="static/img/user_xfjl.png">
              </div>
              <div class="imgname font24">消费记录</div>
            </router-link>
            <!-- 消费记录 end -->
            <!-- 会员解绑 start -->
            <!--<router-link :to="{name: 'userList', query:{header_tit: '会员解绑'}}" tag="li"  class="cont_item">-->
            <!--<div class="imgbox">-->
            <!--<img src="static/img/user_hyjb.png">-->
            <!--</div>-->
            <!--<div class="imgname font24">会员解绑</div>-->
            <!--</router-link>-->
            <!-- 会员解绑 end -->
            <!-- 拣货 start -->
            <router-link :to="{name: 'scan', query:{header_tit: '拣货', role: '1'}}" tag="li"  class="cont_item"  v-if="userInfo.role && (userInfo.role.indexOf(1) >= 0)">
              <div class="imgbox">
                <img src="static/img/user_jpqr.png">
              </div>
              <div class="imgname font24">拣货</div>
            </router-link>
            <!-- 拣货 end -->
            <!-- 配送 start -->
            <router-link :to="{name: 'scan', query:{header_tit: '配送', role: '2'}}" tag="li"  class="cont_item"  v-if="userInfo.role && (userInfo.role.indexOf(2) >= 0)">
              <div class="imgbox">
                <img src="static/img/user_jpqr.png">
              </div>
              <div class="imgname font24">配送</div>
            </router-link>
            <!-- 配送 end -->
            <!-- 取货 start -->
            <router-link :to="{name: 'scan', query:{header_tit: '取货', role: '3'}}" tag="li"  class="cont_item" v-if="userInfo.role && (userInfo.role.indexOf(3) >= 0)">
              <div class="imgbox">
                <img src="static/img/user_jpqr.png">
              </div>
              <div class="imgname font24">取货</div>
            </router-link>
            <!-- 取货 end -->
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
import tip from '@/utils/Toast'

export default {
  name: 'userInfo',
  data () {
    return {
      // 未完成订单数量
      ordernums1: 0,
      // 未受理订单数量
      ordernums2: 0,
      // 待配送订单数量
      ordernums3: 0,
      // 配送中订单数量
      ordernums4: 0,
      // 我的消息未读条数
      messagenums: 0
    }
  },
  computed: {
    // 用户信息
    userInfo () {
      let self = this
      return self.$store.state.userInfo
    },
    // 用户会员等级
    mem_type () {
      let self = this
      return self.$store.state.mem_type
    },
    // 卡片信息
    moneyDetail () {
      let self = this
      return self.$store.state.moneyDetail
    },
    // 用户头像
    headimgurl () {
      let self = this
      return self.$store.state.headimgurl
    }
  },
  components: {
    WechatConfig,
    MyFooter
  },
  methods: {
    // 设置用户信息
    setUserInfo () {
      let self = this
      let data = {
        wechatID: self.$store.state.wechatID,
        wexinID: self.$store.state.openid
      }
      self.$api.system.login(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.$store.commit('setUserInfo', res.data)
          self.$store.commit('setToken', res.data.token)
        } else {
          tip('登陆失败，请重新登陆！')
        }
      })
    },
    // 获取用户会员卡信息
    getMyInfo () {
      let self = this
      let data = {}
      self.$api.system.getMyInfo(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.$store.commit('setMemType', res.data.mem_type)
          self.$store.commit('setMoneyDetail', res.data.moneyDetail)
        } else {
          tip(res.msg)
        }
      })
    },
    // 查询未支付订单数量
    getOrdernums (status) {
      let self = this
      let data = {
        status: status,
        page: 1,
        pageSize: 100,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.getOrder(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          if (status === '-1') {
            self.ordernums1 = res.data.totalSize
          } else if (status === '0') {
            self.ordernums2 = res.data.totalSize
          } else if (status === '10') {
            self.ordernums3 = res.data.totalSize
          } else if (status === '11') {
            self.ordernums4 = res.data.totalSize
          }
        }
      })
    },
    // 获取我的消息
    getMessageList () {
      let self = this
      let data = {
        messageFlag: '1',
        page: 1,
        pageSize: 100
      }
      self.$api.info.listmessage(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          if (res.data.content && res.data.content.length) {
            self.messagenums = res.data.content[0].mscount
          }
        }
      })
    }
  },
  watch: {
  },
  beforeRouteEnter (to, from, next) {
    let ExcludeComponent = ['classify', 'searchList', 'recommendList', 'classList']
    next(vm => {
      vm.$store.commit('addExcludeComponent', ExcludeComponent)
      next()
    })
  },
  created () {
    let self = this
    // 设置用户信息
    self.setUserInfo()
    // 获取用户会员卡信息
    self.getMyInfo()
    // 查询未读消息条数
    self.getMessageList()
    // 查询未完成订单数量
    self.getOrdernums('-1')
    // 查询未受理订单数量
    self.getOrdernums('0')
    // 查询待配送订单数量
    self.getOrdernums('10')
    // 查询配送中订单数量
    self.getOrdernums('11')
  }
}
</script>

<style scoped>
@import "static/css/userInfo.css";

</style>
