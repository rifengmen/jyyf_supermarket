<template>
    <div class="container bgeeeeee" v-title :data-title="$store.state.userInfo.deptname">
      <!-- 头部 start -->
      <!--<my-header>-->
        <!--<template v-slot:header>购物车</template>-->
      <!--</my-header>-->
      <!-- 头部 end -->
      <!-- 购物车列表 start -->
      <div class="cart_cont">
        <!-- 加载中动画 start -->
        <loading v-if="isShowLoading"></loading>
        <!-- 加载中动画 end -->
        <div class="cartlist" v-if="cartList.length">
          <div class="goodslist">
            <ul ref="cartlist">
              <!-- 商品简介 start -->
              <li class="goods_li" v-for="(item, index) in cartList" :key="index">
                <!--<div class="goods_input bgffffff">-->
                  <!--<van-checkbox-->
                    <!--v-model="item.addorder"-->
                    <!--icon-size=".28rem"-->
                    <!--checked-color="#ff6400"-->
                    <!--@change="addorder(item.no)">-->
                  <!--</van-checkbox>-->
                <!--</div>-->
                <div class="goods_input bgffffff" @click="addorder(item.no)">
                  <input class="checkbox" type="checkbox" name="goods" v-model="item.addorder">
                </div>
                <div class="goods_item bgffffff ellipsis" @click="goodsdetail(item)">
                  <div class="goods_item_img">
                    <img :src="(item.picture1 ? (imgurl + 'image/' + item.picture1.replace('.', '-zip-300.')) : ('static/img/goods.png'))">
                    <div v-if="item.promotemode !== 0" class="goods_age ellipsis font24 font_normal colorffffff">{{item.modenote}}</div>
                  </div>
                  <div class="goods_item_cont">
                    <div class="goods_item_name ellipsis font26">{{item.cusgoodsname}}</div>
                    <div class="goods_item_name ellipsis font24 colorfa2a2a">{{item.remark}}</div>
                    <div class="goods_item_editnum">
                      <div class="goods_item_price" v-if="item.promotemode === 0 || item.promotemode === 2 || item.promotemode === 3 || item.promotemode === 8">
                        <div class="font30 font_blod colorf84242">￥{{item.saleprice}}</div>
                      </div>
                      <div class="goods_item_price" v-if="item.promotemode === 1 || item.promotemode === 7">
                        <div class="font30 font_blod colorf84242">￥{{item.promotevalue}}</div>
                        <del class="font24 color999999">￥{{item.saleprice}}</del>
                      </div>
                      <div class="goods_item_price" v-if="item.promotemode === 6">
                        <div class="font30 font_blod colorf84242">￥{{item.groupprice}}</div>
                        <del class="font24 color999999">￥{{item.saleprice}}</del>
                      </div>
                      <div class="goods_num">
                        <div class="goods_num_btn goods_num_countnum borderc7c7c7 border_r4 tc font40 font_lighter color999999" @click="countAmount(item.amount, item.no)">-</div>
                        <div class="goods_num_input borderc7c7c7 border_r4 tc colorff6400 font30" @click="changeAmount">{{item.amount}}</div>
                        <div class="goods_num_btn goods_num_addnum borderc7c7c7 border_r4 tc font40 font_lighter color999999" @click="addAmount(item.amount, item.no)">+</div>
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
              <span class="font24 color666666">合计：</span>
              <span class="colorf86442 font32">￥{{totalmoney}}</span>
            </div>
            <div class="pay bgff6400 colorffffff tc">
              <addorder :no="no">结算</addorder>
            </div>
          </div>
        </div>
        <!-- 无信息提示 start -->
        <nodata v-else></nodata>
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
      let str = JSON.stringify(this.cartList)
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
      this.isShowLoading = true
      let data = new FormData()
      let requestData = {
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/car/getCar', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.isShowLoading = false
          this.cartList = res.data
          for (let i = 0; i < this.cartList.length; i++) {
            this.cartList[i].addorder = true
          }
          // 计算选中商品总价
          this.setTotalmoney()
          this.$store.commit('setCart', res.data)
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
    // 商品详情
    goodsdetail (goodsdetail) {
      this.$store.commit('setGoodsdetail', goodsdetail)
      this.$router.push({name: 'goodsdetail', query: {goodsid: goodsdetail.goodsid}})
    },
    // 加
    addAmount (amount, no) {
      window.event.stopPropagation()
      let num = parseInt(amount) + 1
      if (num > 0) {
        this.editAmount(num, no)
      }
    },
    // 减
    countAmount (amount, no) {
      window.event.stopPropagation()
      let num = parseInt(amount) - 1
      if (num > 0) {
        this.editAmount(num, no)
      }
    },
    // 直接输入
    changeAmount () {
      window.event.stopPropagation()
    },
    // 提交修改信息
    editAmount (amount, no) {
      let data = new FormData()
      let requestData = {
        amount: amount,
        no: no,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/car/modifyCar', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          for (let i = 0; i < this.cartList.length; i++) {
            if (this.cartList[i].no === no) {
              this.cartList[i].amount = amount
            }
          }
          // 计算选中商品总价
          this.setTotalmoney()
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
    // 选中结算商品
    addorder (no) {
      let flag = true
      for (let i = 0; i < this.cartList.length; i++) {
        if (this.cartList[i].no === no) {
          this.cartList[i].addorder = !this.cartList[i].addorder
        }
        if (!this.cartList[i].addorder) {
          flag = false
        }
      }
      if (!flag) {
        this.all = false
        this.$refs.all.checked = false
      } else {
        this.all = true
        this.$refs.all.checked = true
      }
      // 计算选中商品总价
      this.setTotalmoney()
    },
    // 全选
    setAll () {
      for (let i = 0; i < this.cartList.length; i++) {
        this.cartList[i].addorder = true
      }
      this.all = true
      this.$refs.all.checked = true
      // 计算选中商品总价
      this.setTotalmoney()
    },
    // 不选
    setNoall () {
      for (let i = 0; i < this.cartList.length; i++) {
        this.cartList[i].addorder = false
      }
      this.all = false
      this.$refs.all.checked = false
      // 计算选中商品总价
      this.setTotalmoney()
    },
    // 删除商品
    delGoods () {
      let arrlist = this.cartList.filter(item => item.addorder === true)
      let arrno = arrlist.map(item => item.no)
      let data = new FormData()
      let requestData = {
        no: arrno,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/car/deleteCar', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.cartList = this.cartList.filter(item => item.addorder !== true)
          this.setTotalmoney()
        } else {
          this.$toast({
            message: res.msg,
            type: 'fail'
          })
        }
      })
    },
    // 计算商品总价
    setTotalmoney () {
      let money = 0
      let no = []
      for (let i = 0; i < this.cartList.length; i++) {
        if (this.cartList[i].addorder) {
          let _money
          no.push(this.cartList[i].no)
          if (this.cartList[i].promotevalue) {
            _money = parseInt(this.cartList[i].amount) * parseFloat(this.cartList[i].promotevalue)
          } else if (this.cartList[i].groupprice) {
            _money = parseInt(this.cartList[i].amount) * parseFloat(this.cartList[i].groupprice)
          } else {
            _money = parseInt(this.cartList[i].amount) * parseFloat(this.cartList[i].saleprice)
          }
          money += _money
        }
      }
      this.totalmoney = money.toFixed(2)
      this.no = no
    }
  },
  watch: {
  },
  beforeCreate () {
  },
  created () {
    // 页面加载时获取购物车商品
    this.getCartList()
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
