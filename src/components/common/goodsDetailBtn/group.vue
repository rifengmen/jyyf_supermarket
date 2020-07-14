<template>
    <div class="btns_cont">
      <div class="btns_cont">
        <div class="goods_btn tc colorffffff bgff6400" v-if="!groupno">
          <div @click="addGroup">发起拼团</div>
        </div>
        <div class="goods_btn tc colorffffff bgffae89"  v-if="!groupno">
          <div @click="setShowGroup">参与拼团</div>
        </div>
        <div class="goods_btn tc color333333 bgeeeeee ellipsis" v-if="groupno">
          拼团号：{{groupno}}
        </div>
        <div class="goods_btn tc colorffffff bgffae89" v-if="groupno" >
          <div @click="groupDetail">拼团详情</div>
        </div>
        <div class="pay goods_btn tc colorffffff bgff6400"  v-if="!groupno">
          <addorder :goods="goodsdetail" :goodsdetail="true">立即购买</addorder>
        </div>
      </div>
      <!-- 参团弹框 start -->
      <van-dialog
        v-model="showGroup"
        title="请输入团号"
        :closeOnClickOverlay="true"
        :style="'height: 25%;'"
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
      let data = new FormData()
      let requestData = {
        goodsid: this.goodsdetail.goodsid.toString(),
        amount: this.amount,
        otc: 'group',
        isotc: 'group',
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/buyEnd', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$store.commit('setOrder', res.data)
          this.$router.push({name: 'editorder', query: {goodsid: this.goodsdetail.goodsid.toString(), ordertype: 1, otc: 'group'}})
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
    // 显示参团输入框
    setShowGroup () {
      this.joinno = ''
      this.showGroup = true
    },
    // 查看拼团详情
    groupDetail () {
      this.showGroupDetail = true
    },
    // 填写团号验证
    checkJoinGroup () {
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
        this.$axios.post('api/goods/getGroupInfo', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            // 拼团
            this.joinGroup(res.data)
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
    // 参与拼团
    joinGroup (group) {
      let data = new FormData()
      let requestData = {
        goodsid: this.goodsdetail.goodsid.toString(),
        amount: this.amount,
        otc: 'group',
        isotc: 'group',
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/buyEnd', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$store.commit('setOrder', res.data)
          this.$router.push({name: 'editorder', query: {goodsid: this.goodsdetail.goodsid.toString(), ordertype: 2, groupno: this.joinno, otc: 'group'}})
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
  }
}
</script>

<style scoped>
@import "static/css/goodsDetailBtn.css";
</style>
