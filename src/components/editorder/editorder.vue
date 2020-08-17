<template>
  <div class="container_pt110 bgeeeeee" v-title :data-title="$store.state.userInfo.deptname">
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
      <div class="order_cont">
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
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="usernote">
            </el-input>
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
    <div class="order_main order_main_list" v-if="addressListFlag">
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
      return this.$store.state.address
    },
    // 支付方式列表
    paymodeList () {
      return this.$store.state.order.paymodeList || []
    },
    // 订单总金额
    Totalmoney () {
      return this.order.totalMoney
    },
    // 收货地址id
    addressid () {
      return this.address.addressid
    },
    // 配送服务费
    freightmoney () {
      return this.$store.state.freightmoney
    },
    // 积分
    score () {
      return this.$store.state.score
    },
    // 积分抵扣金额
    scoreMoney () {
      let money
      if (!this.scoreFlag) {
        money = 0
      } else {
        money = this.score.Money || 0
      }
      return money
    },
    // 零钱
    smallmoney () {
      let money = this.payMoney - this.order.smallmoney
      if (money < 0) {
        return this.payMoney
      }
      return this.order.smallmoney
    },
    // 优惠券
    tick () {
      return this.$store.state.tick
    },
    // 计算支付金额
    payMoney () {
      let money = parseFloat(this.Totalmoney) + parseFloat(this.freightmoney.freightmoney || 0) - parseFloat(this.scoreMoney || 0) - parseFloat(this.tick.dicountMoney || 0)
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
      let data = new FormData()
      let requestData = {
        payMoney: parseFloat(this.payMoney),
        Totalmoney: parseFloat((this.Totalmoney + this.freightmoney))
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('bill/pay/payMoneyjf', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$store.commit('setScore', res.data)
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
    // 去地址列表
    setAddressListFlag () {
      this.addressListFlag = !this.addressListFlag
    },
    // 去优惠券列表
    tickList () {
      if (!this.address) {
        this.$toast({
          message: '请选择收货地址！',
          type: 'fail'
        })
        return false
      }
      this.$store.commit('setTick', '')
      this.setTickListFlag()
    },
    // 优惠券列表显示隐藏
    setTickListFlag () {
      this.tickListFlag = !this.tickListFlag
    },
    // 是否使用积分
    setScoreflag () {
      this.scoreFlag = !this.scoreFlag
    },
    // 清除旧的订单信息
    delOrderDes () {
      this.$store.commit('setScore', '')
      this.$store.commit('setAddress', '')
      this.$store.commit('setFreightmoney', '')
      this.$store.commit('setTick', '')
    },
    // 地址列表、优惠券列表显示隐藏
    setListFlag () {
      this.addressListFlag = false
      this.tickListFlag = false
    }
  },
  watch: {
    payMoney (oval, nval) {
      if (!this.scoreFlag) {
        if (this.paymodeList.filter(item => item.paymodeid === 5).length) {
          // 页面加载时请求积分
          this.getScore()
        }
      }
    }
  },
  beforeCreate () {
  },
  created () {
    // 清除旧的订单信息
    this.delOrderDes()
    // 存在积分抵扣支付方式时
    if (this.paymodeList.filter(item => item.paymodeid === 5).length) {
      // 页面加载时请求积分
      this.getScore()
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
