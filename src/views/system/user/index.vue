<template>
  <div class="user-container">
    <div class="query-container">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="用户名">
          <el-input v-model="queryParams.condition.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="queryParams.condition.phoneNum" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" :icon="Search" @click="setQuery">搜索</el-button>
          <el-button size="small" :icon="Refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <q-table :query="query">
      <el-table-column prop="userAvatar" label="用户头像" width="80" fixed="left">
        <template #default="scope">
          <el-image
            :preview-teleported	="true"
            style="width: 40px; height: 40px; border-radius: 50%"
            :src="scope.row.userAvatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
            :preview-src-list="[scope.row.userAvatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png']"
          >
          </el-image>
        </template> 
      </el-table-column>
      <el-table-column prop="userName" label="用户名" :show-overflow-tooltip="true" min-width="120"></el-table-column>
      <el-table-column label="拥有角色" min-width="200">
        <template #default="{row}">
          <template v-if="row.sysRoleList && row.sysRoleList.length">
            <el-tag class="tag" type="warning" v-for="role in row.sysRoleList">{{ role.roleName }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="userEmail" label="邮箱" :show-overflow-tooltip="true" width="120"></el-table-column>
      <el-table-column prop="phoneNum" label="手机号" :show-overflow-tooltip="true" width="120"></el-table-column>
      <el-table-column prop="accountStatus" label="状态" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.accountStatus == 0" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ctime" label="创建时间" width="175"></el-table-column>
      <el-table-column prop="mtime" label="最后登录时间" width="180"></el-table-column>
      <el-table-column prop="remark" label="备注" width="150"></el-table-column>
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" :icon="Setting" @click="handleSettings(scope.row)">分配角色</el-button>
          <el-button type="primary" size="small" :icon="Edit" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </q-table>
     <!-- 分配权限对话框 -->
     <el-drawer
      v-model="drawerVisible"
      title="分配角色"
      direction="rtl"
      size="40%"
    >
      <template #default>
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <el-checkbox-group
          v-model="checkedRoles"
          @change="handleCheckedRoleChange"
        >
          <el-checkbox v-for="role in roleList" :key="role.id" :label="role.roleName" :value="role.id">
          </el-checkbox>
        </el-checkbox-group>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button size="small" @click="cancelClick">取消</el-button>
          <el-button type="primary" size="small" :loading="drawerLoading" @click="confirmClick">确认</el-button>
        </div>
      </template>
    </el-drawer>
    <!--编辑弹框-->
    <el-dialog title="编辑用户" v-model="open" width="600px" append-to-body :destroy-on-close="true" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" :maxlength="20" :show-word-limit="true" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNum">
          <el-input v-model="form.phoneNum" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="form.userEmail" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="accountStatus">
          <el-switch v-model="form.accountStatus" :active-value="0" :inactive-value="1" active-text="启用" inactive-text="禁用" />
        </el-form-item>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
        <el-button @click="open = false" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import {cloneDeep} from 'lodash';
import {getUserList, updateUserGrantRole, saveOrUpdateUser} from '@/api/system/user';
import {getRoleListAll} from '@/api/system/role';

import {
  Search,
  Refresh,
  Edit,
  Setting
} from '@element-plus/icons-vue';

const defaultParams = {
  condition: {
    userName: null,
    phoneNum: null
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
    return getUserList(params).then(({date, code}) => {
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



// 分配角色
const drawerVisible = ref(false);
const currentRow = ref({});
const drawerLoading = ref(false);
const checkedRoles = ref([]);
const checkAll = ref(false)
const isIndeterminate = ref(false)
const roleList = ref([]);


const handleCheckAllChange = (val) => {
  checkedRoles.value = val ? roleList.value.map(item => item.id) : [];
  isIndeterminate.value = false;
}
const handleCheckedRoleChange = (value) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === roleList.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < roleList.value.length
}

const cancelClick = () => {
  drawerVisible.value = false;
}
const confirmClick = () => {
  saveRoleMenus();
}

const handleSettings = (row) => {
  drawerVisible.value = true;
  currentRow.value = cloneDeep(row);
  checkedRoles.value = (row.sysRoleList || []).map(item => item.id) || [];
  const len = checkedRoles.value.length;
  checkAll.value = len && len === roleList.value.length;
  isIndeterminate.value = len > 0 && len < roleList.value.length;
}

// 获取所有角色
const queryRoleListAll = () => {
  getRoleListAll().then(res => {
    roleList.value = res.date || [];
  })
}

// 更新用户角色权限
const saveRoleMenus = () => {
  drawerLoading.value = true;
  updateUserGrantRole(currentRow.value.id, checkedRoles.value).then((res) => {
    drawerLoading.value = false;
    if(res.code == 200) {
      drawerVisible.value = false;
      ElMessage.success('保存成功');
      setQuery();
    }
  }).catch(() => {
    drawerLoading.value = false;
  });
}



// 编辑用户
const defaultForm = {
  userName: '',
  phoneNum: '',
  userEmail: '',
  accountStatus: '',
  remark: ''
}

const form = ref(cloneDeep(defaultForm));
const rules = ref({
  userName: [
    { required: true, message: '用户名称不能为空', trigger: 'blur' }
  ],
  userEmail: [
    { required: true, message: "邮箱地址不能为空", trigger: "blur" },
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  phoneNum: [
    { required: true, message: "手机号码不能为空", trigger: "blur" },
    {
      pattern: /^1\d{10}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});
const formRef = ref(null);
const open = ref(false);


const handleEdit = (row) => {
  form.value = cloneDeep(row);
  open.value = true;
}

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      saveOrUpdateUser(form.value).then((res) => {
        ElMessage.success('保存成功');
        open.value = false;
        setQuery();
      })
    }
  })
}


onMounted(() => {
  setQuery();
  queryRoleListAll();
});

</script>

<style lang="less" scoped>  
.user-container {
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
  .tag + .tag {
    margin-left: 5px;
  }
}
.dialog-footer {
  text-align: right;
}
</style>
