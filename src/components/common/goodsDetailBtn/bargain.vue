<template>
    <div class="btns_cont">
      <div class="btns_cont">
        <div class="goods_btn tc colorffffff bgf7bb1f" v-if="!groupno || !flag" @click="setShowBargain">参与砍价</div>
        <div class="goods_btn tc colorffffff bgff6400" v-if="!groupno || !flag" @click="addBargain">发起砍价</div>
        <div class="goods_btn tc color333333 bgeeeeee ellipsis" v-if="groupno && !pay && flag">砍价号：{{groupno}}</div>
        <div class="goods_btn tc colorffffff bgf7bb1f" v-if="groupno && flag" @click="bargainDetail">砍价详情</div>
        <div class="pay goods_btn tc colorffffff bgff6400"  v-if="groupno && pay && flag">
          <addorder
                  :goods="goodsdetail"
                  :goodsdetail="true"
                  :pay="pay"
                  :amount="amount"
                  :groupno="groupno">立即购买</addorder>
        </div>
      </div>
      <!-- 参与砍价弹框 start -->
      <van-dialog
        v-model="showBargain"
        title="请输入砍价号"
        class="font32"
        :closeOnClickOverlay="true"
        @confirm="joinBargain"
      >
        <van-cell-group>
          <van-field v-model="joinno" type="digit" placeholder="请输入砍价号" />
        </van-cell-group>
      </van-dialog>
      <!-- 参与砍价弹框 end -->
      <!-- 砍价详情弹窗 start -->
      <van-dialog
        v-model="showBargainDetail"
        title="砍价详情"
        :showConfirmButton="false"
        :closeOnClickOverlay="true"
        :style="'height: 35%;overflow-y: scroll'"
        @close="closeBargainDetail"
      >
        <div class="itemdetail bgeeeeee">
          <div>昵称</div>
          <div class="tc">电话</div>
        </div>
        <div v-for="(item, index) in bargaindetail" :key="index" :class="{itemdetail: true, bgeeeeee: index%2 === 1}">
          <div class="ellipsis font24"><span class="itemdetail_tag font18 colorffffff bgff6400 border_r8">{{item.flag ? '发起人' : '砍价人'}}</span>{{(item.nickname.length === 11) ? (item.nickname.slice(0, 3) + '****' + item.nickname.slice(7, item.nickname.length)) : item.nickname}}</div>
          <div class="tr font24">{{item.mobile.slice(0, 3) + '****' + item.mobile.slice(7, item.mobile.length)}}</div>
        </div>
        <img
          v-if="!groupno || (pay === 1 && flag === 1)"
          src="static/img/bargainsuccess.png"
          class="item_tag">
      </van-dialog>
      <!-- 砍价详情弹窗 end -->
    </div>
</template>

<script>
import addorder from '@/components/common/addorder/addorder'
import tip from '@/utils/tip'

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
    // 活动号
    groupno: {
      type: String,
      default: function () {
        return ''
      }
    },
    // 砍价完成状态，0：砍价中；1：可发起砍价
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
      let self = this
      self.joinno = ''
      self.showBargain = true
    },
    // 新增砍价
    addBargain () {
      let self = this
      // 校验选择数量/样式
      if (!self.amount) {
        self.$emit('isSetStandard')
        return false
      }
      let data = {
        goodsid: self.goodsdetail.goodsid.toString(),
        amount: self.amount,
        saleprice: self.goodsdetail.saleprice,
        discountvalue: self.goodsdetail.discountvalue,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.hackAdd(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          tip('发起成功，快去邀人砍价0×0')
          // 获取砍价号
          self.$emit('getBargainNo')
          // 关闭弹框
          self.$emit('setStandardflag')
        } else {
          tip(res.msg)
        }
      })
    },
    // 参与砍价
    joinBargain (group) {
      let self = this
      let data = {
        goodsid: self.goodsdetail.goodsid.toString(),
        amount: self.amount,
        groupno: self.joinno,
        saleprice: self.goodsdetail.saleprice,
        discountvalue: self.goodsdetail.discountvalue,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.hackIncrease(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          tip('砍价成功!')
        } else {
          tip(res.msg)
        }
      })
    },
    // 砍价详情
    bargainDetail () {
      let self = this
      let data = {
        goodsid: self.goodsdetail.goodsid.toString(),
        amount: 1,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.generateHackBill(data).then(result => {
        let res = result.data
        if (res.code === 200 && res.data.list.length) {
          self.bargaindetail = res.data.list.reverse()
          self.showBargainDetail = true
        }
      })
    },
    // 填写砍价号验证
    checkJoinBargain () {
      let self = this
      if (self.joinno) {
        let data = {
          goodsid: self.goodsdetail.goodsid.toString(),
          joinno: self.joinno,
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        self.$api.api.generateHackBill(data).then(result => {
          let res = result.data
          if (res.code === 200) {
            // 参与砍价
            self.joinBargain(res.data)
          } else {
            tip(res.msg)
          }
        })
      }
    },
    // 关闭砍价详情窗口
    closeBargainDetail () {
      let self = this
      self.$emit('getBargainNo')
    }
  }
}
</script>

<style scoped>
@import "static/css/goodsDetailBtn.css";
</style>
