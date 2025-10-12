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
      <div class="info_text">
        若有重复手机号线索将合并为一条信息，点击下载<span @click="exportDataFun"
          >excel模版</span
        >
      </div>
      <el-upload
        class="upload-demo"
        drag
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
      >
        <el-icon class="el-icon--upload" style="color: #f65800"
          ><upload-filled
        /></el-icon>
        <div class="el_text">点击或文件拖拽到这里上传</div>
        <div class="el_text" style="margin-top: 5px">
          仅支持xlsx格式，请将大小控制在20M以内
        </div>
      </el-upload>
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
import { UploadFilled } from "@element-plus/icons-vue";

import { downloadExcel } from "@/api/userMessage/culeListData";
const props = defineProps({ codeListFun: Function });

const dialogVisible = ref(false);
const title = ref("批量导入线索");

const handleOpen = () => {
  dialogVisible.value = true;
};

const onSubmit = () => {
  console.log(11);
};

const handleClose = () => {
  dialogVisible.value = false;
};

const exportDataFun = () => {
  downloadExcel().then((res) => {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(new Blob([res.data]));
    link.setAttribute("download", "线索模板.xlsx"); // 设置下载的文件名
    document.body.appendChild(link);
    link.click(); // 触发下载

    // 清理 DOM
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  });
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
.upload-demo {
  width: 90%;
  margin-left: 5%;
  margin-top: 25px;
  background-color: #fffaf7;
}
:deep(.el-upload-dragger) {
  background-color: #fffaf7;
}
.el_text {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.info_text {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 20px;
  padding-left: 20px;
  span {
    color: #f65800;
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
