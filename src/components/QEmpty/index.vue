<template>
  <div class="empty-container">
    <img class="img" :src="emptyUrl" alt="" />
    <div class="label">{{ label || '暂无数据' }}</div>
  </div>
</template>

<script setup>
  import emptyUrl from '@/assets/images/common/empty.png';

  defineProps({
    label: {
      type: String,
    },
  });
</script>

<style lang="less" scoped>
  .empty-container {
    padding: 7px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .img {
      width: 200px;
      height: 110px;
    }
    .label {
      margin-top: 3px;
      font-size: 14px;
      line-height: 22px;
      color: #ACABCA;
    }
  }
</style>
