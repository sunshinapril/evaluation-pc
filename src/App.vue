<script setup>
import { nextTick } from "vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { useRouter, useRoute } from "vue-router";
import useUser from "@/store/modules/user";
const locale = zhCn;

const router = useRouter();
const route = useRoute();

const handleMessage = (event) => {
  const data = event;
  if (data.data.token) {
    window.parent.postMessage("准备跳转", "*");
    useUser()
      .LoginSys(data.data)
      .then(() => {
        router.push("/leadgen/channelCode");
      })
      .catch(() => {
        loading.value = false;
      });
  }
};

nextTick(() => {
  console.log(1111);
  window.addEventListener("message", handleMessage);
});
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<style scoped lang="less"></style>
