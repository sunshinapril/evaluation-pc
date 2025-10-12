<template>
  <div style="text-align: left">
    <el-drawer
      v-model="drawerRight"
      :size="'60%'"
      :direction="'rtl'"
      @close="closeFun"
    >
      <template #header>
        <div class="title_top">新建{{ title }}</div>
      </template>
      <template #default>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="auto"
          style="max-width: 950px"
        >
          <el-form-item label="方案名称" prop="taskName">
            <el-input
              v-model="form.taskName"
              placeholder="填写方案名称"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="触发回收(天)" prop="taskName">
            <el-input
              v-model="form.taskName"
              placeholder="请输入正整数"
              maxlength="100"
              show-word-limit
            />
            <div class="info_text">
              <span>客户下发业务人员后，在您填入的天数（含）依然未开户</span>
              ，则客户自动回收至全量线索池，可重新分配
            </div>
          </el-form-item>

          <div class="channel_box">
            <div class="form_box" v-for="(item, index) in bmData" :key="index">
              <el-form-item label="营业部">
                <el-select
                  v-model="item.deptId"
                  placeholder="请选择营业部"
                  style="width: 220px"
                >
                  <el-option
                    v-for="(item, index) in deptList"
                    :key="index"
                    :label="item.deptName"
                    :value="item.deptId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="渠道类型">
                <el-select
                  v-model="item.deptId"
                  placeholder="请选择渠道类型"
                  style="width: 220px"
                >
                  <el-option
                    v-for="(item, index) in item.channelList"
                    :key="index"
                    :label="item.channelName"
                    :value="item.channelId"
                  />
                </el-select>
              </el-form-item>
              <img
                v-if="index !== 0"
                @click="deleteBtn(index)"
                class="deleteBtn"
                src="../../../assets/images/common/delete_icon.png"
                alt=""
              />
            </div>
            <div class="addBtn" @click="addBtn">+ 新建</div>
          </div>

          <el-form-item>
            <el-button
              type="primary"
              style="margin-left: 102px"
              @click="onSubmit(1)"
              >确认</el-button
            >
            <el-button @click="drawerRight = false">取消</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { cloneDeep } from "lodash";
import { saveOrUpdateJob } from "@/api/taskCenter/taskStatistics";

const props = defineProps({ setQuery: Function });

const title = ref("");

const deptList = ref([]);
const bmData = ref([
  {
    deptId: 213,
    deptName: "是的",
    channelId: 123,
    channelName: "撒旦",
    channelList: [],
  },
  {
    deptId: 213,
    deptName: "是的",
    channelId: 123,
    channelName: "撒旦",
    channelList: [],
  },
]);
const deleteBtn = (index) => {
  bmData.value.splice(index, 1);
};
const addBtn = () => {
  bmData.value.push({
    deptId: 213,
    deptName: "是的",
    channelId: 123,
    channelName: "撒旦",
    channelList: [],
  });
};

const triggerType = ref(0);
const isEndTime = ref(0);
const value1 = ref("");

const drawerRight = ref(false);
const isNew = ref(false);
const formRef = ref();
const form = ref({
  taskType: 1,
  taskName: "",
  textContent: "",
  mediaIds: [],
  smsTemplateId: "",
  tempContent: "",
  sysTags: [],
  triggerType: 2,
  triggerDays: [],
  startTime: "",
  endTime: "",
  qwUserInfoList: [],
  optSystagType: 1,
  dataTable: [],
});

const rules = ref({
  taskType: [{ required: true, message: "请选择任务类型", trigger: "blur" }],
  taskName: [{ required: true, message: "请填写任务名称", trigger: "blur" }],
  smsTemplateId: [
    { required: true, message: "请选择任务模板", trigger: "blur" },
  ],
  qwUserInfoList: [
    { required: true, message: "请选择客户经理", trigger: "blur" },
  ],
  textContent: [{ required: true, message: "请输入任务描述", trigger: "blur" }],
  triggerType: [{ required: true, message: "请选择执行方式", trigger: "blur" }],
  mediaIds: [{ required: true, message: "请选择素材", trigger: "blur" }],
  startTime: [{ required: true, message: "请选择触发时间", trigger: "blur" }],
  sysTags: [{ required: true, message: "请选择系统标签", trigger: "blur" }],
  optSystagType: [{ required: true, message: "", trigger: "blur" }],
});

const confirmClick = (name) => {
  title.value = name;
  drawerRight.value = true;
};

const isSelect = ref(0);
const closeFun = () => {
  formRef.value.resetFields();
  value1.value = "";
  form.value = {
    taskType: 1,
    taskName: "",
    taskRemark: "",
    mediaIds: [],
    smsTemplateId: "",
    sysTags: [],
    triggerType: 2,
    triggerDays: [],
    startTime: "",
    endTime: "",
    qwUserInfoList: [],
    optSystagType: 1,
  };
  drawerRight.value = false;
  triggerType.value = 0;
  isEndTime.value = 0;
  isSelect.value = 0;
};

const onSubmit = () => {
  const dataObj = cloneDeep(form.value);

  dataObj.smsTemplateId = form.value.smsTemplateId
    ? form.value.smsTemplateId.split(",")[0]
    : "";

  if (dataObj.qwUserInfoList) {
    dataObj.qwUserInfoList = form.value.qwUserInfoList.map((item) => {
      return {
        userId: item.split(",")[0],
        userName: item.split(",")[1],
      };
    });
  }
  if (dataObj.sysTags) {
    dataObj.sysTags = form.value.sysTags.map((item) => {
      return {
        tagId: item.split(",")[0],
        tagName: item.split(",")[1],
      };
    });
  }
  if (dataObj.triggerDays) {
    dataObj.triggerDays.sort((old, New) => {
      return old - New;
    });
  }

  dataObj.triggerType =
    form.value.triggerType && triggerType.value == 0
      ? form.value.triggerType
      : triggerType.value;
  console.log(dataObj);
  formRef.value.validate((valid) => {
    if (valid) {
      saveOrUpdateJob(dataObj).then((res) => {
        console.log(res);
        if (res.code == 200) {
          props.setQuery();
          closeFun();
          ElMessage.success(isNew.value ? "创建成功" : "编辑成功");
        }
      });
    }
  });
};
onMounted(() => {
  // userAllListFun();
});
defineExpose({ confirmClick });
</script>

<style lang="less" scoped>
:deep(.el-drawer__body) {
  padding-top: 0;
  padding-left: 40px;
}
:deep(.el-drawer__header) {
  padding-left: 40px;
}
.title_top {
  height: 16px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: 600;
  line-height: 16px;
  padding-left: 8px;
}
.title_text {
  height: 16px;
  border-left: 3px solid #f65800;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: 600;
  line-height: 16px;
  padding-left: 8px;
}
// .el-form {
//   max-width: 980px !important;
// }
:deep(.el-form-item__label) {
  color: #000;
}
.el-input {
  width: 570px;
}
.info_text {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 20px;
  margin-top: 10px;
  width: 570px;
  span {
    color: #f5222d;
    font-size: 14px;
    line-height: 20px;
  }
}
.channel_box {
  background-color: #f7f7f7;
  padding: 20px 0;
  width: 700px;
  margin-bottom: 20px;
  .form_box {
    display: flex;
    justify-content: left;
    .deleteBtn {
      width: 16px;
      height: 16px;
      margin-left: 20px;
      margin-top: 8px;
      cursor: pointer;
    }
  }
  .addBtn {
    width: 540px;
    height: 32px;
    margin-left: 103px;
    background-color: #fff;
    color: #f65800;
    font-size: 14px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
