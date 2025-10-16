<template>
  <el-dialog v-model="show" width="500px" append-to-body :title="data && data.name ? '编辑医生' : '新增医生'" :destroy-on-close="true" center>
    <div class="form-dialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px"> 
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="Phone">
          <el-input v-model="form.Phone"></el-input>
        </el-form-item>
        <el-form-item label="医院" prop="hospital">
          <el-select v-model="form.hospital" placeholder="请选择医院">
            <el-option label="一级" value="1"></el-option>
            <el-option label="二级" value="2"></el-option>
            <el-option label="三级" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-select v-model="form.level" placeholder="请选择级别">
            <el-option label="一级" value="1"></el-option>
            <el-option label="二级" value="2"></el-option>
            <el-option label="三级" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="在职" value="1"></el-option>
            <el-option label="离职" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { cloneDeep } from 'lodash';
import { ref, watch, computed, reactive } from 'vue';


const show = defineModel('show');

console.log(show, 'show')

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const defaultForm = {
  name: '',
  account: '',
  password: '',
  confirmPassword: '',
  Phone: '',
  hospital: '',
  level: '',
  status: '',
}

const form = ref(cloneDeep(defaultForm));

const rules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
  ],
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
  ],
  Phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
  ]
})

const formRef = ref(null);

watch(() => props.show, (val) => {
  if(val) {
    form.value = cloneDeep(props.data || defaultForm);
  }
})

const onSubmit = () => {
  formRef.value.validate((valid) => {
    if(valid) {
      show.value = false;
    }
  })
}



</script>

<style lang="less" scoped>


</style>