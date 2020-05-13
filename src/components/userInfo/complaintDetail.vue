<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>投诉详情</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff">
      <!-- 评论区 start -->
      <div class="tick_list">
        <div class="comment_desc tc color666666 font32">{{complaintDetail.addtime}}</div>
        <div class="">{{complaintDetail.content}}</div>
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
      </div>
      <!-- 评论区 end -->
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'

export default {
  name: 'complaintDetail',
  data () {
    return {
      // 投诉建议详情
      complaintDetail: '',
      // 投诉id
      id: this.$route.params.id
    }
  },
  computed: {},
  components: {
    MyHeader
  },
  methods: {
    // 获取评价详情
    getComplaintDetail () {
      let data = new FormData()
      let requestData = {
        id: this.id
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/suggestion/listSuggestionDtl', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.complaintDetail = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(error => {
        throw error
      })
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    // 页面加载时获取评价详情
    this.getComplaintDetail()
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
