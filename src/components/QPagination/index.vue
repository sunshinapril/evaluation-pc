<template>
  <div class="pagination-wrapper">
    <el-pagination
      class="q-pagination"
      background
      :current-page.sync="options.pageNo"
      :page-sizes="options.pageSizes"
      :page-size="options.pageSize"
      :total="options.total"
      :layout="layout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

</template>
<script setup>
const emits = defineEmits(['pagination-change']);
const props = defineProps({
  options: {
    type: Object,
    required: false,
    default: function() {
      return {
        pageSizes: [10, 20, 50, 100],
        pageSize: 20,
        pageNo: 1,
        total: 0
      }
    }
  },
  layout: {
    type: String,
    default: 'total,sizes, prev, pager, next, sizes, jumper'
  }
});


const handleSizeChange = (val) => {
  props.options.pageSize = val;
  props.options.pageNo = 1;
  toParent();
};
const handleCurrentChange = (val) => {
  props.options.pageNo = val;
  toParent();
};
const toParent = () => {
  emits('pagination-change', props.options);
}
</script>
<style lang="less" scoped>
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
}

</style>
