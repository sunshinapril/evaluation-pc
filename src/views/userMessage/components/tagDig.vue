<template>
  <el-dialog
    style="padding: 20px 0"
    v-model="dialogVisible"
    width="635"
    :before-close="handleClose"
  >
    <template #header>
      <div class="my_header">标签管理</div>
    </template>
    <div class="line"></div>
    <div class="text">标签分类</div>
    <el-select
      multiple
      v-model="tagValue"
      style="width: 570px; margin-left: 32px; margin-top: 10px"
      placeholder="选择标签"
    >
      <div class="btn_box">
        <div
          @click="formatFun(index)"
          :class="['btn_item', groupIndex == index ? 'activeFormat' : '']"
          v-for="(item, index) in codeGroupList"
          :key="index"
        >
          {{ item.groupName }}
        </div>
      </div>
      <el-option
        v-for="(item, index) in options"
        :key="index"
        :label="item.name"
        :value="item.tagId"
        :style="{
          display:
            item.groupId == codeGroupList[groupIndex].groupId
              ? 'block'
              : 'none',
        }"
      />
    </el-select>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { updateSysTag, updateCustTag } from "@/api/userMessage/userDetail";
import {
  codeAllList,
  codeAllListWe,
  groupListWe,
  groupList,
} from "@/api/userMessage/codeMessage";

const props = defineProps({ updateCustClueFun: Function });

const dialogVisible = ref(false);
const tagValue = ref();
const options = ref([]);
const externalUserId = ref(null);
const clueId = ref(null);
const isSys = ref(0);

const codeGroupList = ref([]);
const groupIndex = ref(0);

const handleOpen = (index, tag, data1, data2) => {
  if (tag) {
    tagValue.value = tag.map((item) => {
      return item.tagId;
    });
  }

  externalUserId.value = data1;
  clueId.value = data2;
  dialogVisible.value = true;
  isSys.value = index;
  codeListFun(index, "");
  groupListFun(index);
};
const handleClose = () => {
  groupIndex.value = 0;
  tagValue.value = [];
  dialogVisible.value = false;
};

// 标签列表
const codeListFun = (index, id) => {
  if (index == 1) {
    codeAllList({
      groupId: id,
    }).then((res) => {
      if (res.code == 200) {
        options.value = options.value.concat(res.date);
        options.value = options.value.filter((item, index, self) => {
          return index === self.findIndex((t) => t.tagId === item.tagId);
        });
      }
    });
  } else {
    codeAllListWe({
      groupId: id,
    }).then((res) => {
      if (res.code == 200) {
        if (res.code == 200) {
          options.value = options.value.concat(res.date);
          options.value = options.value.filter((item, index, self) => {
            return index === self.findIndex((t) => t.tagId === item.tagId);
          });
        }
      }
    });
  }
};
// 标签组列表
const groupListFun = (index) => {
  if (index == 1) {
    groupList().then((res) => {
      if (res.code == 200) {
        codeGroupList.value = res.date;
        codeListFun(index, codeGroupList.value[0].groupId);
      }
    });
  } else {
    groupListWe().then((res) => {
      if (res.code == 200) {
        codeGroupList.value = res.date;
        codeListFun(index, codeGroupList.value[0].groupId);
      }
    });
  }
};

const formatFun = (index) => {
  groupIndex.value = index;
  codeListFun(isSys.value, codeGroupList.value[index].groupId);
};

const submit = () => {
  if (isSys.value == 1) {
    updateSysTag({
      tagIdList: tagValue.value,
      externalUserId: externalUserId.value,
      clueId: clueId.value,
    }).then((res) => {
      if (res.code == 200) {
        ElMessage.success("更新成功");
        handleClose();
        props.updateCustClueFun();
      }
    });
  } else {
    updateCustTag({
      tagIdList: tagValue.value,
      externalUserId: externalUserId.value,
      clueId: clueId.value,
    }).then((res) => {
      if (res.code == 200) {
        ElMessage.success("更新成功");
        handleClose();
        props.updateCustClueFun();
      }
    });
  }
};

defineExpose({ handleOpen });
</script>
<style lang="less" scoped>
.my_header {
  width: 100%;
  padding-bottom: 5px;
  padding-left: 32px;
  color: #000;
  font-size: 18px;
  font-weight: 600;
}
.line {
  width: 100%;
  height: 0.5px;
  background-color: #d9d9d9;
}
.text {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 20px;
  margin-top: 30px;
  padding-left: 32px;
}
.phone_box {
  margin-top: 16px;
  padding-left: 32px;
  .el-radio-group {
    width: 100%;
  }
  .el-radio {
    width: 100%;
    height: 44px;
    background-color: #f6f6f6;
    margin-bottom: 8px;
    padding-left: 20px;
    position: relative;
    box-sizing: border-box;
    .el-input {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      width: 150px;
    }
    .code {
      margin-left: 20px;
      display: inline-block;
      height: 20px;
      line-height: 20px;
      padding: 0 4px;
      background-color: #ffe6d9;
      font-weight: 600;
    }
    .edit_btn {
      width: 16px;
      height: 16px;
      vertical-align: middle;
      cursor: pointer;
      position: absolute;
      right: 56px;
    }
    .delete_btn {
      width: 16px;
      height: 16px;
      vertical-align: middle;
      cursor: pointer;
      position: absolute;
      right: 20px;
    }
  }
  .el-radio:last-child {
    margin-right: 30px;
  }
}
.addPhone {
  color: #f65800;
  font-size: 14px;
  line-height: 20px;
  padding-left: 32px;
  cursor: pointer;
}
.dialog-footer {
  padding-right: 32px;
}
.btn_box {
  width: 100%;
  padding: 0 20px;
  margin-bottom: 10px;
  border-bottom: 0.5px solid #e1e2e5;
  display: flex;
  justify-content: left;
  .btn_item {
    display: inline-block;
    height: 40px;
    line-height: 37px;
    border-bottom: 3px solid #fff;
    color: rgba(0, 0, 0, 0.65);
    font-size: 15px;
    margin-right: 20px;
    cursor: pointer;
  }
  .activeFormat {
    color: #f65800;
    border-bottom: 3px solid red;
  }
}
</style>
