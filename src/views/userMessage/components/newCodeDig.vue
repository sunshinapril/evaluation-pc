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
        <div class="title_text" style="margin-bottom: 20px; margin-top: 10px">
          标签分组
        </div>
        <el-form-item label="分组名" prop="groupName">
          <el-input
            :disabled="title == '添加标签' ? true : false"
            v-model="form.groupName"
            placeholder="请输入分组名称"
          />
        </el-form-item>
        <div
          v-if="title !== '编辑分组名称'"
          class="title_text"
          style="margin-bottom: 20px; margin-top: 40px"
        >
          新增标签
        </div>
        <el-form-item
          v-if="title !== '编辑分组名称'"
          label="标签名"
          v-for="(item, index) in tagList"
          :key="index"
        >
          <el-input v-model="item.name" placeholder="请输入标签名称" />
        </el-form-item>
        <div class="addTag" @click="addTag" v-if="title !== '编辑分组名称'">
          + 添加标签
        </div>
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
import {
  groupSave,
  groupUpdate,
  groupSaveWe,
  groupUpdateWe,
} from "@/api/userMessage/codeMessage";
import { cloneDeep } from "lodash";
const props = defineProps({ codeListFun: Function, selectIndex: Number });

const dialogVisible = ref(false);
const formRef = ref();
const title = ref("新建标签");
const tagList = ref([{ name: "" }]);
const form = ref({
  groupName: "",
  tagList: [],
});
const rules = ref({
  groupName: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
});

const addTag = () => {
  tagList.value.push({
    name: "",
  });
};

const handleOpen = (data, item) => {
  console.log(item);
  title.value = data;
  dialogVisible.value = true;
  if (item) {
    form.value = cloneDeep(item);
  }
};

const onSubmit = () => {
  console.log(form.value);
  formRef.value.validate((valid) => {
    if (valid) {
      if (tagList.value[0].name || title.value == "编辑分组名称") {
        const arr = tagList.value.filter((item) => {
          return item.name;
        });
        form.value.tagList = arr;
        if (title.value == "编辑分组名称") {
          if (props.selectIndex == 1) {
            groupUpdate(form.value).then((res) => {
              if (res.code == 200) {
                props.codeListFun();
                handleClose();
                ElMessage.success("修改成功");
              }
            });
          } else {
            groupUpdateWe(form.value).then((res) => {
              if (res.code == 200) {
                props.codeListFun();
                handleClose();
                ElMessage.success("修改成功");
              }
            });
          }
        } else {
          if (props.selectIndex == 1) {
            groupSave(form.value).then((res) => {
              if (res.code == 200) {
                props.codeListFun();
                handleClose();
                ElMessage.success("保存成功");
              }
            });
          } else {
            groupSaveWe(form.value).then((res) => {
              if (res.code == 200) {
                props.codeListFun();
                handleClose();
                ElMessage.success("保存成功");
              }
            });
          }
        }
      } else {
        ElMessage.error("请新建标签");
      }
    }
  });
};

const handleClose = () => {
  formRef.value.resetFields();
  form.value = {
    groupName: "",
    tagList: [],
  };
  tagList.value = [{ name: "" }];
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
  color: #f65800;
  font-size: 14px;
  line-height: 20px;
  padding-left: 52px;
  cursor: pointer;
}
</style>
