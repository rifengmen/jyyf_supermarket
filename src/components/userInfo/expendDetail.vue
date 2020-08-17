<template>
  <div class="container_pt90 bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>消费详情</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 订单内容 start -->
    <div class="order_cont bgeeeeee" v-if="expendDetail">
      <!-- 订单商品 start -->
      <div class="order_sections bgffffff">
        <div class="order_goods">
          <!-- 商品列表 start -->
          <ul class="goodsList">
            <!-- 商品简介 start -->
            <li v-for="(item, index) in expendDetail.detailsList" :key="index">
              <div class="goods_item bgffffff ellipsis">
                  <div class="goods_item_name font26">{{item.Productname}}</div>
                  <!--<router-link :to="{name: 'addComment', params: {goods: item}}" tag="div" class="goods_item_name comment tc font24 colorff7e42">去评价</router-link>-->
                  <div class="goods_item_price">
                    <div class="font30 font_blod colorf84242">￥{{item.Paidprice}}</div>
                    <del class="font24 color999999">￥{{item.Receivableprice}}</del>
                  </div>
                  <div class="goods_item_editnum">
                    <div class="font30 color999999">x <span class="">{{item.Salecount}}</span></div>
                  </div>
              </div>
            </li>
            <!-- 商品简介 end -->
          </ul>
          <!-- 商品列表 end -->
        </div>
      </div>
      <!-- 订单商品 end -->
      <!-- 订单信息 start -->
      <div class="order_section bgffffff">
        <div class="orderdesc">
          <div>店铺编码</div>
          <div class="font24 color666666">{{Deptcode}}</div>
        </div>
        <div class="orderdesc">
          <div>店铺名称</div>
          <div class="font24 color666666">{{deptname}}</div>
        </div>
        <div class="orderdesc">
          <div>流水号</div>
          <div class="font24 color666666">{{Flowno}}</div>
        </div>
        <div class="orderdesc">
          <div>下单时间</div>
          <div class="order_comment font24 color666666">{{saletime}}</div>
        </div>
      </div>
      <!-- 订单信息 end -->
    </div>
    <!-- 订单内容 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import nodata from '@/components/common/nodata/nodata'

export default {
  name: 'expendDetail',
  data () {
    return {
      // 流水号
      Flowno: this.$route.query.Flowno,
      // 店铺名称
      deptname: this.$route.query.deptname,
      // 店铺编码
      Deptcode: this.$route.query.Deptcode,
      // 时间
      saletime: this.$route.query.saletime,
      // 消费记录详情
      expendDetail: ''
    }
  },
  computed: {},
  components: {
    MyHeader,
    nodata
  },
  methods: {
    // 获取订单详情
    getExpendDetail () {
      let data = new FormData()
      let requestData = {
        Flowno: this.Flowno,
        Deptcode: this.Deptcode
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('mem/member/listDetails', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.expendDetail = res.data
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
  watch: {},
  beforeCreate () {
  },
  created () {
    // 页面加载时获取消费记录详情
    this.getExpendDetail()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
  @import "static/css/userInfo.css";
  .goods_item {
    height: unset;
    min-height: .8rem;
    border-bottom: 1px solid #f4f4f4;
    padding: .1rem .24rem .1rem .3rem;
  }
  .goodsList li:last-child .goods_item {
    border-bottom: unset;
  }
  .goods_item_name {
    width: 2.5rem;
    height: unset;
    white-space: pre-wrap;
  }
  .comment {
    width: 1rem;
  }
  .goods_item_price {
    width: 2.3rem;
    display: flex;
    justify-content: flex-end;
  }
  .goods_item_editnum {
    width: 1rem;
    display: flex;
    justify-content: flex-end;
  }
</style>
