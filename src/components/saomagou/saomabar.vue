<template>
  <div class="container saomabar_cont">
    <!-- 出场码 start -->
    <div class="online bg373947" v-if="flag">
      <div class="online_cont bgffffff border_r8">
        <div class="online_tit tc font32 colorffffff">出场码</div>
        <div class="online_bar online_img">
          <img :src="saomabar !== 'static/img/goods.png' ? imgurl + saomabar : saomabar" @error="setSrc">
        </div>
        <div class="online_age">
          <img src="static/img/code_phone.png">
          <div class="font24 color999999">使用时向收银员展示</div>
        </div>
      </div>
      <div class="online_btn">
        <div class="online_vip colorffffff borderff6400 bgff6400 border_r4 tc" @click="toggleFlag">订单详情</div>
        <div class="online_pay colorffffff borderffffff border_r4 tc" @click="closeBar">关闭</div>
      </div>
    </div>
    <!-- 出场码 end -->
    <!-- 订单详情 start -->
    <div class="online bg373947" v-else>
      <div class="online_cont bgffffff border_r8">
        <div class="online_detailtit font32 font_blod bgf7f7f7">订单详情</div>
        <div class="online_detail">
          <ul>
            <!-- 商品简介 start -->
            <li class="goods_li" v-for="(item, index) in goodsList" :key="index">
              <div class="goods_item bgffffff ellipsis">
                <div class="goods_item_cont">
                  <div class="goods_item_name ellipsis font26">{{item.goodsName}}</div>
                  <div class="goods_item_editnum">
                    <div class="goods_item_price">
                      <div class="ellipsis color999999">￥{{item.actualPrice}}</div>
                      <del class="ellipsis color999999" v-if="item.actualPrice !== item.salePrice">￥{{item.salePrice}}</del>
                    </div>
                    <div class="goods_num">
                      <div class="goods_num_input tc color999999">×{{item.saleAmount}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <!-- 商品简介 end -->
          </ul>
        </div>
      </div>
      <div class="online_btn">
        <div class="online_vip colorffffff borderff6400 bgff6400 border_r4 tc" @click="toggleFlag">出场码</div>
        <div class="online_pay colorffffff borderffffff border_r4 tc" @click="closeBar">关闭</div>
      </div>
    </div>
    <!-- 订单详情 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import tip from '@/utils/Toast'

export default {
  name: 'saomabar',
  data () {
    return {
      // 出场码显示开关
      flag: true,
      // 图片基础路径
      imgurl: this.IMGURL,
      // 条码
      saomabar: this.$route.query.saomabar,
      // 店铺信息
      deptcode: this.$store.state.shopInfo.deptcode,
      deptname: this.$store.state.shopInfo.deptname,
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
    MyHeader
  },
  inject: ['reload'],
  methods: {
    // 切换出场码和详情
    toggleFlag () {
      let self = this
      self.flag = !self.flag
      if (!self.flag && !self.saomaorderDetail) {
        // 获取订单详情
        self.getSaomaorderDetail()
      }
    },
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
    },
    // 设置图片路径
    setSrc () {
      let self = this
      self.reload()
    },
    // 关闭出场码
    closeBar () {
      let self = this
      self.$router.push({name: 'saomagou'})
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
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
