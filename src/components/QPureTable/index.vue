<template>
  <RePureTable :columns="columns" :title="title">
      <template v-if="slots?.title" #title>
          <slot name="title" />
        </template>
      <template #buttons>
        <slot name="buttons"/>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table 
          v-bind="{ ...$attrs }"
          :columns="dynamicColumns"
          :data="dataList"
          :size="size"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
        <template v-for="slot in slotKeys" v-slot:[slot]="data">
          <slot :name="slot" v-bind="data" />
        </template>
        </pure-table>
      </template>
  </RePureTable>
</template>
<script setup>
import {ref, watch} from "vue";
import {cloneDeep} from 'lodash';
import RePureTable from './../RePureTable/index.vue';
const slots = defineSlots();
const slotKeys = Object.keys(slots || {});

const props = defineProps({
  title: String,
  columns: Array,
  dataList: Array,
  pagination: Object,
  total: Number,
});

const emits = defineEmits(['pagination-change']);


const pagination = ref(cloneDeep(props?.pagination) || {
    total: 0,
    pageSize: 20,
    pageSizes: [10, 20, 50, 100],
    currentPage: 1,
    background: true,
  });

watch(() => props.total, () => {
  pagination.value.total = props.total;
}, {
  immediate: true
});


const handleSizeChange = (val) => {
  pagination.value.pageSize = val;
  pagination.value.currentPage = 1;
  console.log(11111)
  emits('pagination-change', pagination.value);
};

const handleCurrentChange = (val) => {
  console.log(2222)
  pagination.value.currentPage = val;
  emits('pagination-change', pagination.value);
};



</script>