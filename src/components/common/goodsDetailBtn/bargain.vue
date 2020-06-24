<template>
    <div class="btns_cont">
      <div class="btns_cont">
        <div class="goods_btn tc colorffffff bgff6400" v-if="!bargainno || flag === 0">
          <div @click="addBargain">发起砍价</div>
        </div>
        <div class="goods_btn tc colorffffff bgff6400" v-if="!bargainno || flag === 0">
          <div @click="setShowBargain">参与砍价</div>
        </div>
        <div class="goods_btn tc color333333 bgeeeeee ellipsis" v-if="bargainno && flag === 1">
          砍价号：{{bargainno}}
        </div>
        <div class="goods_btn tc colorffffff bgff6400" v-if="bargainno && flag === 1" >
          <div @click="bargainDetail">砍价详情</div>
        </div>
        <div class="pay goods_btn tc colorffffff bgff6400"  v-if="!bargainno || (pay === 1 && flag === 1)">
          <addorder :goods="goodsdetail" :goodsdetail="true" :pay="pay" :bargainno="bargainno">立即购买</addorder>
        </div>
      </div>
      <!-- 砍价详情弹窗-->
      <van-dialog
        v-model="showBargainDetail"
        title="砍价详情"
        :showConfirmButton="false"
        :closeOnClickOverlay="true"
        :style="'height: 30%;'"
        @close="closeBargainDetail"
      >
        <div v-for="(item, index) in bargaindetail" :key="index">
          <van-grid-item icon="photo-o" text="" />{{item.userid}}
        </div>
      </van-dialog>
      <!-- 参与砍价弹框 start -->
      <van-dialog
        v-model="showBargain"
        title="请输入砍价号"
        :closeOnClickOverlay="true"
        :style="'height: 30%;'"
        @confirm="joinBargain"
      >
        <van-field v-model="joinno" type="digit" placeholder="请输入砍价号" />
      </van-dialog>
      <!-- 参与砍价弹框 end -->
    </div>
</template>

<script>
import addorder from '@/components/common/addorder/addorder'

export default {
  name: 'bargain',
  props: {
    // 商品信息
    goodsdetail: {
      type: Object,
      default: function () {
        return []
      }
    },
    // 商品数量
    amount: {
      type: Number,
      default: function () {
        return 1
      }
    },
    // 砍价号
    bargainno: {
      type: String,
      default: function () {
        return ''
      }
    },
    // 砍价支付状态
    pay: {
      type: Number,
      default: function () {
        return 0
      }
    },
    // 是否是砍价发起人，即购买人
    flag: {
      type: Number,
      default: function () {
        return 0
      }
    }
  },
  data () {
    return {
      // 展示参团弹框
      showBargain: false,
      // 展示拼团信息弹框
      showBargainDetail: false,
      // 砍价详情
      bargaindetail: [],
      // 参与号
      joinno: ''
    }
  },
  computed: {
  },
  components: {
    addorder
  },
  methods: {
    // 显示砍价输入框
    setShowBargain () {
      this.joinno = ''
      this.showBargain = true
    },
    // 新增砍价
    addBargain () {
      let data = new FormData()
      let requestData = {
        goodsid: this.goodsdetail.goodsid.toString(),
        amount: this.amount,
        saleprice: this.goodsdetail.saleprice,
        discountvalue: this.goodsdetail.discountvalue,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/hackAdd', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$toast({
            message: '发起成功，快去邀人砍价0×0',
            type: 'success'
          })
          this.$emit('getBargainNo')
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
    // 参与砍价
    joinBargain (group) {
      let data = new FormData()
      let requestData = {
        goodsid: this.goodsdetail.goodsid.toString(),
        amount: this.amount,
        groupno: this.joinno,
        saleprice: this.goodsdetail.saleprice,
        discountvalue: this.goodsdetail.discountvalue,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/hackIncrease', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$toast({
            message: '参与成功',
            type: 'success'
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
    // 砍价详情
    bargainDetail () {
      let data = new FormData()
      let requestData = {
        goodsid: this.goodsdetail.goodsid.toString(),
        amount: 1,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/generateHackBill', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.bargaindetail = res.data.list
          this.showBargainDetail = true
        }
      }).catch(error => {
        throw error
      })
    },
    // 填写砍价号验证
    checkJoinBargain () {
      if (this.joinno) {
        let data = new FormData()
        let requestData = {
          goodsid: this.goodsdetail.goodsid.toString(),
          joinno: this.joinno,
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.$axios.post('api/goods/generateHackBill', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            // 拼团
            this.joinBargain(res.data)
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
    // 关闭砍价详情窗口
    closeBargainDetail () {
      this.$emit('getBargainNo')
    }
  }
}
</script>

<style scoped>
@import "static/css/goodsDetailBtn.css";
</style>
