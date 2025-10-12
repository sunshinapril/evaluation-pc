<template>
  <div>
    <el-dialog v-model="dialogVisible" width="500" :before-close="handleClose">
      <template #header>
        <div class="my_header">联系方式管理</div>
      </template>
      <div class="text">勾选主手机号，每个客户只能设置唯一1个主手机号</div>
      <div class="phone_box">
        <el-radio-group v-model="radio1" @change="changeFun">
          <template #default>
            <div
              class="radio_box"
              v-for="(item, index) in phoneList"
              :key="index"
            >
              <el-radio :value="item.phone" size="large">
                <el-input-number
                  v-if="item.idEdit"
                  :controls="false"
                  v-model="item.phone"
                  placeholder="填写手机号"
                  type="number"
                />
                <span class="phone" v-else>{{ item.phone }}</span>
                <span class="code" v-if="radio1 == item.phone && radio1"
                  >主</span
                >
              </el-radio>
              <div class="btn_box">
                <img
                  @click="editBtn(index)"
                  class="edit_btn"
                  src="../../../assets/images/common/edit_icon.png"
                  alt=""
                />
                <img
                  @click="deleteBtn(index)"
                  class="delete_btn"
                  src="../../../assets/images/common/delete.png"
                  alt=""
                />
              </div>
            </div>
          </template>
        </el-radio-group>
      </div>
      <div class="addPhone" @click="addPhone">+添加联系方式</div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="submit"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { updateCustPhone } from "@/api/userMessage/userDetail";
const props = defineProps({ findCustClueByIdFun: Function });

const radio1 = ref(null);
const dialogVisible = ref(false);
const phoneList = ref([]);
const externalUserId = ref(null);
const clueId = ref(null);

const handleOpen = (phone1, phoneArr, data1, data2) => {
  externalUserId.value = data1;
  clueId.value = data2;
  if (phone1) {
    phoneList.value.push({
      phone: phone1,
      idEdit: false,
    });
    radio1.value = phone1;
  }

  if (phoneArr) {
    phoneArr.map((item) => {
      phoneList.value.push({
        phone: item,
        idEdit: false,
      });
    });
  }
  dialogVisible.value = true;
};
const handleClose = () => {
  dialogVisible.value = false;
  phoneList.value = [];
  radio1.value = null;
};
const editBtn = (index) => {
  phoneList.value[index].idEdit = true;
};
const deleteBtn = (index) => {
  // if (phoneList.value && phoneList.value[index].phone == radio1.value) {
  //   ElMessage.error("主手机号不能删除");
  // } else {
  phoneList.value.splice(index, 1);
  // }
};
const addPhone = () => {
  if (
    phoneList.value.length == 0 ||
    isValidPhoneNumber(phoneList.value[phoneList.value.length - 1].phone)
  ) {
    phoneList.value = phoneList.value.map((item) => {
      return {
        phone: item.phone,
        idEdit: false,
      };
    });
    phoneList.value.push({
      phone: null,
      idEdit: true,
    });
  } else {
    ElMessage.error("请输入正确手机号");
  }
};
const changeFun = (e) => {
  // phoneList.value = phoneList.value.map((item) => {
  //   return {
  //     phone: item.phone,
  //     idEdit: false,
  //   };
  // });
  // phoneList.value = phoneList.value.filter((item) => {
  //   return item.phone;
  // });
  // if (radio1.value == "") {
  //   radio1.value = phoneList.value[phoneList.value.length - 1].phone;
  // }
  console.log(radio1.value);
};

function isValidPhoneNumber(phoneNumber) {
  // 正则表达式校验手机号码
  const regex =
    /^(13[0-9]|14[01456789]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  return regex.test(phoneNumber);
}

// 提交
const submit = () => {
  phoneList.value = phoneList.value.filter((item) => {
    return item.phone;
  });
  let changePhone = phoneList.value.filter((item) => {
    return item.phone == radio1.value;
  });
  let arr = phoneList.value.filter((item) => {
    return item.phone != radio1.value;
  });
  arr = arr.map((item) => {
    return item.phone;
  });
  if (changePhone.length > 0) {
    if (
      isValidPhoneNumber(phoneList.value[phoneList.value.length - 1].phone) &&
      isValidPhoneNumber(radio1.value)
    ) {
      updateCustPhone({
        custPhone: radio1.value,
        otherMobiles: arr,
        externalUserId: externalUserId.value,
        clueId: clueId.value,
      }).then((res) => {
        if (res.code == 200) {
          ElMessage.success("提交成功");
          props.findCustClueByIdFun();
          handleClose();
        }
      });
    } else {
      ElMessage.error("请输入正确手机号");
    }
  } else {
    ElMessage.error("请选择主手机号");
  }
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
.text {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 20px;
  margin-top: 10px;
  padding-left: 20px;
}

//
.radio_box {
  width: calc(100% - 20px);
  background-color: #f6f6f6;
  margin-bottom: 10px;
  height: 44px;
}
.btn_box {
  float: right;
  margin-right: 20px;
  margin-top: 14px;
  vertical-align: middle;
}
.phone_box {
  margin-top: 16px;
  padding-left: 20px;
  .el-radio-group {
    width: 100%;
  }
  .el-radio {
    width: calc(100% - 114px);
    height: 44px;
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
  }
  .el-radio:last-child {
    margin-right: 30px;
  }
}
.edit_btn {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  cursor: pointer;
  margin-left: 15px;
  // position: absolute;
  // right: 56px;
  // top: 13px;
  // z-index: 1000;
}
.delete_btn {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  cursor: pointer;
  margin-left: 10px;
  // position: absolute;
  // right: 20px;
  // top: 13px;
  // z-index: 1000;
}
.addPhone {
  color: #f65800;
  font-size: 14px;
  line-height: 20px;
  padding-left: 32px;
  cursor: pointer;
}
:deep(.el-input__inner) {
  text-align: left;
}
</style>
