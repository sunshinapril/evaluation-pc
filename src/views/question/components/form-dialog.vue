<template>
  <el-dialog v-model="show" width="1100px" append-to-body :title="data && data.name ? '编辑问题' : '新增问题'" :destroy-on-close="true" center>
    <div class="form-dialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" inline> 
         <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" class="form-select">
            <el-option label="一级" value="1"></el-option>
            <el-option label="二级" value="2"></el-option>
            <el-option label="三级" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题" prop="question">
          <el-input v-model="form.question" class="form-input" placeholder="请输入问题"></el-input>
        </el-form-item>
        <el-form-item label="是否多选" prop="multiple">
          <el-select v-model="form.multiple" placeholder="是否多选" class="form-select">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort"  class="form-input" placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item label="必填" prop="must">
          <el-select v-model="form.must" placeholder="请选择是否必填" class="form-select">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" class="form-select">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <div class="add-option">
          <el-button type="primary" @click="addOption">添加选项</el-button>
        </div>
        <div class="options" v-for="(item, index) in form.options" :key="item.key">
          <el-form-item :key="item.key" :label="`选项${index + 1}`" :prop="`options.${index}.option`" :rules="{ required: true, message: '请输入选项', trigger: 'blur' }">
            <el-input v-model="item.option" class="form-input" placeholder="请输入选项"></el-input>
          </el-form-item>
          <el-form-item :key="item.key" label="得分额" :prop="`options.${index}.score`" :rules="{ required: true, message: '请输入得分额', trigger: 'blur' }" >
            <el-input v-model="item.score" class="form-input" placeholder="请输入得分额"></el-input>
          </el-form-item>
          <svg-icon class="del" name="del" @click="delOption(index)" />
        </div>
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
import {uuid} from '@/utils/index';
import { ElMessage } from 'element-plus';


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
  type: '',
  question: '',
  multiple: '',
  sort: '',
  must: '',
  status: '',
  options: []
}

const form = ref(cloneDeep(defaultForm));

const rules = reactive({
  type: [
    { required: true, message: '请选择类型', trigger: 'change' },
  ],
  question: [
    { required: true, message: '请输入问题', trigger: 'blur' },
  ],
  multiple: [
    { required: true, message: '请选择是否多选', trigger: 'change' },
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

const addOption = () => {
  if(form.value.options.length >= 4) {
    ElMessage.warning('最多添加4个选项');
    return;
  }
  form.value.options.push({
    option: '',
    score: '',
    key: uuid()
  })
}

const delOption = (index) => {
  form.value.options.splice(index, 1);
}


</script>

<style lang="less" scoped>
.form-select, .form-input {
  width: 230px !important;
}
.add-option {
  margin-left: 40px;
}

.options {
  margin-top: 18px;
}
.del {
  font-size: 20px;
  color: #EF4444;
  cursor: pointer;
  margin-bottom: 6px;
}
</style>