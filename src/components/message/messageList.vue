<template>
    <div class="container_pt110 bgeeeeee" v-title :data-title="$store.state.userInfo.deptname">
      <!-- 头部 start -->
      <my-header>
        <template v-slot:backs>
          <i class="el-icon-arrow-left"></i>
        </template>
        <template v-slot:header>消息中心</template>
      </my-header>
      <!-- 头部 end -->
      <!-- 内容部分盒子 start -->
      <div class="cont_main bgffffff">
        <!-- 加载中动画 start -->
        <loading v-if="isShowLoading"></loading>
        <!-- 加载中动画 end -->
        <!-- 分类列表 start -->
        <div class="message_list" v-if="messageList.length">
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              :offset="offset"
              finished-text="没有更多了"
              @load="onLoad">
              <div v-for="(item, index) in messageList" :key="index">
                <div @click="toMessagedetail(item.id)" class="message_item bgffffff">
                  <div class="message_tab bgffae43 border_r500" v-if="!item.flag"></div>
                  <div class="message_title ellipsis">{{item.title}}</div>
                  <div class="font22 color999999">{{item.addtime}}</div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
        <!-- 分类列表 end -->
        <!-- 无信息提示 start -->
        <nodata v-else class="bgeeeeee"></nodata>
        <!-- 无信息提示 end -->
      </div>
      <!-- 内容部分盒子 end -->
    </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import loading from '@/components/common/loading/loading'
import nodata from '@/components/common/nodata/nodata'
import tip from '@/utils/tip'

export default {
  name: 'messageList',
  data () {
    return {
      // 是否处在加载状态
      loading: false,
      // 是否已加载完成
      finished: false,
      // 下拉刷新
      refreshing: false,
      // 滚动条与底部距离小于 offset 时触发load事件
      offset: 100,
      // 消息列表
      messageList: [],
      // 当前页码
      page: 0,
      // 每页显示条数
      pageSize: 15,
      // 目前总共多少条
      totalSize: '',
      // 目前总共多少页
      totalPages: '',
      // 加载中动画
      isShowLoading: true
    }
  },
  computed: {
  },
  components: {
    MyHeader,
    loading,
    nodata
  },
  methods: {
    onLoad () {
      let self = this
      self.page++
      self.getMessageList()
    },
    onRefresh () {
      let self = this
      self.isShowLoading = true
      // 清空列表数据
      self.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      self.loading = true
      self.page = 0
      self.messageList = []
      self.onLoad()
    },
    // 获取消息列表公共方法
    getMessageList () {
      let self = this
      let data = {
        messageFlag: '1',
        page: self.page,
        pageSize: self.pageSize
      }
      self.$api.info.listmessage(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.isShowLoading = false
          // 无数据时
          if (!res.data.totalSize) {
            self.finished = true
          }
          if (res.data.content && res.data.content.length) {
            let currentpage = self.page
            let total = Math.ceil(res.data.totalSize / self.pageSize)
            // 页码不足或者最后一页不足的情况
            if (currentpage >= total || res.data.content.length < self.pageSize) {
              self.finished = true
            }
            // 刷新
            if (self.refreshing) {
              self.messageList = res.data.content
              self.refreshing = false
            } else {
              self.messageList.push(...res.data.content)
            }
            self.loading = false
          }
        } else {
          tip(res.msg)
        }
      })
    },
    // 去详情页
    toMessagedetail (id) {
      let self = this
      self.messageList.forEach((val, index) => {
        if (val.id === id) {
          val.flag = 1
        }
      })
      self.$router.push({name: 'messagedetail', query: {id: id}})
    }
  },
  watch: {},
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('removeExcludeComponent', 'messageList')
      next()
    })
  },
  beforeRouteLeave (to, from, next) {
    let self = this
    let reg = /messagedetail/
    if (reg.test(to.name)) {
      self.$store.commit('removeExcludeComponent', 'messageList')
    } else {
      self.$store.commit('addExcludeComponent', 'messageList')
    }
    next()
  },
  beforeCreate () {},
  created () {
    let self = this
    self.onLoad()
  },
  beforeMount () {},
  mounted () {}
}
</script>

<style scoped>
@import "static/css/message.css";
.nodata {
  height: calc(100vh - 1.1rem);
}
</style>
