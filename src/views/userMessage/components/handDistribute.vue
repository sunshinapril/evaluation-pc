<template>
  <div>
    <el-dialog
      style="text-align: left"
      v-model="dialogVisible"
      :title="title"
      width="500"
      :before-close="handleClose"
    >
      <template #header>
        <div class="my_header">
          {{ title }}
        </div>
      </template>
      <div class="top_title">
        是否将选择的客户分配给所选营业部，分配后将无法恢复！
      </div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="auto"
        style="max-width: 600px"
      >
        <el-form-item label="分配类型" prop="tagList">
          <el-select v-model="form.mergeByClueId" placeholder="选择分配类型">
            <el-option
              v-for="(item, index) in chartList"
              :key="index"
              :label="item.custName"
              :value="JSON.stringify(item)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="营业部" prop="tagList">
          <el-select v-model="form.mergeByClueId" placeholder="选择营业部">
            <el-option
              v-for="(item, index) in chartList"
              :key="index"
              :label="item.custName"
              :value="JSON.stringify(item)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="销售人员" prop="tagList">
          <el-select v-model="form.mergeByClueId" placeholder="选择销售人员">
            <el-option
              v-for="(item, index) in chartList"
              :key="index"
              :label="item.custName"
              :value="JSON.stringify(item)"
            />
          </el-select>
        </el-form-item>
        <!-- <div class="name_box">
        </div> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false"
            >取消</el-button
          >
          <el-button size="small" type="primary" @click="onSubmit">
            分配
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { groupUpdate } from "@/api/userMessage/codeMessage";
const props = defineProps({ codeListFun: Function });

const dialogVisible = ref(false);
const chartList = ref([]);
const formRef = ref();
const title = ref("手动派发客户");
const form = ref({
  groupName: "",
  tagList: [],
});
const rules = ref({
  groupName: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
  tagList: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
});

const handleOpen = (item) => {
  console.log(item);
  dialogVisible.value = true;
};

const onSubmit = () => {
  console.log(form.value);
  formRef.value.validate((valid) => {
    if (valid) {
      form.value.tagList = arr;
      groupUpdate(form.value).then((res) => {
        if (res.code == 200) {
          props.codeListFun();
          handleClose();
          ElMessage.success("修改成功");
        }
      });
    }
  });
};

const handleClose = () => {
  formRef.value.resetFields();
  form.value = {
    groupName: "",
    tagList: [],
  };
  dialogVisible.value = false;
};

defineExpose({ handleOpen });
</script>

<style lang="less" scoped>
::v-deep .el-dialog {
  padding: 0;
}
::v-deep .el-dialog__headerbtn {
  height: 60px;
}
::v-deep .el-dialog__header.show-close {
  padding-right: 0;
}
.my_header {
  width: 100%;
  height: 60px;
  line-height: 60px;
  padding-left: 20px;
  border-bottom: 0.5px solid #d9d9d9;
  color: #000;
  font-size: 18px;
  font-weight: 600;
}
.el-form {
  padding: 0 20px;
}
.dialog-footer {
  padding: 20px;
}

.title_text {
  height: 16px;
  border-left: 3px solid #f65800;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  padding-left: 8px;
}
.addTag {
  color: #979797;
  font-size: 14px;
  line-height: 20px;
  padding-left: 92px;
  cursor: pointer;
}
.top_title {
  font-weight: 600;
  font-size: 16px;
  color: #000;
  padding-left: 20px;
  margin-bottom: 15px;
}
</style>
