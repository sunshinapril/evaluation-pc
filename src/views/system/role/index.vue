<template>
  <div class="role-container">
    <div class="query-container">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="角色名">
          <el-input v-model="queryParams.condition.roleName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" :icon="Search" @click="setQuery">搜索</el-button>
          <el-button size="small" :icon="Refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mid-action">
      <el-button type="primary" :icon="Plus" size="small" @click="handleAdd">新增</el-button>
    </div>
    <q-table :query="query">
      <el-table-column prop="roleName" label="角色名" :show-overflow-tooltip="true" min-width="120"></el-table-column>
      <el-table-column prop="roleCode" label="权限字符" :show-overflow-tooltip="true" min-width="120"></el-table-column>      
      <el-table-column prop="ctime" label="创建时间" width="175"></el-table-column>
      <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" min-width="150"></el-table-column>
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" :icon="Setting" @click="handleSettings(scope.row)">分配权限</el-button>
          <el-button type="primary" size="small" :icon="Edit" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </q-table>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body :destroy-on-close="true" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="form.roleName" :maxlength="10" :show-word-limit="true" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限字符" prop="roleCode">
              <el-input v-model="form.roleCode" placeholder="请输入权限字符" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input 
                v-model="form.remark" 
                placeholder="请输入备注" 
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                :show-word-limit="true"
                :maxlength="100"
                resize="none"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
        <el-button @click="open = false" size="small">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-drawer
      v-model="drawerVisible"
      title="分配权限"
      direction="rtl"
      size="40%"
    >
      <template #default>
        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          :data="treeList"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :default-expand-all="true"
          :check-strictly	= "true"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button size="small" @click="cancelClick">取消</el-button>
          <el-button type="primary" size="small" :loading="drawerLoading" @click="confirmClick">确认</el-button>
        </div>
      </template>
    </el-drawer>  
  </div>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import {cloneDeep} from 'lodash';
import {getRoleList, saveOrUpdateRole, getRoleMenus, updateRoleMenus} from '@/api/system/role';
import {getTreeList} from '@/api/system/menu';

import {
  Search,
  Refresh,
  Edit,
  Setting,
  Plus
} from '@element-plus/icons-vue';


const defaultParams = {
  condition: {
    roleName: null
  },
  pageNum: 1,
  pageSize: 20
}
const queryParams = ref(cloneDeep(defaultParams));
const query = ref(null);
const setQuery = () => {
  query.value = (page, size) => {
    const params = {
      ...queryParams.value,
      pageNum: page,
      pageSize: size
    }
    return getRoleList(params).then(({date, code}) => {
      if(code == 200) {
        return {
          data: date.data || [],
          total: date.total
        }
      }
    })
  } 
};


const reset = () => {
  queryParams.value = cloneDeep(defaultParams);
  setQuery();
};

// 新增角色
const defaultForm = {
  roleName: '',
  roleCode: '',
  remark: ''
}

const form = ref(cloneDeep(defaultForm));
const rules = ref({
  roleName: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' }
  ],
  roleCode: [
    { required: true, message: '权限字符不能为空', trigger: 'blur' }
  ]
});
const formRef = ref(null);
const open = ref(false);
const title = ref('');

const handleAdd = () => {
  title.value = '新增角色';
  form.value = cloneDeep(defaultForm);
  open.value = true;
}

const handleEdit = (row) => {
  title.value = '编辑角色';
  form.value = cloneDeep(row);
  open.value = true;
}

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      saveOrUpdateRole(form.value).then((res) => {
        ElMessage.success('保存成功');
        open.value = false;
        setQuery();
      })
    }
  })
}

// 分配权限
const drawerVisible = ref(false);
const currentRow = ref({});
const treeRef = ref(null);
const drawerLoading = ref(false);

const cancelClick = () => {
  drawerVisible.value = false;
}
const confirmClick = () => {
  saveRoleMenus();
}

const handleSettings = (row) => {
  drawerVisible.value = true;
  currentRow.value = cloneDeep(row);
  queryRoleMenus();
}

// 获取菜单树

const treeList = ref([]);
const queryTreeList = () => {
  getTreeList().then((res) => {
    treeList.value = res.date || [];
  })
}

// 获取当前角色菜单
const defaultProps = ref({
  children: 'children',
  label: 'menuName',
})
const queryRoleMenus = () => {
  getRoleMenus(currentRow.value.id).then((res) => {
    treeRef.value.setCheckedKeys(res.date || []);
  })
}

// 更新角色菜单
const saveRoleMenus = () => {
  drawerLoading.value = true;
  const getCheckedKeys = treeRef.value.getCheckedKeys();
  updateRoleMenus(currentRow.value.id, getCheckedKeys).then((res) => {
    drawerLoading.value = false;
    if(res.code == 200) {
      drawerVisible.value = false;
      ElMessage.success('保存成功');
    }
  }).catch(() => {
    drawerLoading.value = false;
  });
}


onMounted(() => {
  setQuery();
  queryTreeList();
});

</script>

<style lang="less" scoped>  
.role-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  .query-container {
    flex-shrink: 0;
  }
  .mid-action {
    flex-shrink: 0;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
  }
}
.dialog-footer {
  text-align: right;
}
</style>
