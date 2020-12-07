<template>
    <div class="btns_cont">
      <div class="btns_cont">
        <div class="goods_btn tc colorffffff bgff6400" v-if="!groupno" @click="addGroup">发起拼团</div>
        <div class="goods_btn tc colorffffff bgf7bb1f"  v-if="!groupno" @click="setShowGroup">参与拼团</div>
        <div class="goods_btn tc color333333 bgeeeeee ellipsis" v-if="groupno">拼团号：{{groupno}}</div>
        <div class="goods_btn tc colorffffff bgff6400" v-if="groupno" @click="groupDetail">拼团详情</div>
        <div class="pay goods_btn tc colorffffff bgff6400"  v-if="!groupno">
          <addorder :goods="goodsdetail" :goodsdetail="true">立即购买</addorder>
        </div>
      </div>
      <!-- 参团弹框 start -->
      <van-dialog
        v-model="showGroup"
        title="请输入团号"
        :closeOnClickOverlay="true"
        @confirm="checkJoinGroup"
      >
        <van-cell-group>
          <van-field v-model="joinno" type="digit" placeholder="请输入团号" />
        </van-cell-group>
      </van-dialog>
      <!-- 参团弹框 end -->
      <!-- 拼团详情弹窗 start-->
      <van-dialog
        v-model="showGroupDetail"
        title="拼团详情"
        :showConfirmButton="false"
        :closeOnClickOverlay="true"
        :style="'height: 35%;overflow-y: scroll'"
      >
        <div class="itemdetail bgeeeeee">
          <div class="tc">昵称</div>
          <div class="tc">电话</div>
        </div>
        <div v-for="(item, index) in groupdetail" :key="index" :class="{itemdetail: true, bgeeeeee: index%2 === 1}">
          <div class="ellipsis"><span v-if="!index" class="itemdetail_tag font18 colorffffff bgff6400 border_r8">发起人</span>{{(item.nickname.length === 11) ? (item.nickname.slice(0, 3) + '****' + item.nickname.slice(7, item.nickname.length)) : item.nickname}}</div>
          <div class="tr">{{item.mobile.slice(0, 3) + '****' + item.mobile.slice(7, item.mobile.length)}}</div>
        </div>
      </van-dialog>
      <!-- 拼团详情弹窗 end-->
    </div>
</template>

<script>
import addorder from '@/components/common/addorder/addorder'
import tip from '@/utils/Toast'

export default {
  name: 'group',
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
    // 拼团号
    groupno: {
      type: String,
      default: function () {
        return ''
      }
    },
    // 拼团详情
    groupdetail: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      // 展示参团弹框
      showGroup: false,
      // 展示拼团信息弹框
      showGroupDetail: false,
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
    // 发起拼团
    addGroup () {
      let self = this
      let data = {
        goodsid: self.goodsdetail.goodsid.toString(),
        amount: self.amount,
        otc: 'group',
        isotc: 'group',
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.invest.buyEnd(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.$store.commit('setOrder', res.data)
          self.$router.push({name: 'editorder', query: {goodsid: self.goodsdetail.goodsid.toString(), ordertype: 1, otc: 'group'}})
        } else {
          tip(res.msg)
        }
      })
    },
    // 显示参团输入框
    setShowGroup () {
      let self = this
      self.joinno = ''
      self.showGroup = true
    },
    // 查看拼团详情
    groupDetail () {
      let self = this
      self.showGroupDetail = true
    },
    // 填写团号验证
    checkJoinGroup () {
      let self = this
      if (self.joinno) {
        let data = {
          goodsid: self.goodsdetail.goodsid.toString(),
          joinno: self.joinno,
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        self.$api.api.getGroupInfo(data).then(result => {
          let res = result.data
          if (res.code === 200) {
            // 拼团
            self.joinGroup(res.data)
          } else {
            tip(res.msg)
          }
        })
      }
    },
    // 参与拼团
    joinGroup (group) {
      let self = this
      let data = {
        goodsid: self.goodsdetail.goodsid.toString(),
        amount: self.amount,
        otc: 'group',
        isotc: 'group',
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.invest.buyEnd(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.$store.commit('setOrder', res.data)
          self.$router.push({name: 'editorder', query: {goodsid: self.goodsdetail.goodsid.toString(), ordertype: 2, groupno: self.joinno, otc: 'group'}})
        } else {
          tip(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
@import "static/css/goodsDetailBtn.css";
</style>
