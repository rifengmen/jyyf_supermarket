<template>
  <div class="footer bgffffff">
    <div class="footer-main">
      <!-- 首页 start -->
      <router-link :to="{name:'index'}" tag="div" class="footer_shops footer_nav tc">
        <div class="bgimg"></div>
        <!--<img src="static/img/index.png">-->
        <div class="listname font24 color666">首页</div>
      </router-link>
      <!-- 首页 end -->
      <!-- 分类 start -->
      <router-link :to="{name:'category'}" tag="div" class="footer_class footer_nav tc">
        <div class="bgimg"></div>
        <!--<img src="static/img/supplier.png">-->
        <div class="listname font24 color666">分类</div>
      </router-link>
      <!-- 分类 end -->
      <!-- 电子码 start -->
      <router-link :to="{name:'mycode'}" tag="div" class="footer_message footer_nav tc">
        <!--<div class="bgimg"></div>-->
        <img src="static/img/code.png">
        <!--<div class="listname font24 color666">电子码</div>-->
      </router-link>
      <!-- 电子码 end -->
      <!-- 购物车 start -->
      <router-link :to="{name:'cart'}" tag="div" class="footer_cart footer_nav tc">
        <div class="bgimg"></div>
        <!--<img src="static/img/supplier.png">-->
        <div class="listname font24 color666">购物车</div>
      </router-link>
      <!-- 购物车 end -->
      <!-- 我的 start -->
      <router-link :to="{name:'userInfo'}" tag="div" class="footer_userinfo footer_nav tc">
        <div class="bgimg"></div>
        <!--<img src="static/img/userinfo.png">-->
        <div class="listname font24 color666">我的</div>
      </router-link>
      <!-- 我的 end -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'my-footer'
}
</script>

<style scoped>
  @import "static/css/myfooter.css";

</style>
