<template>
  <div class="myheader bgffffff color333333">
    <!-- 获取微信凭证 start -->
    <wechat-config></wechat-config>
    <!-- 获取微信凭证 end -->
    <div class="backs" @click="editorder" v-if="froms === 'editorder'">
      <slot name="editorder"></slot>
    </div>
    <div class="backs" @click="orderdetail" v-else-if="froms === 'orderdetail'">
      <slot name="orderdetail"></slot>
    </div>
    <div class="backs" @click="userinfo" v-else-if="froms === 'userinfo'">
      <slot name="userinfo"></slot>
    </div>
    <div class="backs" @click="addComment" v-else-if="froms === 'addComment'">
      <slot name="addComment"></slot>
    </div>
    <!--<div class="backs" @click="userinfo" v-if="froms === 'userinfo'">-->
      <!--<slot name="orderdetail"></slot>-->
    <!--</div>-->
    <div class="backs" @click="backs" v-else>
      <slot name="backs"></slot>
    </div>
    <div class="font34 font_blod">
      <slot name="header"></slot>
    </div>
    <div class="header_right" v-if="addFlag === 'dateFlag'">
      <el-date-picker
        @blur="setStartdate"
        v-model="startdate"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        type="date">
      </el-date-picker>
    </div>
    <div class="header_right" @click="addComplaint" v-else-if="addFlag === 'complaint'">
      <slot name="addComplaint"></slot>
    </div>
    <div class="header_right" v-else>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
import WechatConfig from '@/components/common/wechatConfig/wechatConfig'

export default {
  name: 'myheader',
  props: {
    // 返回标识
    froms: {
      type: String,
      // require: true,
      default: function () {
        return ''
      }
    },
    // 右边按钮标识
    addFlag: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
      // 查询开始时间
      startdate: '',
      // 配置时间参数
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  computed: {
  },
  components: {
    WechatConfig
  },
  methods: {
    // 返回
    backs () {
      this.$router.back()
    },
    // 返回购物车
    editorder () {
      this.$router.push({name: 'cart'})
    },
    // 返回订单列表
    orderdetail () {
      this.$router.push({name: 'orderList'})
    },
    // 返回会员中心
    userinfo () {
      this.$router.push({name: 'userInfo'})
    },
    // 返回评价列表
    addComment () {
      this.$router.push({name: 'commentList'})
    },
    // 设置查询开始时间
    setStartdate () {
      this.$emit('setStartdate', this.startdate)
    },
    // 去添加投诉建议
    addComplaint () {
      this.$router.push({name: 'addComplaint'})
    }
  },
  created () {
    // alert(JSON.stringify(window.history))
  }
}
</script>

<style scoped>
@import "static/css/myheader.css";
.wechatConfig {
  display: none;
}
</style>
