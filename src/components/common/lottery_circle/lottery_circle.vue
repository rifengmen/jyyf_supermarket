<template>
  <div id="turnBox">
    <!-- 自定义抽奖图 start -->
    <div class="turnUlBox border_r500" v-if="isturnbg">
      <div class="turnUlbg border_r500" :style="{backgroundImage: 'url(' + IMGURL + 'image/' + turnUrl + ')'}"></div>
      <ul class="turnUltext border_r500">
        <li
          v-for="(item,index) in prizeData"
          :key="index"
          :style="{webkitTransform: 'rotate(' + -item.angletext + 'deg)'}"
          class="colorffffff">
          <div class="prizename font24">{{item.prizename}}</div>
          <img :src="item.prize_bgurl ? (IMGURL + 'image/' + item.prize_bgurl) : './static/img/thank.png'" v-if="item.prizetype === -1">
          <img :src="IMGURL + 'image/' + item.prize_bgurl" v-else>
        </li>
      </ul>
    </div>
    <!-- 自定义抽奖图 end -->
    <!-- 默认抽奖图 start -->
    <div class="turnUlBox border_r500" v-else>
      <div class="turnUlbg border_r500"></div>
      <ul class="turnUlborder border_r500">
        <li
          v-for="(item,index) in prizeData"
          :key="index"
          :style="{webkitTransform: 'rotate(' + -item.angle + 'deg)'}"
          class="borderffffff">
        </li>
      </ul>
      <ul class="turnUltext turnUltext2 border_r500">
        <li
          v-for="(item,index) in prizeData"
          :key="index"
          :style="{webkitTransform: 'rotate(' + -item.angletext + 'deg)'}"
          class="colorffffff font26">
          <div class="prizename">{{item.prizename}}</div>
        </li>
      </ul>
    </div>
    <!-- 默认抽奖图 end -->
    <!-- 抽奖按钮 start -->
    <img :src="IMGURL + 'image/' + btnUrl" @click="startPlay" class="turnBtn" v-if="isturnbg">
    <img src="static/img/lotteryStart.png" @click="startPlay" class="turnBtn" v-else>
    <!-- 抽奖按钮 end -->
  </div>
</template>

<script>
import tip from '@/utils/Toast'

export default {
  name: 'lottery_circle',
  props: {
    // 自定义抽奖图开关
    isturnbg: {
      type: Number,
      default: function () {
        return 0
      }
    },
    // 转盘图路径
    turnUrl: {
      type: String,
      default: function () {
        return ''
      }
    },
    // 抽奖按钮图路径
    btnUrl: {
      type: String,
      default: function () {
        return ''
      }
    },
    // 奖项设置
    activeObj: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 用户积分
    totalCent: {
      type: Number,
      default: function () {
        return 0
      }
    }
  },
  data () {
    return {
      // 图片路径
      IMGURL: this.IMGURL,
      // 中奖物品的下标
      pIndex: 0,
      // 旋转圈数基数
      rotNum: 0,
      // 旋转时间
      time: 5000,
      // 定时器
      timer: null,
      // 旋转圆盘背景图
      oTurntable: '',
      // 0 图片 1 汉字
      type: 0,
      // 抽奖开关，防止重复点击
      flag: true,
      // 中奖信息
      prize: {
        // prizeno: 80
      }
    }
  },
  computed: {
    // 自动生成角度添加到数组上
    prizeData () {
      let self = this
      let arr = self.activeObj.prizeList
      if (arr && arr.length) {
        let len = arr.length
        let base = 360 / len
        arr.forEach((item, index) => {
          // 指的是某个奖品区域的中间 : base/2
          item.angle = 360 - (base + index * base)
          item.angletext = 360 - (base / 2 + (index + 1) * base)
          item.skew = -(90 - base)
        })
      }
      return arr
    }
  },
  components: {},
  methods: {
    // 点击开始,请求接口抽奖
    startPlay () {
      let self = this
      if (self.flag && self.activeObj.prizeList.length) {
        self.flag = false
        let data = {}
        self.$api.system.centPrize(data).then(result => {
          let res = result.data
          if (res.code === 200) {
            self.prize = res.data
            // 调抽奖
            self.startBtn(self.prize)
          } else {
            self.flag = true
            tip(res.msg)
          }
        })
      }
    },
    // 开始转动,通过奖项级别进行匹配:id
    async startBtn (val) {
      let self = this
      self.activeObj.prizeList.forEach((i, d) => {
        if (i.prizeno === val.prizeno) {
          self.pIndex = d
        }
      })
      // 拿到相应的角度调旋转接口
      self.startrotate(self.activeObj.prizeList[self.pIndex].angletext, () => {
        self.fulfillHandle(self.activeObj.prizeList[self.pIndex])
      })
    },
    // 开始旋转 angle角度  complete回调成功函数
    startrotate (angle, complete) {
      let self = this
      // 相应的角度 + 满圈 只是在原角度多转了几圈 360 * 6
      let rotate = 2160 * (self.rotNum + 1) + angle
      self.oTurnUlbg.style.transform = 'rotate(' + rotate + 'deg)'
      self.oTurnUlborder.style.transform = 'rotate(' + rotate + 'deg)'
      self.oTurnUltext.style.transform = 'rotate(' + rotate + 'deg)'
      clearTimeout(self.timer)
      // 设置5秒后停止旋转,处理接口返回的数据
      self.timer = setTimeout(() => {
        complete()
        self.rotNum++
      }, self.time)
    },
    // 得奖后的处理
    fulfillHandle (prize) {
      let self = this
      self.$emit('getResult', prize)
      self.flag = true
    },
    // 自动换行
    autoWrap (str) {
      if (str.length > 5 && str.length <= 10) {
        str = str.substring(0, 5) + '<br/>' + str.substring(5, str.length)
      } else if (str.length > 10) {
        str = str.substring(0, 5) + '<br/>' + str.substring(5, 9) + '...'
      }
      return str
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
    let self = this
    self.oTurnUlbg = document.querySelector('.turnUlbg')
    self.oTurnUlborder = document.querySelector('.turnUlborder')
    self.oTurnUltext = document.querySelector('.turnUltext')
    // 过度中属性用时5s
    self.oTurnUlbg.style.webkitTransition = 'transform ' + self.time / 1000 + 's ease'
    self.oTurnUlborder.style.webkitTransition = 'transform ' + self.time / 1000 + 's ease'
    self.oTurnUltext.style.webkitTransition = 'transform ' + self.time / 1000 + 's ease'
  }
}
</script>

<style scoped>
</style>
