<template>
  <el-dialog v-model="show" width="500px" append-to-body :title="data && data.name ? '编辑医院' : '新增医院'" :destroy-on-close="true" center>
    <div class="form-dialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px"> 
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="no">
          <el-input v-model="form.no"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="concats">
          <el-input v-model="form.concats"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="Phone">
          <el-input v-model="form.Phone"></el-input>
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
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
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
  no: '',
  address: '',
  concats: '',
  Phone: '',
  status: '',
  level: '',
}

const form = ref(cloneDeep(defaultForm));

const rules = reactive({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  no: [
    { required: true, message: '请输入编号', trigger: 'blur' },
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' },
  ],
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