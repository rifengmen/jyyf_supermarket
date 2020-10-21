<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header v-if="evaluateflag === 1">填写建议</template>
      <template v-slot:header v-else>填写投诉</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff">
      <!-- 评论区 start -->
      <div class="comment_cont">
        <div class="comment_desc comment_section borderc7c7c7">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入内容, 最多140个字符"
            max-length="140"
            v-model="complaint">
          </el-input>
        </div>
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
        <!-- 按钮部分 start -->
        <div class="btn_box scan_section">
          <!-- 确认按钮 start -->
          <div class="send_btn border_r6 borderff7e42 bgff7e42 colorffffff font32 font_normal" @click="sendComplaint">确认</div>
          <!-- 确认按钮 end -->
        </div>
        <!-- 按钮部分 end -->
      </div>
      <!-- 评论区 end -->
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'

export default {
  name: 'addComplaint',
  data () {
    return {
      // 投诉标识
      evaluateflag: this.$route.query.evaluateflag,
      // 评价内容
      complaint: '',
      // 评价图片
      complaintimg: '',
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {},
  components: {
    MyHeader
  },
  methods: {
    // 发送投诉内容
    sendComplaint () {
      if (!this.complaint) {
        this.$toast({
          message: '内容不能为空！',
          type: 'fail'
        })
        return false
      }
      if (this.complaint.length > 140) {
        this.$toast({
          message: '已超过140个字符！',
          type: 'fail'
        })
        return false
      }
      let data = new FormData()
      let requestData = {
        Content: this.complaint,
        flag: this.evaluateflag
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/suggestion/addSuggestion', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$toast({
            message: '提交成功!',
            type: 'success'
          })
          this.$router.back()
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
    // 删除照片
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    // 查看放大图
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
  }
}
</script>

<style scoped>
  @import "static/css/userInfo.css";
</style>
