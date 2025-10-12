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
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="auto"
        style="max-width: 600px"
      >
        <el-form-item label="渠道名称" prop="channelName">
          <el-input
            v-model="form.channelName"
            placeholder="输入已选定平台下的渠道名称"
          />
        </el-form-item>
        <el-form-item label="适用营业部" prop="deptIds">
          <el-select v-model="form.deptIds" multiple placeholder="选择营业部">
            <el-option
              v-for="(item, index) in chartList"
              :key="index"
              :label="item.deptName"
              :value="item.deptId"
            />
          </el-select>
        </el-form-item>
        <div class="addTag">提醒：拉取标记了营业部标签的部门</div>
        <!-- <div class="name_box">
        </div> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false"
            >取消</el-button
          >
          <el-button size="small" type="primary" @click="onSubmit">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { groupUpdate } from "@/api/userMessage/codeMessage";
import { qwList } from "@/api/taskCenter/smsMessage";
import { saveOrUpdate } from "@/api/userMessage/channelMessage";
import { cloneDeep } from "lodash";
const props = defineProps({ findChannelListFun: Function });

const dialogVisible = ref(false);
const formRef = ref();
const title = ref("新建渠道");
const form = ref({
  platformId: "",
  channelName: "",
  deptIds: [],
});
const rules = ref({
  channelName: [{ required: true, message: "请输入渠道名称", trigger: "blur" }],
  deptIds: [{ required: true, message: "请选择营业部", trigger: "blur" }],
});

const platformId = ref("");
const handleOpen = (item, id) => {
  qwListFun();
  platformId.value = id;
  dialogVisible.value = true;
  form.value.platformId = id;
  if (item) {
    title.value = "编辑渠道";
    form.value = cloneDeep(item);
  }
};

// 部门列表
const chartList = ref();
const qwListFun = () => {
  qwList().then((res) => {
    if (res.code == 200) {
      chartList.value = res.date;
    }
  });
};

const onSubmit = () => {
  console.log(form.value);
  formRef.value.validate((valid) => {
    if (valid) {
      saveOrUpdate(form.value).then((res) => {
        if (res.code == 200) {
          props.findChannelListFun();
          handleClose();
          ElMessage.success("保存成功");
        }
      });
    }
  });
};

const handleClose = () => {
  formRef.value.resetFields();
  form.value = {
    channelName: "",
    deptIds: [],
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
</style>
