<template>
  <div class="container_pt90 bgeeeeee" v-title :data-title="$store.state.userInfo.deptname">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>填写订单</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 订单 start -->
    <div class="order_main " v-if="!addressListFlag && !tickListFlag">
      <!-- 订单内容 start -->
      <div class="order_cont bgeeeeee">
        <!-- 收货地址 start -->
        <div class="order_section bgffffff" @click="setAddressListFlag" v-if="address">
          <div class="address_item_desc">
            <div class="address_item_user font_blod ellipsis">
              <div>{{address.contactPerson}}</div>
              <div>{{address.contactNumber}}</div>
              <div class="address_item_age bgffae43 colorffffff tc border_r4 font22 font_normal" v-if="address.addressMark !== '1'">店铺</div>
            </div>
            <div class="address_item_address ellipsis color666666">
              <div class="font24">{{address.areaname}}</div>
              <div class="font24">{{address.sheetname}}</div>
              <div class="font24">{{address.address}}</div>
            </div>
          </div>
        </div>
        <div class="order_section bgffffff" @click="setAddressListFlag" v-else>请选择收货地址</div>
        <!-- 收货地址 end -->
        <!-- 配送服务费 start -->
        <div class="order_section bgffffff">
          <div class="font24">
            共
            <span class="colorf84242 font30"> {{order.gdsCount}} </span>
            种商品，商品总价：
            <span class="colorf84242 font30">￥{{(order.totalMoney || 0).toFixed(2)}}</span>&nbsp;
            <span class="colorf84242 font24" v-if="address">{{freightmoney.message}}</span>
          </div>
        </div>
        <!-- 配送服务费 end -->
        <!-- 优惠券 start -->
        <div class="order_section bgffffff" @click="tickList" v-if="paymodeList.filter(item => item.paymodeid === 4).length">
          <div class="">优惠券</div>
          <div class="colorf84242" v-if="tick.dicountMoney">￥{{tick.dicountMoney}}</div>
          <div class="color999999 font24" v-else>选择地址后可选优惠券</div>
          <div>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <!-- 优惠券 end -->
        <!-- 积分抵扣 start -->
        <div class="order_section bgffffff" v-if="paymodeList.filter(item => item.paymodeid === 5).length">
          <div class="">积分抵扣</div>
          <div class="color999999 font24">
            <span class="colorf84242">￥{{(score.Money || 0).toFixed(2)}}</span>&nbsp;
            抵扣
            <span class="colorf84242">{{score.useScore}}</span>
            分
          </div>
          <div class="score_img" @click="setScoreflag">
            <img src="static/img/on.png" v-if="scoreFlag">
            <img src="static/img/off.png" v-else>
          </div>
        </div>
        <!-- 积分抵扣 end -->
        <!-- 支付方式 start -->
        <div class="order_section bgffffff paymode_img">
          <div class="">支付方式</div>
          <van-radio-group
            direction="horizontal"
            v-model="paymodeid">
            <van-radio
              v-if="paymodeList.filter(item => item.paymodeid === 3).length"
              name="3"
              checked-color="#ff6400">
              <img src="static/img/card.png">&nbsp;
              <span class="payname font24">储值卡</span>
            </van-radio>
            <van-radio
              name="7"
              checked-color="#ff6400">
              <img src="static/img/wechat.png">&nbsp;
              <div class="payname font24">微信</div>
            </van-radio>
          </van-radio-group>
        </div>
        <!-- 支付方式 end -->
        <!-- 订单备注 start -->
        <div class="order_section_usernote bgffffff">
          <div class="">订单备注</div>
          <div class="editorder_usernote border_r8 borderc7c7c7">
            <van-field
              v-model="usernote"
              rows="2"
              autosize
              type="textarea"
              maxlength="50"
              placeholder="请输入备注"
              show-word-limit
            />
          </div>
        </div>
        <!-- 订单备注 end -->
        <!-- 结算信息 start -->
        <div class="order_section_usernote bgffffff">
          <div class="order_desc">
            <div class="font24">商品金额</div>
            <div class="font24 color999999">￥{{(Totalmoney || 0).toFixed(2)}}</div>
          </div>
          <div class="order_desc" v-if="freightmoney.freightmoney">
            <div class="font24">配送服务费</div>
            <div class="font24 color999999">+￥{{(freightmoney.freightmoney || 0).toFixed(2)}}</div>
          </div>
          <div class="order_desc" v-if="paymodeList.filter(item => item.paymodeid === 4).length">
            <div class="font24">优惠券</div>
            <div class="font24 color999999">-￥{{(tick.dicountMoney || 0).toFixed(2)}}</div>
          </div>
          <div class="order_desc" v-if="paymodeList.filter(item => item.paymodeid === 5).length">
            <div class="font24">积分抵扣</div>
            <div class="font24 color999999">-￥{{(scoreMoney || 0).toFixed(2)}}</div>
          </div>
          <div class="order_desc" v-if="smallmoney">
            <div class="font24">零钱</div>
            <div class="font24 color999999" v-if="smallmoney >= 0">-￥{{(smallmoney || 0).toFixed(2)}}</div>
            <div class="font24 color999999" v-if="smallmoney < 0">+￥{{(Math.abs(smallmoney) || 0).toFixed(2)}}</div>
          </div>
        </div>
        <!-- 结算信息 end -->
      </div>
      <!-- 订单内容 end -->
      <!-- 结算金额 start -->
      <div class="order_money bgffffff">
        <div class="order_money_totalMoney font24 ellipsis">实付：<span class="colorf84242 font34">￥{{((payMoney - smallmoney) || 0).toFixed(2)}}</span></div>
        <div class="pay colorffffff bgff6400">
          <pay-btn
            :paymodeid="paymodeid"
            :scoreFlag="scoreFlag"
            :usernote="usernote"
            :froms="'editorder'"
          >立即支付</pay-btn>
        </div>
      </div>
      <!-- 结算金额 end -->
    </div>
    <!-- 订单 end -->
    <!-- 地址 start -->
    <div class="order_main order_main_list bgffffff" v-if="addressListFlag">
      <div class="headerback fl" @click="setListFlag"></div>
      <addresslist
        :froms="'editorder'"
        :Totalmoney="Totalmoney"
        :goodsid="goodsid"
        :otc="otc"
        @setAddressListFlag="setAddressListFlag"
      ></addresslist>
    </div>
    <!-- 地址 end -->
    <!-- 优惠券 start -->
    <div class="order_main order_main_list" v-if="tickListFlag">
      <div class="headerback fl" @click="setListFlag"></div>
      <ticklist
        :froms="'editorder'"
        :payMoney="payMoney"
        :Totalmoney="Totalmoney"
        :addressid="addressid"
        @setTickListFlag="setTickListFlag"
      ></ticklist>
    </div>
    <!-- 优惠券 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import payBtn from '@/components/common/payBtn/payBtn'
import addresslist from '@/components/common/addressList/addressList'
import ticklist from '@/components/common/tickList/tickList'
import tip from '@/utils/Toast'

export default {
  name: 'editorder',
  data () {
    return {
      // 临时订单信息
      order: this.$store.state.order,
      // 积分使用开关
      scoreFlag: false,
      // 支付方式
      paymodeid: '7',
      // 订单备注
      usernote: '',
      // 优惠券优惠金额
      dicountMoney: '',
      // 地址显示开关
      addressListFlag: false,
      // otc
      otc: this.$route.query.otc,
      // goodsid
      goodsid: this.$route.query.goodsid,
      // 优惠券列表显示开关
      tickListFlag: false
    }
  },
  computed: {
    // 收货地址
    address () {
      let self = this
      return self.$store.state.address
    },
    // 支付方式列表
    paymodeList () {
      let self = this
      return self.$store.state.order.paymodeList || []
    },
    // 订单总金额
    Totalmoney () {
      let self = this
      return self.order.totalMoney
    },
    // 收货地址id
    addressid () {
      let self = this
      return self.address.addressid
    },
    // 配送服务费
    freightmoney () {
      let self = this
      return self.$store.state.freightmoney
    },
    // 积分
    score () {
      let self = this
      return self.$store.state.score
    },
    // 积分抵扣金额
    scoreMoney () {
      let self = this
      let money
      if (!self.scoreFlag) {
        money = 0
      } else {
        money = self.score.Money || 0
      }
      return money
    },
    // 零钱
    smallmoney () {
      let self = this
      let money = self.payMoney - self.order.smallmoney
      if (money < 0) {
        return self.payMoney
      }
      return self.order.smallmoney
    },
    // 优惠券
    tick () {
      let self = this
      return self.$store.state.tick
    },
    // 计算支付金额
    payMoney () {
      let self = this
      let money = parseFloat(self.Totalmoney) + parseFloat(self.freightmoney.freightmoney || 0) - parseFloat(self.scoreMoney || 0) - parseFloat(self.tick.dicountMoney || 0)
      return money
    }
  },
  components: {
    MyHeader,
    payBtn,
    addresslist,
    ticklist
  },
  methods: {
    // 请求可用积分
    getScore () {
      let self = this
      let data = {
        payMoney: parseFloat(self.payMoney),
        Totalmoney: parseFloat((self.Totalmoney + self.freightmoney))
      }
      self.$api.bill.payMoneyjf(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.$store.commit('setScore', res.data)
        } else {
          tip(res.msg)
        }
      })
    },
    // 去地址列表
    setAddressListFlag () {
      let self = this
      self.addressListFlag = !self.addressListFlag
    },
    // 去优惠券列表
    tickList () {
      let self = this
      if (!self.address) {
        tip('请选择收货地址！')
        return false
      }
      self.$store.commit('setTick', '')
      self.setTickListFlag()
    },
    // 优惠券列表显示隐藏
    setTickListFlag () {
      let self = this
      self.tickListFlag = !self.tickListFlag
    },
    // 是否使用积分
    setScoreflag () {
      let self = this
      self.scoreFlag = !self.scoreFlag
    },
    // 清除旧的订单信息
    delOrderDes () {
      let self = this
      self.$store.commit('setScore', '')
      self.$store.commit('setAddress', '')
      self.$store.commit('setFreightmoney', '')
      self.$store.commit('setTick', '')
    },
    // 地址列表、优惠券列表显示隐藏
    setListFlag () {
      let self = this
      self.addressListFlag = false
      self.tickListFlag = false
    }
  },
  watch: {
    payMoney (oval, nval) {
      let self = this
      if (!self.scoreFlag) {
        if (self.paymodeList.filter(item => item.paymodeid === 5).length) {
          // 页面加载时请求积分
          self.getScore()
        }
      }
    }
  },
  beforeCreate () {
  },
  created () {
    let self = this
    // 清除旧的订单信息
    self.delOrderDes()
    // 存在积分抵扣支付方式时
    if (self.paymodeList.filter(item => item.paymodeid === 5).length) {
      // 页面加载时请求积分
      self.getScore()
    }
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import 'static/css/editorder.css';
</style>
