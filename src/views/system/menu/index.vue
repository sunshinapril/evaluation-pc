<template>
  <div class="menu-container">
    <div class="query-container">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="菜单名称">
          <el-input v-model="queryParams.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" :icon="Search" @click="getList">搜索</el-button>
          <el-button size="small" :icon="Refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mid-action">
      <el-button type="primary" :icon="Plus" size="small" @click="handleAdd"
          >新增</el-button
        >
    </div>

    <q-table :loading="loading" :data="list" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" row-key="id">
      <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template #default="scope">
          <svg-icon :name="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="ctime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.ctime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"  
            :icon="Edit"
            @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
          <el-button
            link
            type="primary" 
            :icon="Plus"
            @click="handleAdd(scope.row)"
            >新增</el-button
          >
          <el-button
            link
            type="primary" 
            :icon="Delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </q-table>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body :destroy-on-close="true" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <el-cascader 
                :options="menuOptions" 
                :show-all-levels="false" 
                :props="{ value: 'id', label: 'menuName', children: 'children', checkStrictly: true, emitPath: false }" 
                v-model="form.parentId" 
                placeholder="选择上级菜单" 
                clearable 
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio value="M">目录</el-radio>
                <el-radio value="C">菜单</el-radio>
                <el-radio value="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType != 'F'">
            <el-form-item prop="icon" label="菜单图标">
              <icon-select v-model="form.icon"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="form.menuPath" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'M'">
            <el-form-item label="权限标识">
              <el-input v-model="form.perms" placeholder="请权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item label="显示状态">
              <el-radio-group v-model="form.hidden">
                <el-radio v-for="dict in visibleOptions" :key="dict.dictValue" :value="dict.dictValue">{{
                  dict.dictLabel
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
        <el-button @click="open = false" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { cloneDeep } from 'lodash';
import { ref, onMounted } from 'vue';
import moment from 'moment';
import {
  Search,
  Refresh,
  Edit,
  Plus,
  Delete
} from '@element-plus/icons-vue';
import {getTreeList, getMenu, saveOrUpdate, delMenu} from '@/api/system/menu';
import IconSelect from '@/components/IconSelect/index.vue';

const defaultParams = {
  menuName: '',
}

const queryParams = ref(cloneDeep(defaultParams));
const list = ref([]);
const loading = ref(false);

const getList = () => {
  loading.value = true;
  getTreeList(queryParams.value).then(res => {
    list.value = res.date || [];
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  })
};

const reset = () => {
  queryParams.value = cloneDeep(defaultParams);
  getList();
}

const parseTime = time => moment(time).format('YYYY-MM-DD HH:mm:ss');

// 表单
const defaultForm = {
    component: '',
    hidden: '',
    component: '',
    icon: '',
    id: '',
    menuName: '',
    menuPath: '',
    menuType: '',
    orderNum: 0,
    parentId: '',
    perms: '',
  }

const open = ref(false);
const title = ref('菜单管理');
const visibleOptions = ref([
      {
        dictValue: 0,
        dictLabel: '显示'
      },
      {
        dictValue: 1,
        dictLabel: '隐藏'
      }
    ]);
const form= ref(cloneDeep(defaultForm));
const formRef = ref(null);
const rules = ref({
  parentId: [{ required: true, message: '请选择上级菜单', trigger: 'change' }],
  menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
  orderNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
  menuPath: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
});

const menuOptions = ref([]);
 /** 查询菜单下拉树结构 */
 const getTreeselect = () => {
    getTreeList().then((response) => {
      menuOptions.value = [];
      const menu = { id: '0', menuName: '主类目', children: [] }
      menu.children = response.date;
      menuOptions.value = [menu];
    })
  };

// 编辑
const handleUpdate = (row) => {
  form.value = cloneDeep(defaultForm);
  getTreeselect();
  getMenu(row.id).then((response) => {

    form.value = response.date;
    open.value = true;
    title.value = '修改菜单';
  })
  .catch((e) => {
    console.error(e)
  })
}
// 新增
const handleAdd = (row) => {
  form.value = cloneDeep(defaultForm);
  if (row != null && row.id) {
    form.value.parentId = row.id;
  } else {
    form.value.parentId = 0;
  }
  getTreeselect();
  open.value = true;
  title.value = '添加菜单';
}

/** 提交按钮 */
const submitForm = () =>  {
  formRef.value.validate((valid) => {
    if (valid) {
      saveOrUpdate(form.value).then((res) => {
          open.value = false
          getList();
        })
    }
  })
};

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('是否确认删除名称为"' + row.menuName + '"的菜单?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return delMenu(row.id);
  }).then(() => {
    getList();
    ElMessage.success('删除成功');
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    })
  })
}

onMounted(() => {
  getList();
})



</script>

<style lang="less" scoped>
.menu-container {
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
