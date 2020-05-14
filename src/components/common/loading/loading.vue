<template>

  <div class="loading bgf7f7f7">
    <img src="static/img/loading.gif">
  </div>

</template>

<script>
export default {
  name: 'loading'
}
</script>

<style scoped>

  .loading {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 2rem;
    border-radius: 50%;
  }

</style>
