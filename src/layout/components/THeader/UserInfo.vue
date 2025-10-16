<template>
  <div class="right-menu">

    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <div class="user-avatar">
          <img :src="avatar" class="user-avatar-img" />
        </div>
        <!-- <div class="user-name">{{ userInfo.userName }}</div> -->
        <el-icon :size="18" style="color: rgba(0, 0, 0, 0.65)">
          <CaretBottom />
        </el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click.native="openDialog">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dialog v-model="dialogVisible" title="修改密码" width="500px" center>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px"> 
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" placeholder="请确认新密码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { CaretBottom } from "@element-plus/icons-vue";
import avatar from "@/assets/images/user/avatar.png";
import useUser from "@/store/modules/user";
import { computed, ref } from "vue";
import { cloneDeep } from "lodash";
const logout = () => {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    await useUser().logout();
    location.href = "/login";
  });
};

const defaultForm = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const form = ref(cloneDeep(defaultForm));
const dialogVisible = ref(false);
const rules = {
  oldPassword: [
    {
      required: true,
      message: "请输入旧密码",
      trigger: "blur",
    },
  ],
  newPassword: [
    {
      required: true,
      message: "请输入新密码",
      trigger: "blur",
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: "请确认新密码",
      trigger: "blur",
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入确认密码"));
        } else if (value !== form.value.newPassword) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
    }
  ]
}

const openDialog = () => {
  form.value = cloneDeep(defaultForm);
  dialogVisible.value = true;
};
const formRef = ref(null);
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      dialogVisible.value = false;

      // updatePassword(form.value).then((res) => {
      //   ElMessage.success("修改密码成功");
      //   dialogVisible.value = false;
      // })
    }
  })
};



</script>

<style scoped lang="less">
.right-menu {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  .right-menu-item {
    padding: 0 8px;
    font-size: 18px;
    color: #ffffff;
    vertical-align: middle;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-right: 22px;
    .svg-icon {
      width: 20px;
      height: 20px;
      vertical-align: middle;
      margin-right: 5px;
    }
    .message-text {
      height: 20px;
      font-size: 14px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.85);
    }
    .red-dot {
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50% 50%;
      background-color: red;
      position: absolute;
      top: 8px;
      left: 21px;
    }
  }
  .avatar-container {
    cursor: pointer;
    .avatar-wrapper {
      position: relative;
      color: #fff;
      display: flex;
      align-items: center;
      .user-avatar {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(172, 171, 202, 0.1);
        border: 1px solid #acabca;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        margin-right: 8px;
        .user-avatar-img {
          width: 80%;
          height: 80%;
        }
      }
      .user-name {
        font-size: 14px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.85);

      }
    }
  }
}
</style>
