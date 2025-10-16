<template>
  <div class="home-page">
    <el-form class="query-container" inline>
      <el-form-item props="content">
        <el-input
          class="query-input"
          v-model="queryParams.content"
          placeholder="请输入问题名称"
          :prefix-icon="Search"
        />
      </el-form-item>
      <el-form-item props="type">
        <el-select v-model="queryParams.type" placeholder="请选择类别" class="query-select">
          <el-option label="全部" value=""></el-option>
          <el-option label="咨询" value="1"></el-option>
          <el-option label="建议" value="2"></el-option>
          <el-option label="反馈" value="3"></el-option>
        </el-select>
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
      <el-table-column prop="index" label="ID" width="50"></el-table-column>
      <el-table-column prop="sort" label="排序" width="100"></el-table-column>
      <el-table-column prop="question" label="问题" :show-overflow-tooltip="true" min-width="180"></el-table-column>
      <el-table-column prop="type" label="类别" :show-overflow-tooltip="true" min-width="100"></el-table-column>
      <el-table-column prop="option1" label="选项1" :show-overflow-tooltip="true" min-width="120"></el-table-column>
      <el-table-column prop="option2" label="选项2" :show-overflow-tooltip="true" min-width="120"></el-table-column>
      <el-table-column prop="option3" label="选项3" :show-overflow-tooltip="true" min-width="120"></el-table-column>
      <el-table-column prop="option4" label="选项4" :show-overflow-tooltip="true" min-width="120"></el-table-column>
      <el-table-column prop="must" label="必填" :show-overflow-tooltip="true" min-width="80"></el-table-column>
      <el-table-column prop="status" label="状态" :show-overflow-tooltip="true" width="100">
        <template #default="scope">
           <el-tag v-if="scope.row.status === '1'" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
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
  type: ''
};
const queryParams = ref(cloneDeep(defaultQueryParams));
const list = ref([
  {
    index: '1',
    sort: '1',
    question: '做事时提不起劲或者只有少许乐趣',
    type: '咨询',
    option1: '选项1',
    option2: '选项2',
    option3: '选项3',
    option4: '选项4',
    must: '是',
    status: '1'
  },
  {
    index: '2',
    sort: '2',
    question: '问题2',
    type: '建议',
    option1: '选项1',
    option2: '选项2',
    option3: '选项3',
    option4: '选项4',
    must: '是',
    status: 0
  },
  {
    index: '3',
    sort: '3',
    question: '问题3',
    type: '反馈',
    option1: '选项1',
    option2: '选项2',
    option3: '选项3',
    option4: '选项4',
    must: '是',
    status: '1'
  },
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
    .query-input, .query-select {
      width: 225px !important;
    }
  }
  .table-container {
    margin-top: 20px;
    border-radius: 4px;
    background: #fff;
    .table-button {
      font-size: 20px;
      color: #4F8DF5;
      cursor: pointer;
      .del {
        color: #EF4444;
        margin-left: 20px;
      }
    }
  }
}
</style>