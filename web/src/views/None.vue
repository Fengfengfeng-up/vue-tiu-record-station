<template>
  <div class="none bg-black text-center text-white d-flex flex-column jc-center ai-center">
    <p class="fs-xxl">我迷路了，快带我回家</p>
    <span class="to-home fs-lg py-3 px-3 mt-3" @click="$router.push('/')">点击我回家</span>
  </div>
</template>

<style lang="scss">
.none {
  width: 100vw;
  height: 100vh;

  .to-home {
    border: 1px solid #cc0000;
    border-radius: 10px;
  }
}
</style>