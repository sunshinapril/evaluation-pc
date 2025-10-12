<template>
<div class="table-container">
  <el-table 
    ref="tableRef" 
    class="base-table"
    :data="list"
    v-loading="loading"
    v-bind="{ ...$attrs }"
    fit
    highlight-current-row
    :header-cell-style="headerCellStyle"
  >
    <template #empty>
      <q-empty />
    </template>
    <slot />
    <template v-for="slot in slotKeys" v-slot:[slot]="data">
      <slot :name="slot" v-bind="data" />
    </template>
  </el-table>
  <q-pagination
      v-if="showPagination"
      class="pagination-box"
      :options="pagination"
      :layout="layout"
      @pagination-change="paginationChange"
    />
</div>
</template>
<script setup>
import { reactive, useSlots, ref, watch, computed } from 'vue';
const slots = useSlots();
const slotKeys = Object.keys(slots || {});

const props = defineProps({
  query: null,
  pageSize: 10,
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100]
  }
});
const headerCellStyle = () => {
  return {
    background: '#f5f7fa',
    color: '#111316',
    fontSize: '14px',
    fontWeight: 600
  }
}
const tableRef = ref();
const list = ref([]);
const pagination = reactive({
  pageSizes: props.pageSizes,
  total: 0,
  pageSize: props.pageSize || 20,
  pageNo: 1,
})
const showPagination = computed(() => {
  return pagination.total || props.query;
});
const loading = ref(false);
const getData = () => {
  if (!props.query) {
    return;
  }
  loading.value = true;
  props
    .query(pagination.pageNo, pagination.pageSize)
    .then(newData => {
      list.value = newData.data;
      pagination.total = newData.total;
    })
    .catch(err => {
      console.log(err, "err");
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false;
      }, 500)
    });
};

watch(
  () => props.query,
  () => {
    pagination.pageNo = 1;
    list.value = [];
    getData();
  },
  {
    immediate: true
  }
);

const paginationChange = (data) => {
  pagination.pageSize = data.pageSize;
  pagination.pageNo = data.pageNo;
  getData();
};
defineExpose({
  tableRef
});
</script>
<style lang="less" scoped>
.table-container {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .base-table {
    :deep(tr) {
      &:hover {
        .el-icon-edit {
          display: block;
          cursor: pointer;
        }
      }
    }
  }
  .pagination-box {
    flex-shrink: 0;
    text-align: right;
    padding: 15px 0;
  }
}
</style>
