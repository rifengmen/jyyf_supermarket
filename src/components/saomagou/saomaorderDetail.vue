<template>
  <div class="container_pt90 bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>订单详情</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 订单内容 start -->
    <div class="order_cont" v-if="saomaorderDetail">
      <!-- 收货地址 start -->
      <div class="order_section bgffffff">
        <div class="font32 font_blod">{{saomaorderDetail.shopName}}</div>
      </div>
      <!-- 收货地址 end -->
      <!-- 订单商品 start -->
      <div class="order_section orderdetail_section bgffffff">
        <div class="order_goods">
          <!-- 商品列表 start -->
          <ul class="goodsList">
            <!-- 商品简介 start -->
            <li v-for="(item, index) in goodsList" :key="index" class="goods_li">
              <div class="goods_item bgffffff ellipsis">
                <div class="goods_item_cont">
                  <div class="goods_item_name ellipsis font26">{{item.goodsName}}</div>
                  <div class="goods_item_editnum">
                    <div class="goods_item_price goods_item_prices">
                      <div class="ellipsis font30 font_blod colorf84242">￥{{(item.actualPrice).toFixed(2)}}</div>
                      <del class="ellipsis font24 color999999" v-if="item.actualPrice !== item.salePrice">￥{{(item.salePrice).toFixed(2)}}</del>
                    </div>
                    <div class="font30 color999999">x <span class="">{{item.saleAmount}}</span></div>
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
          <div>订单金额</div>
          <div class="colorf84242 font_blod">￥{{saomaorderDetail.totalMoney.toFixed(2)}}</div>
        </div>
        <div class="item_btn" v-if="saomaorderDetail.payFLag || saomaorderDetail.cancelFlag">
          <div class="pay_btn border_r4 bgff6400 colorffffff borderff6400" v-if="saomaorderDetail.payFLag">
            <router-link
              :to="{name: 'saomaorder', query: {flowno: flowno, deptcode: saomaorderDetail.shopCode, deptname: saomaorderDetail.shopName}}"
              tag="div"
            >付款</router-link>
          </div>
          <div class="cancel_btn border_r4 bgffffff color666666 borderc7c7c7" v-if="saomaorderDetail.cancelFlag">
            <saomacancel-btn :flowno="saomaorderDetail.flowno" :deptcode="saomaorderDetail.shopCode"></saomacancel-btn>
          </div>
        </div>
      </div>
      <!-- 支付信息 end -->
      <!-- 订单信息 start -->
      <div class="order_section bgffffff">
        <div class="orderdesc">
          <div>订单编号</div>
          <div class="font24 color666666">{{saomaorderDetail.flowno}}</div>
        </div>
        <div class="orderdesc">
          <div>下单时间</div>
          <div class="font24 color666666">{{saomaorderDetail.saletime}}</div>
        </div>
        <div class="orderdesc" v-if="!saomaorderDetail.payFLag && saomaorderDetail.payList[0].payModeName === '会员卡储值支付'">
          <div>付款方式</div>
          <div class="pay_img tl color666666">
            <img src="static/img/card.png">&nbsp;储值卡
          </div>
          <div class="pay_img color666666" v-if="saomaorderDetail.payMoney === 0">无</div>
        </div>
        <div class="orderdesc" v-if="!saomaorderDetail.payFLag && saomaorderDetail.payList[0].payModeName === '微信'">
          <div>付款方式</div>
          <div class="pay_img tl color666666">
            <img src="static/img/wechat.png">&nbsp;微信
          </div>
          <div class="pay_img color666666" v-if="saomaorderDetail.payMoney === 0">无</div>
        </div>
      </div>
      <!-- 订单信息 end -->
    </div>
    <!-- 订单内容 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import saomacancelBtn from '@/components/common/saomaBtn/saomacancelBtn'
import tip from '@/utils/Toast'

export default {
  name: 'saomaorderDetail',
  data () {
    return {
      // 店铺信息
      deptcode: this.$route.query.deptcode,
      deptname: this.$route.query.deptname,
      // 订单flowno
      flowno: this.$route.query.flowno,
      // 订单详情
      saomaorderDetail: '',
      // 订单商品列表
      goodsList: ''
    }
  },
  computed: {},
  components: {
    MyHeader,
    saomacancelBtn
  },
  methods: {
    // 获取订单详情
    getSaomaorderDetail () {
      let self = this
      let data = {
        flowno: self.flowno,
        deptcode: self.deptcode
      }
      self.$api.invest.listMicroFlowDtl(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.saomaorderDetail = res.data
          self.goodsList = res.data.gdscodeList
        } else {
          tip(res.msg)
        }
      })
    }
  },
  watch: {},
  beforeRouteLeave (to, from, next) {
    let self = this
    let toReg = /saomaorderList/
    let toReg2 = /saomaorder/
    if (!toReg.test(to.name) && !toReg2.test(to.name)) {
      self.$store.commit('addExcludeComponent', 'saomaorderList')
    } else if (toReg.test(to.name) || toReg2.test(to.name)) {
      self.$store.commit('removeExcludeComponent', 'saomaorderList')
    }
    next()
  },
  beforeCreate () {
  },
  created () {
    let self = this
    // 获取订单详情
    self.getSaomaorderDetail()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import 'static/css/saomagou.css';

</style>
