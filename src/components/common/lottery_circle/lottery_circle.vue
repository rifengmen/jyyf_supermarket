<template>
  <div id="turnBox">
    <div id="turnUlBox">
      <ul id="turnUl" class="border_r500">
        <li
          v-for="(item,index) in prizeData"
          :key="index"
          :style="{webkitTransform: 'rotate(' + -item.angle + 'deg) skewY(' + item.skew + 'deg)', backgroundColor: bgcolor[index%4]}">
        </li>
      </ul>
      <ul id="turnUltext" class="border_r500">
        <li
          v-for="(item,index) in prizeData"
          :key="index"
          :style="{webkitTransform: 'rotate(' + -item.angletext + 'deg)'}"
          class="colore52b39">
          <div v-html="autoWrap(item.prizename)"></div>
        </li>
      </ul>
    </div>
    <img src="static/img/turntablebtn.png" @click="startPlay" class="turnBtn">
  </div>
</template>

<script>
export default {
  name: 'lottery_circle',
  props: {
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
      // 圆盘各奖项背景色
      bgcolor: ['#f9cd56', '#ffffff', '#fee8ad', '#ffffff'],
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
      let arr = this.activeObj.prizeList
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
      if (this.flag) {
        if (this.totalCent < this.activeObj.prizeUseCent) {
          this.$toast({
            message: '积分不足!',
            type: 'fail'
          })
          return false
        }
        this.flag = false
        let data = new FormData()
        let requestData = {
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.$axios.post('system/prize/centPrize', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            this.prize = res.data
            // 更新积分
            this.$emit('getTotalCent')
            // 调抽奖
            this.startBtn(this.prize)
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
    // 开始转动,通过奖项级别进行匹配:id
    async startBtn (val) {
      let _this = this
      _this.activeObj.prizeList.forEach((i, d) => {
        if (i.prizeno === val.prizeno) {
          _this.pIndex = d
        }
      })
      // 拿到相应的角度调旋转接口
      _this.startrotate(_this.activeObj.prizeList[_this.pIndex].angletext, () => {
        _this.fulfillHandle(_this.activeObj.prizeList[_this.pIndex])
      })
    },
    // 开始旋转 angle角度  complete回调成功函数
    startrotate (angle, complete) {
      // 相应的角度 + 满圈 只是在原角度多转了几圈 360 * 6
      let rotate = 2160 * (this.rotNum + 1) + angle
      this.oTurntable.style.transform = 'rotate(' + rotate + 'deg)'
      this.oTurntabletext.style.transform = 'rotate(' + rotate + 'deg)'
      clearTimeout(this.timer)
      // 设置5秒后停止旋转,处理接口返回的数据
      this.timer = setTimeout(() => {
        complete()
        this.rotNum++
      }, this.time)
    },
    // 得奖后的处理
    fulfillHandle (prize) {
      this.$emit('getResult', prize)
      this.flag = true
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
    this.oTurntable = document.querySelector('#turnUl')
    this.oTurntabletext = document.querySelector('#turnUltext')
    // 过度中属性用时5s
    this.oTurntable.style.webkitTransition = 'transform ' + this.time / 1000 + 's ease'
    this.oTurntabletext.style.webkitTransition = 'transform ' + this.time / 1000 + 's ease'
  }
}
</script>

<style scoped>
</style>
