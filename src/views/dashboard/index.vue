<template>
  <div class="dashboard-container">
    <q-pure-table
      :columns="columns"
      :dataList="dataList"
      :total="total"
      title="用户管理"
      @refresh="onSearch"
      @pagination-change="paginationChange"
    >
      <template #buttons>
        <el-button size="small" type="primary">新建</el-button>
      </template>
    </q-pure-table>
  </div>
</template>
<script setup>
import { ref, h } from "vue";
import moment from "moment";
import { ElButton } from "element-plus";
const columns = ref([
  {
    label: "序号",
    prop: "id",
    minWidth: 100,
    hide: false,
  },
  {
    label: "角色名称",
    prop: "name",
    minWidth: 120,
    hide: false,
  },
  {
    label: "角色标识",
    prop: "code",
    minWidth: 150,
    hide: false,
  },
  {
    label: "更新时间",
    prop: "updateTime",
    minWidth: 150,
    hide: false,
    formatter: ({ updateTime }) =>
      moment(updateTime).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    label: "操作",
    prop: "operator",
    minWidth: 150,
    hide: false,
    fixed: "right",
    cellRenderer: ({ row, props }) =>
      h(
        ElButton,
        {
          size: "small",
          type: "primary",
          onClick: () => handleEdit(row, props),
        },
        { default: () => "编辑" }
      ),
  },
]);
const dataList = ref([
  {
    id: 1,
    name: "xiaoming",
    code: "前端",
    updateTime: "2024-12-05 12:12:10",
  },
  {
    id: 2,
    name: "xiaoming",
    code: "前端",
    updateTime: "2024-12-05 12:12:10",
  },
  {
    id: 3,
    name: "xiaoming",
    code: "前端",
    updateTime: "2024-12-05 12:12:10",
  },
  {
    id: 1,
    name: "xiaoming",
    code: "前端",
    updateTime: "2024-12-05 12:12:10",
  },
  {
    id: 1,
    name: "xiaoming",
    code: "前端",
    updateTime: "2024-12-05 12:12:10",
  },
  {
    id: 1,
    name: "xiaoming",
    code: "前端",
    updateTime: "2024-12-05 12:12:10",
  },
  {
    id: 1,
    name: "xiaoming",
    code: "前端",
    updateTime: "2024-12-05 12:12:10",
  },
  {
    id: 1,
    name: "xiaoming",
    code: "前端",
    updateTime: "2024-12-05 12:12:10",
  },
  {
    id: 1,
    name: "xiaoming",
    code: "前端",
    updateTime: "2024-12-05 12:12:10",
  },
  {
    id: 1,
    name: "xiaoming",
    code: "前端",
    updateTime: "2024-12-05 12:12:10",
  },
  {
    id: 1,
    name: "xiaoming",
    code: "前端",
    updateTime: "2024-12-05 12:12:10",
  },
]);

const total = ref(100);

const paginationChange = (data) => {
  console.log(data, "paginationChange333333");
};
const onSearch = () => {
  console.log("search");
};

const handleEdit = (row, props) => {
  console.log(row, props);
};
</script>
<style lang="less" scoped>
.dashboard-container {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .box {
    width: 100%;
    height: 100px;
    background: #ff5658;
    margin: 20px;
    position: sticky;
  }
}
</style>
