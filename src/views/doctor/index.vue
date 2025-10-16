<template>
  <div class="home-page">
    <el-form class="query-container" inline>
      <el-form-item props="date">
        <el-input
          class="query-input"
          v-model="queryParams.content"
          placeholder="请输入医生名称"
          :prefix-icon="Search"
        />
        <el-button style="margin-left: 12px" type="primary" @click="setQuery">
          <svg-icon name="search" style="margin-right: 6px;" />搜索</el-button>
        <el-button style="margin-left: 12px" type="primary" @click="handleAdd">
          <svg-icon name="plus" style="margin-right: 6px;" />新增</el-button>
        <el-button style="margin-left: 12px" type="success">
          <svg-icon name="download" style="margin-right: 6px;" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <q-table :query="query">
      <el-table-column prop="name" label="姓名" :show-overflow-tooltip="true" min-width="120"></el-table-column>
      <el-table-column prop="account" label="帐号" :show-overflow-tooltip="true" min-width="120"></el-table-column>
      <el-table-column prop="phone" label="联系电话" :show-overflow-tooltip="true" min-width="180"></el-table-column>
      <el-table-column prop="hospital" label="医院" :show-overflow-tooltip="true" min-width="100"></el-table-column>
      <el-table-column prop="level" label="级别" :show-overflow-tooltip="true" min-width="120"></el-table-column>
      <el-table-column prop="status" label="状态" :show-overflow-tooltip="true" width="100">
        <template #default="scope">
          <el-button v-if="scope.row.status === '1'" type="success" link>在职</el-button>
          <el-button v-else type="info" link>离职</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="city2" label="操作" :show-overflow-tooltip="true" width="100" fixed="right" align="center">
        <template #default="scope">
          <div class="table-button">
            <svg-icon name="edit" @click="handleEdit(scope.row)"/>
            <svg-icon class="del" name="del" @click="handleDel(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </q-table>
    <FormDialog v-model:show="showDialog" :data="currentRow" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Search } from '@element-plus/icons-vue'
import { cloneDeep } from "lodash";
import FormDialog from "./components/form-dialog.vue";
import { ElMessageBox, ElMessage } from 'element-plus'

const defaultQueryParams = {
  content: '',
};
const queryParams = ref(cloneDeep(defaultQueryParams));
const list = ref([
  {
    name: '张三',
    account: 'zhangsan',
    phone: '12345678901',
    hospital: '中医医院',
    level: '主任医生',
    status: '1'
  },
  {
    name: '李四',
    account: 'lisi',
    phone: '12345678901',
    hospital: '中医医院',
    level: '主任医生',
    status: '2'
  }
  ,
  {
    name: '王五',
    account: 'wangwu',
    phone: '12345678901',
    hospital: '中医医院',
    level: '主任医生',
    status: '1'
  }
]);

const query = ref(null);

const setQuery = () => {
  query.value = (page, size) => {
    return Promise.resolve({
      data: list.value,
      total: list.value.length
    })
  }
}

const showDialog = ref(false);
const currentRow = ref(null);

const handleAdd = () => {
  showDialog.value = true;
  currentRow.value = null;
}
const handleEdit = (row) => {
  showDialog.value = true;
  currentRow.value = cloneDeep(row);
}

const handleDel = (row) => {
  ElMessageBox.confirm(`是否确认删除${row.name}`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage({
      type: 'success',
      message: '删除成功!'
    })
  }).catch(() => {
  })
}

onMounted(() => {
  setQuery();
})

</script>

<style lang="less" scoped>
.home-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .query-container {
    flex-shrink: 0;
    padding: 24px 35px 6px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
    .query-input {
      width: 225px !important;
    }
  }
  .table-container {
    margin-top: 20px;
    border-radius: 4px;
    background: #fff;
    .table-button {
      font-size: 32px;
      color: #4F8DF5;
      cursor: pointer;
      .del {
        color: #EF4444;
      }
    }
  }
}
</style>