<template>
  <div class="query-item">
    <div class="label">{{ label }}</div>
    <slot />
  </div>
</template>
<script setup>
const props = defineProps({
  label: {
    type: String,
  }
});
</script>

<style lang="less" scoped>
.query-item {
  display: inline-flex;
  align-items: center;
  margin-right: 40px;
  .label {
    flex-shrink: 0;
    margin-right: 10px;
    font-size: 14px;
    font-weight: 400;
    color: #111316;
    line-height: 20px;
  }
  :deep(.el-input, .el-select){
    width: 250px;
  }
}
</style>