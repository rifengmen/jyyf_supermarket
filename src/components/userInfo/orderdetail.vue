<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>订单详情</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 订单内容 start -->
    <div class="order_cont" v-if="orderdetail">
      <!-- 收货地址 start -->
      <div class="order_section bgffffff">
        <div class="address_item_desc">
          <div class="address_item_user font_blod ellipsis">
            <div>{{orderdetail.receiver}}</div>
            <div>{{orderdetail.phone}}</div>
            <!--<div class="address_item_age bgffae43 colorffffff tc border_r4 font22 font_normal">店铺</div>-->
          </div>
          <div class="address_item_address ellipsis color666666">
            <!--<div class="font24">{{'收货片'}}</div>-->
            <!--<div class="font24">{{'收货区'}}</div>-->
            <div class="font24">{{orderdetail.address}}</div>
          </div>
        </div>
      </div>
      <!-- 收货地址 end -->
      <!-- 订单商品 start -->
      <div class="order_sections bgffffff">
        <div class="order_goods">
          <!-- 商品列表 start -->
          <ul class="goodsList">
            <!-- 商品简介 start -->
            <li v-for="(item, index) in goodsList" :key="index" class="goods_li">
              <div class="goods_item bgffffff ellipsis">
                <div class="goods_item_img">
                  <img v-lazy="(item.picture1) ? IMGURL + 'image/' + item.picture1.replace('.', '-zip-300.') : ''">
                </div>
                <div class="goods_item_cont">
                  <div class="goods_item_name ellipsis font26">{{item.goodsname}}</div>
                  <div class="goods_item_name ellipsis font24 colorfa2a2a"></div>
                  <div class="goods_item_editnum">
                    <div class="goods_item_price">
                      <div class="font30 font_blod colorf84242">￥{{item.price}}</div>
                      <del class="font24 color999999">￥{{item.saleprice}}</del>
                    </div>
                    <div class="font30 color999999">x <span class="">{{item.amount}}</span></div>
                  </div>
                </div>
              </div>
            </li>
            <!-- 商品简介 end -->
          </ul>
          <!-- 商品列表 end -->
        </div>
      </div>
      <!-- 订单商品 end -->
      <!-- 支付信息 start -->
      <div class="order_section bgffffff">
        <div class="paydesc">
          <div class="font24">商品金额</div>
          <div class="font24 color666666">￥{{((orderdetail.shouldmoney - orderdetail.freight) || 0).toFixed(2)}}</div>
        </div>
        <div class="paydesc">
          <div class="font24">服务费</div>
          <div class="font24 color666666">+￥{{(orderdetail.freight || 0).toFixed(2)}}</div>
        </div>
        <div class="paydesc" v-for="(item, index) in orderdetail.PayDetail" :key="index" v-if="item.paymodeid === 5">
          <div class="font24">积分抵扣</div>
          <div class="font24 color666666">-￥{{(item.paymoney || 0).toFixed(2)}}</div>
        </div>
        <div class="paydesc"  v-for="(item, index) in orderdetail.PayDetail" :key="index" v-if="item.paymodeid === 4">
          <div class="font24">优惠券</div>
          <div class="font24 color666666">-￥{{(item.paymoney || 0).toFixed(2)}}</div>
        </div>
        <div class="paydesc"  v-for="(item, index) in orderdetail.PayDetail" :key="index" v-if="item.paymodeid === 10">
          <div class="font24">零钱</div>
          <div class="font24 color666666" v-if="item.paymoney >= 0">-￥{{(item.paymoney || 0).toFixed(2)}}</div>
          <div class="font24 color666666" v-if="item.paymoney < 0">+￥{{(Math.abs(item.paymoney) || 0).toFixed(2)}}</div>
        </div>
        <div class="paydesc">
          <div>订单金额</div>
          <div class="colorf84242 font_blod">￥{{(paymoney || 0).toFixed(2)}}</div>
        </div>
        <div class="item_btn" v-if="orderdetail.payflag || orderdetail.cancelflag || orderdetail.deleflag">
          <div class="pay_btn border_r4 bgff6400 colorffffff borderff6400" v-if="orderdetail.payflag">
            <div @click="againPay">付款</div>
          </div>
          <div class="cancel_btn border_r4 bgffffff color666666 borderc7c7c7" v-if="orderdetail.cancelflag">
            <cancel-btn :tradeno="orderdetail.tradeno"></cancel-btn>
          </div>
          <div class="del_btn border_r4 bgffffff color666666 borderc7c7c7" v-if="orderdetail.deleflag">
            <del-btn :tradeno="orderdetail.tradeno"></del-btn>
          </div>
        </div>
      </div>
      <!-- 支付信息 end -->
      <!-- 订单信息 start -->
      <div class="order_section bgffffff">
        <div class="orderdesc">
          <div>订单状态</div>
          <div class="font24 color666666">{{orderdetail.stausdescribe}}</div>
        </div>
        <div class="orderdesc">
          <div>订单编号</div>
          <div class="font24 color666666">{{orderdetail.tradeno}}</div>
        </div>
        <div class="orderdesc" v-if="orderdetail.pickoutcode">
          <div>取货码</div>
          <div class="font24 colorff6400">{{orderdetail.pickoutcode}}</div>
        </div>
        <div class="orderdesc">
          <div>下单时间</div>
          <div class="font24 color666666">{{orderdetail.Recordtime}}</div>
        </div>
        <div class="orderdesc">
          <div>订单备注</div>
          <div class="order_comment font24 color666666">{{orderdetail.comment}}</div>
        </div>
        <div class="orderdesc" v-for="(item, index) in orderdetail.PayDetail" :key="index" v-if="orderdetail.paystate === 1 && item.paymodeid === 3">
          <div>付款方式</div>
          <div class="pay_img tl color666666">
            <img src="static/img/card.png">&nbsp;储值卡
          </div>
          <div class="pay_img color666666" v-if="orderdetail.paymoney === 0">无</div>
        </div>
        <div class="orderdesc" v-for="(item, index) in orderdetail.PayDetail" :key="index" v-if="orderdetail.paystate === 1 && item.paymodeid === 7">
          <div>付款方式</div>
          <div class="pay_img tl color666666">
            <img src="static/img/wechat.png">&nbsp;微信
          </div>
          <div class="pay_img color666666" v-if="orderdetail.paymoney === 0">无</div>
        </div>
        <div class="orderdesc" v-for="(item, index) in orderdetail.PayDetail" :key="index" v-if="orderdetail.paystate === 1 && paymoney === 0">
          <div>付款方式</div>
          <div class="pay_img color666666">无</div>
        </div>
        <div class="orderdesc" v-if="orderdetail.paystate === 1">
          <div>付款时间</div>
          <div class="font24 color666666">{{orderdetail.paydate}}</div>
        </div>
      </div>
      <!-- 订单信息 end -->
    </div>
    <!-- 订单内容 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import payBtn from '@/components/common/payBtn/payBtn'
import delBtn from '@/components/common/delBtn/delBtn'
import cancelBtn from '@/components/common/cancelBtn/cancelBtn'

export default {
  name: 'orderdetail',
  data () {
    return {
      // 订单tradeno
      tradeno: this.$route.query.tradeno,
      // 订单详情
      orderdetail: '',
      // 订单商品列表
      goodsList: '',
      // 图片路径
      IMGURL: this.IMGURL,
      // 计算付款金额
      paymoney: 0
    }
  },
  computed: {
  },
  components: {
    MyHeader,
    payBtn,
    delBtn,
    cancelBtn
  },
  methods: {
    // 获取订单详情
    getOrderdetail () {
      let data = new FormData()
      let requestData = {
        tradeno: this.tradeno,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/order/getOrderDtl', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.orderdetail = res.data
          this.paymoney = res.data.shouldmoney
          this.goodsList = res.data.OrderDetail
          let _this = this
          // 页面加载时计算实付金额
          this.orderdetail.PayDetail.forEach((item) => {
            if (item.paymodeid === 4 || item.paymodeid === 5 || item.paymodeid === 10) {
              _this.paymoney -= item.paymoney
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
    // 再支付
    againPay () {
      this.$router.push({name: 'againPay', query: {tradeno: this.tradeno, group: this.orderdetail.ordertype, groupno: this.orderdetail.groupno}})
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    // 页面加载时获取订单详情
    this.getOrderdetail()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/userInfo.css";

</style>
