<!--
 * @Author: coco
 * @Date: 2020-04-10 23:50:37
 * @LastEditTime: 2020-04-11 00:13:26
 * @LastEditors: coco
 * @Description: 
 * @FilePath: /vue_shop/src/components/home/Home.vue
 * @https://github.com/android-coco
 -->

<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {}
  },
  watch: {},
  computed: {},
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="less" scoped>
</style>