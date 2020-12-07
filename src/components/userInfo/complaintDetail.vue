<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header v-if="evaluateflag">建议详情</template>
      <template v-slot:header v-else>投诉详情</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff">
      <div class="userinfo_cont">
        <!-- 评论区 start -->
        <div class="tick_list">
          <div class="comment_desc tc color666666 font32">{{complaintDetail.addtime}}</div>
          <div class="comment_content">{{complaintDetail.content}}</div>
          <!--<div class="comment_img">-->
          <!--<el-upload-->
          <!--action=""-->
          <!--multiple-->
          <!--list-type="picture-card"-->
          <!--:on-preview="handlePictureCardPreview"-->
          <!--:on-remove="handleRemove">-->
          <!--<i class="el-icon-plus"></i>-->
          <!--</el-upload>-->
          <!--<el-dialog :visible.sync="dialogVisible">-->
          <!--<img width="100%" :src="dialogImageUrl" alt="">-->
          <!--</el-dialog>-->
          <!--</div>-->
          <div class="colorf58d37 font32" style="margin-top: 40px">回复信息</div>
          <div class="comment_desc tc color666666 font32" v-if="complaintDetail.retime">{{complaintDetail.retime}}</div>
          <div class="comment_content" v-if="complaintDetail.reContent">{{complaintDetail.reContent}}</div>
          <div class="comment_desc tc color666666 font32" v-else >暂无回复信息</div>
        </div>
        <!-- 评论区 end -->
      </div>
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import tip from '@/utils/Toast'

export default {
  name: 'complaintDetail',
  data () {
    return {
      // 投诉建议详情
      complaintDetail: '',
      // 投诉id
      id: this.$route.query.id,
      // 标识业务
      evaluateflag: parseFloat(this.$route.query.evaluateflag)
    }
  },
  computed: {},
  components: {
    MyHeader
  },
  methods: {
    // 获取投诉建议详情
    getComplaintDetail () {
      let self = this
      let data = {
        id: self.id
      }
      self.$api.system.listSuggestionDtl(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.complaintDetail = res.data
        } else {
          tip(res.msg)
        }
      })
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    let self = this
    // 页面加载时获取评价详情
    self.getComplaintDetail()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/userInfo.css";
</style>
