<template>
    <div class="container bgeeeeee" v-title :data-title="$store.state.userInfo.deptname">
      <!-- 购物车列表 start -->
      <div class="cart_cont">
        <!-- 加载中动画 start -->
        <loading v-if="isShowLoading"></loading>
        <!-- 加载中动画 end -->
        <div class="cartlist" v-if="cartList.length">
          <div class="goodslist">
            <ul ref="cartlist">
              <!-- 商品简介 start -->
              <li class="goods_li bgffffff" v-for="(item, index) in cartList" :key="index">
                <div class="goods_input" @click="addorder(item.no)">
                  <input class="checkbox" type="checkbox" name="goods" v-model="item.addorder">
                </div>
                <div class="goods_item">
                  <div class="goods_item_img" @click="goodsdetail(item)">
                    <img :src="(item.picture1 ? (imgurl + 'image/' + item.picture1.replace('.', '-zip-300.')) : ('static/img/goods.png'))">
                    <div v-if="item.promotemode !== 0" class="goods_age ellipsis font24 font_normal colorffffff">{{item.modenote}}</div>
                  </div>
                  <div class="goods_item_cont">
                    <div class="goods_item_name ellipsis2 font26" @click="goodsdetail(item)">{{item.cusgoodsname}}</div>
                    <div class="goods_item_editnum">
                      <div class="goods_item_price">
                        <div class="ellipsis font32 font_blod colorf84242" v-if="item.promotevalue">￥{{item.promotevalue}}</div>
                        <div class="ellipsis font32 font_blod colorf84242" v-else>￥{{item.saleprice}}</div>
                        <del class="ellipsis font26 color999999" v-if="item.promotevalue && item.promotevalue !== item.saleprice">￥{{item.saleprice}}</del>
                      </div>
                      <div class="goods_num">
                        <div class="goods_num_btn goods_num_countnum borderc7c7c7 border_r4 tc font40 font_lighter color999999" @click="countAmount(item)">-</div>
                        <div class="goods_num_input borderc7c7c7 border_r4 tc colorff6400 font30">{{item.amount}}</div>
                        <div class="goods_num_btn goods_num_addnum borderc7c7c7 border_r4 tc font40 font_lighter color999999" @click="addAmount(item)">+</div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <!-- 商品简介 end -->
            </ul>
          </div>
          <div class="pay_cont bgffffff">
            <div class="editcart_btn font28 font_normal color999999" v-if="!all">
              <input ref="all" class="checkbox" type="checkbox" id="all" @change="setAll">
              <label for="all">全选</label>
            </div>
            <div class="editcart_btn font28 font_normal color999999" v-if="all">
              <input ref="all" class="checkbox" type="checkbox" id="noall" @change="setNoall" v-model="all">
              <label for="noall">不选</label>
            </div>
            <div class="editcart_btn font28 font_normal color999999" @click="delGoods">删除</div>
            <div class="cart_nums">
              <!--<span class="font24 color666666">合计：</span>-->
              <!--<span class="colorf86442 font32">￥{{totalmoney}}</span>-->
            </div>
            <div class="pay bgff6400 colorffffff tc">
              <addorder
                      :amount="1"
                      :no="no">结算</addorder>
            </div>
          </div>
        </div>
        <!-- 无信息提示 start -->
        <nodata v-else class="bgeeeeee"></nodata>
        <!-- 无信息提示 end -->
      </div>
      <!-- 购物车列表 end -->
      <!-- 底部导航 start -->
      <my-footer></my-footer>
      <!-- 底部导航 end -->
    </div>
</template>

<script>
import MyFooter from '@/components/common/footer/myfooter'
import MyHeader from '@/components/common/header/myheader'
import nodata from '@/components/common/nodata/nodata'
import addorder from '@/components/common/addorder/addorder'
import loading from '@/components/common/loading/loading'
import tip from '@/utils/tip'

export default {
  name: 'cart',
  data () {
    return {
      // 购物车列表
      cartList: [],
      // 图片路径
      imgurl: this.IMGURL,
      // 促销类型
      Promotemode: this.$store.state.Promotemode,
      // 是否全部选中
      all: true,
      // 选中商品总价
      totalmoney: 0,
      // 结算商列表
      no: []
    }
  },
  computed: {
    carts () {
      let self = this
      let str = JSON.stringify(self.cartList)
      return JSON.parse(str)
    }
  },
  components: {
    MyHeader,
    MyFooter,
    nodata,
    addorder,
    loading
  },
  methods: {
    // 获取购物车商品
    getCartList () {
      let self = this
      self.isShowLoading = true
      let data = {
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.getCar(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.isShowLoading = false
          self.cartList = res.data
          self.cartList.forEach(item => {
            item.addorder = true
          })
          // 计算选中商品总价
          self.setTotalmoney()
          self.$store.commit('setCart', res.data)
        } else {
          tip(res.msg)
        }
      })
    },
    // 商品详情
    goodsdetail (goodsdetail) {
      let self = this
      self.$store.commit('setGoodsdetail', goodsdetail)
      self.$router.push({name: 'goodsdetail', query: {goodsid: goodsdetail.goodsid, goodsname: goodsdetail.cusgoodsname}})
    },
    // 加
    addAmount (goods) {
      let self = this
      let num = parseInt(goods.amount) + 1
      if (num > 0) {
        // 提交修改信息
        self.editAmount(num, goods.no)
      }
    },
    // 减
    countAmount (goods) {
      let self = this
      let num = parseInt(goods.amount) - 1
      if (num > 0) {
        // 提交修改信息
        self.editAmount(num, goods.no)
      }
    },
    // 提交修改信息
    editAmount (amount, no) {
      let self = this
      let data = {
        amount: amount,
        no: no,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.modifyCar(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.cartList.forEach(item => {
            if (item.no === no) {
              item.amount = amount
            }
          })
          // 计算选中商品总价
          self.setTotalmoney()
        } else {
          tip(res.msg)
        }
      })
    },
    // 选中结算商品
    addorder (no) {
      let self = this
      let flag = true
      self.cartList.forEach(item => {
        if (item.no === no) {
          item.addorder = !item.addorder
        }
        if (!item.addorder) {
          flag = false
        }
      })
      if (!flag) {
        self.all = false
        self.$refs.all.checked = false
      } else {
        self.all = true
        self.$refs.all.checked = true
      }
      // 计算选中商品总价
      self.setTotalmoney()
    },
    // 全选
    setAll () {
      let self = this
      self.cartList.forEach(item => {
        item.addorder = true
      })
      self.all = true
      self.$refs.all.checked = true
      // 计算选中商品总价
      self.setTotalmoney()
    },
    // 不选
    setNoall () {
      let self = this
      self.cartList.forEach(item => {
        item.addorder = false
      })
      self.all = false
      self.$refs.all.checked = false
      // 计算选中商品总价
      self.setTotalmoney()
    },
    // 删除商品
    delGoods () {
      let self = this
      let arrlist = self.cartList.filter(item => item.addorder === true)
      let arrno = arrlist.map(item => item.no)
      let data = {
        no: arrno,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.deleteCar(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.cartList = self.cartList.filter(item => item.addorder !== true)
          // 计算选中商品总价
          self.setTotalmoney()
        } else {
          tip(res.msg)
        }
      })
    },
    // 计算商品总价
    setTotalmoney () {
      let self = this
      let money = 0
      let no = []
      self.cartList.forEach(item => {
        if (item.addorder) {
          let _money
          no.push(item.no)
          if (!item.promotemode || item.promotemode === 2 || item.promotemode === 3) {
            _money = parseFloat(item.amount) * parseFloat(item.saleprice)
          } else {
            _money = parseFloat(item.amount) * parseFloat(item.promotevalue)
          }
          money += _money
        }
      })
      self.totalmoney = money.toFixed(2)
      self.no = no
    }
  },
  watch: {
  },
  beforeRouteEnter (to, from, next) {
    let ExcludeComponent = ['category', 'searchList', 'recommendList', 'classList']
    next(vm => {
      vm.$store.commit('addExcludeComponent', ExcludeComponent)
      next()
    })
  },
  beforeCreate () {
  },
  created () {
    let self = this
    // 页面加载时获取购物车商品
    self.getCartList()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/cart.css";
.cart_cont {
  position: relative;
}
</style>
