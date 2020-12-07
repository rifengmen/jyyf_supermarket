<template>
  <div class="address_main bgffffff">
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff" v-if="addressFlag">
      <div class="addresslist">
        <!-- 加载中动画 start -->
        <loading v-if="isShowLoading"></loading>
        <!-- 下拉刷新动画 end -->
        <!-- 地址列表 start -->
        <div class="address_cont border_r6">
          <div class="address_list" v-if="addressList.length">
            <ul>
              <li class="address_item" @click="editorder(item)" v-for="(item, index) in addressList" :key="index">
                <div class="address_item_desc">
                  <div class="address_item_user font_blod ellipsis">
                    <div>{{item.contactPerson}}</div>
                    <div>{{item.contactNumber}}</div>
                    <div class="address_item_age bgffae43 colorffffff tc border_r4 font22 font_normal" v-if="item.addressMark !== '1'">店铺</div>
                  </div>
                  <div class="address_item_address ellipsis color666666">
                    <div class="font24">{{item.areaname}}</div>
                    <div class="font24">{{item.sheetname}}</div>
                    <div class="font24">{{item.address}}</div>
                  </div>
                </div>
                <div class="address_item_img" v-if="item.addressMark === '1'" @click="delAddress(item.addressid)">
                  <img src="static/img/delete.png">
                </div>
              </li>
            </ul>
          </div>
          <!-- 无信息提示 start -->
          <nodata v-else class=""></nodata>
          <!-- 无信息提示 end -->
        </div>
        <!-- 地址列表 end -->
      </div>
      <!-- 添加按钮地址 start -->
      <div class="address_btn bgffffff">
        <div class="send_btn tc bgff7e42 colorffffff font32 border_r4" @click="editAddress">新建地址</div>
      </div>
      <!-- 添加按钮地址 end -->
    </div>
    <!-- 内容部分盒子 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff" v-else>
      <!-- 新建地址 start -->
      <div class="userinfo_password border_r6">
        <!-- 收货人 start -->
        <div class="section font28 color333333">
          <div class="section_tit">
            <span>收货人</span>
          </div>
          <div class="section_input">
            <div class="section_inputall border_r6">
              <input type="text" name="contactPerson" v-model="contactPerson" placeholder="请输入收货人">
            </div>
          </div>
        </div>
        <!-- 收货人 end -->
        <!-- 手机号 start -->
        <div class="section font28 color333333">
          <div class="section_tit">
            <span>手机号</span>
          </div>
          <div class="section_input">
            <div class="section_inputall border_r6">
              <input type="text" name="contactNumber" v-model="contactNumber" placeholder="请输入手机号">
            </div>
          </div>
        </div>
        <!-- 手机号 end -->
        <!-- 所在地区 start -->
        <div class="section font28 color333333">
          <div class="section_tit">
            <span>所在地区</span>
          </div>
          <div class="section_input">
            <div class="section_inputall border_r6">
              <el-select v-model="areaid" placeholder="请选择片" @change="getSheetList" value-key="value">
                <el-option
                  v-for="(item, index) in areaList"
                  :key="index"
                  :label="item.areaname"
                  :value="item.areaid">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="section font28 color333333">
          <div class="section_tit"></div>
          <div class="section_input">
            <div class="section_inputall border_r6">
              <el-select v-model="sheetid">
                <el-option
                  v-for="(item, index) in sheetList"
                  :key="index"
                  :label="item.sheetname"
                  :value="item.sheetid">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <!-- 所在地区 end -->
        <!-- 片区范围描述 start -->
        <div class="section areaDesc font28 color333333" v-if="sheetid">
          <div class="section_tit">
          </div>
          <div class="section_input colorf84242 font24">片区范围描述：{{areaDesc}}</div>
        </div>
        <!-- 片区范围描述 end -->
        <!-- 详细地址 start -->
        <div class="section font28 color333333">
          <div class="section_tit">
            <span>详细地址</span>
          </div>
          <div class="section_input">
            <div class="section_inputall border_r6">
              <input type="text" name="address" v-model="address" placeholder="请输入详细地址">
            </div>
          </div>
        </div>
        <!-- 详细地址 end -->
        <!-- 按钮部分 start -->
        <div class="btn_box section">
          <!-- 保存按钮 start -->
          <div class="send_btn register_btn borderff7e42 border_r6 bgff7e42 colorffffff font32 font_normal" @click="addaddress">保存</div>
          <!-- 保存按钮 end -->
        </div>
        <!-- 按钮部分 end -->
      </div>
      <!-- 新建地址 end -->
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import nodata from '@/components/common/nodata/nodata'
import loading from '@/components/common/loading/loading'
import tip from '@/utils/Toast'

export default {
  name: 'addressList',
  props: {
    // froms,调用的父组件
    froms: {
      type: String,
      default: function () {
        return ''
      }
    },
    // 订单总额 来自填写订单
    Totalmoney: {
      type: Number,
      default: function () {
        return 0
      }
    },
    // froms,调用的父组件
    goodsid: {
      type: String,
      default: function () {
        return ''
      }
    },
    // froms,调用的父组件
    otc: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
      // 列表页显示开关
      addressFlag: true,
      // 地址列表
      addressList: {},
      // 片列表
      areaList: [],
      // 片
      area: '',
      // 片id
      areaid: '',
      // 区列表
      sheetList: [],
      // 区
      sheet: '',
      // 区id
      sheetid: '',
      // 详细地址
      address: '',
      // 收货人
      contactPerson: '',
      // 收货人电话
      contactNumber: '',
      // 加载中动画
      isShowLoading: true,
      // 订单类型(用于预售商品只能选择自提地址)
      orderType: this.$route.query.orderType || 0
    }
  },
  computed: {
    // 验证手机号码格式是否正确
    flag () {
      let self = this
      if (self.contactNumber && /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/.test(self.contactNumber)) {
        return true
      }
      return false
    },
    // 区范围介绍
    areaDesc () {
      let self = this
      if (self.sheetList.length) {
        let _arr
        _arr = self.sheetList.filter(item => item.sheetid === self.sheetid)
        return _arr[0].areaDesc
      }
    }
  },
  components: {
    MyHeader,
    nodata,
    loading
  },
  methods: {
    // 获取地址列表
    getAddresslist () {
      let self = this
      self.isShowLoading = true
      let data = {
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.getAddressForOrder(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.isShowLoading = false
          if (self.froms === 'editorder') {
            if (self.orderType === 5) {
              self.addressList = res.data.filter(item => item.addressMark !== '1')
              return
            }
            self.addressList = res.data
          } else {
            self.addressList = res.data.filter(item => item.addressMark === '1')
          }
        } else {
          tip(res.msg)
        }
      })
    },
    // 删除地址
    delAddress (addressid) {
      let self = this
      let data = {
        addressid: addressid
      }
      self.$dialog.confirm({
        message: '确认删除地址吗？'
      }).then(() => {
        self.$api.api.deleteAddress(data).then(result => {
          let res = result.data
          if (res.code === 200) {
            tip('删除成功!')
            self.addressList = self.addressList.filter(item => item.addressid !== addressid)
          } else {
            tip(res.msg)
          }
        })
      }).catch(() => {
        tip('操作已取消')
      })
    },
    // 新建地址
    editAddress () {
      let self = this
      window.event.stopPropagation()
      self.addressFlag = false
    },
    // 请求片列表
    getAreaList () {
      let self = this
      let data = {}
      self.$api.api.getArea(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.areaList = res.data
        } else {
          tip(res.msg)
        }
      })
    },
    // 请求区列表
    getSheetList () {
      let self = this
      self.sheetList = []
      self.sheetid = ''
      if (self.areaid) {
        let data = {
          areaid: self.areaid.toString()
        }
        self.$api.api.getFlat(data).then(result => {
          let res = result.data
          if (res.code === 200) {
            self.sheetList = res.data
          } else {
            tip(res.msg)
          }
        })
      }
    },
    // 保存地址
    addaddress () {
      let self = this
      if (self.contactPerson === '') {
        tip('请输入收货人！')
        return false
      }
      if (self.contactNumber === '') {
        tip('请输入手机号！')
        return false
      }
      if (!self.flag) {
        tip('手机号码格式有误，请重新输入！')
        return false
      }
      if (self.areaid === '') {
        tip('请选择片！')
        return false
      }
      if (self.sheetid === '') {
        tip('请选择区！')
        return false
      }
      if (self.address === '') {
        tip('请输入详细地址！')
        return false
      }
      let data = {
        areaid: self.areaid,
        sheetid: self.sheetid,
        address: self.address,
        contactPerson: self.contactPerson,
        contactNumber: self.contactNumber
      }
      self.$api.api.addAddress(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          tip('添加成功！')
          // 获取地址列表
          self.getAddresslist()
          self.addressFlag = true
          // 判断是否去填写订单
          if (self.froms === 'editorder') {
            // 去填写订单
            self.editorder(res.data)
          }
        } else {
          tip({
            message: res.msg,
            type: 'fail'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 去填写订单
    editorder (address) {
      let self = this
      let data = {
        address: address,
        totalmoney: self.Totalmoney,
        goodsid: self.$route.query.goodsid,
        otc: self.$route.query.otc,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.invest.getFreight(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.$store.commit('setAddress', address)
          self.$store.commit('setFreightmoney', res.data)
          self.$emit('setAddressListFlag')
        } else {
          tip(res.msg)
        }
      })
    }
  },
  watch: {
    areaList: {
      handler () {},
      deep: true
    },
    sheetList: {
      handler () {},
      deep: true
    }
  },
  beforeCreate () {
  },
  created () {
    let self = this
    // 获取地址列表
    self.getAddresslist()
    // 页面加载时请求片
    self.getAreaList()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/addressList.css";
.addresslist {
  position: relative;
}
</style>
