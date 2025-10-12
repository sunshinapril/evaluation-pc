<template>
  <div style="text-align: left">
    <el-drawer
      v-model="drawerRight"
      :size="'75%'"
      :direction="'rtl'"
      @close="closeFun"
    >
      <template #header>
        <div class="title_top">新建派单</div>
      </template>
      <template #default>
        <!-- <div class="top_info">
          注意：客户群发支持依照客户标签选择可发送范围的设定，设定方可以由发送群消息的成员设定也可以由创建群发人员设定。
        </div> -->
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="auto"
          style="max-width: 950px"
        >
          <div class="title_text" style="margin-bottom: 20px; margin-top: 15px">
            派单方案
          </div>
          <el-form-item label="方案名称" prop="taskName">
            <el-input
              v-model="form.taskName"
              placeholder="填写方案名称"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="适用营业部" prop="taskType">
            <div class="list_box">
              <div
                @click="selectFun(index)"
                v-for="(item, index) in textList"
                :key="index"
                :class="['item', isSelect == index ? 'activeBor' : 'nolBor']"
              >
                <div class="isChose" v-if="isSelect == index">
                  <img src="../../../assets/images/common/dui.png" alt="" />
                </div>
                <div
                  :class="[
                    'top_text',
                    isSelect == index ? 'activeText' : 'nolText',
                  ]"
                >
                  {{ item.name }}
                </div>
                <div class="bottom_text">
                  {{ item.text }}
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="适用日期(可多选)" prop="textContent">
            <div style="width: 100%">
              <el-checkbox-group v-model="form.triggerDays" size="small">
                <el-checkbox label="周一" :value="1" border />
                <el-checkbox label="周二" :value="2" border />
                <el-checkbox label="周三" :value="3" border />
                <el-checkbox label="周四" :value="4" border />
                <el-checkbox label="周五" :value="5" border />
                <el-checkbox label="周六" :value="6" border />
                <el-checkbox label="周七" :value="7" border />
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item
            label="方案时间"
            prop="textContent"
            style="width: 700px"
          >
            <el-date-picker
              v-model="value1"
              type="daterange"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>

          <!-- <el-form-item label="任务描述" prop="textContent">
            <el-input
              v-model="form.textContent"
              type="textarea"
              placeholder="填写任务描述"
              :rows="4"
              maxlength="100"
              show-word-limit
            />
          </el-form-item> -->

          <div
            class="title_text"
            style="margin-bottom: 20px; margin-top: 35px"
            v-if="isSelect == 0"
          >
            渠道-营业部分配规则
          </div>

          <el-form-item
            label="选择分配模式"
            style="width: 700px"
            v-if="isSelect == 0"
          >
            <div style="margin-top: 30px; margin-left: -95px">
              <el-radio-group v-model="form.optSystagType">
                <el-radio :value="1"
                  >自动平均分配（所有线索自动随机分配给所选营业部）</el-radio
                >
                <el-radio :value="2"
                  >手动调整分配（按参数手动调整营业部分配比例）</el-radio
                >
              </el-radio-group>
            </div>
          </el-form-item>

          <el-form-item
            label="设置参数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            style="width: 1100px"
            v-if="isSelect == 0"
          >
            <div class="setBox">
              <div class="setBtn" @click="dispatchPlanBmfun">
                <img src="../../../assets/images/common/set_icon.png" alt="" />
                <span>设置</span>
              </div>
              <el-table
                border
                :data="form.dataTable"
                style="width: 100%; margin-top: 5px"
                :header-cell-style="headerCellStyle"
              >
                <template #empty>
                  <div class="table_box">
                    <img
                      src="../../../assets/images/common/table_bg.png"
                      alt=""
                    />
                    <div>点击【设置按钮】添加参与派单的营业部</div>
                  </div>
                </template>
                <el-table-column
                  prop="exchangeName"
                  label="营业部名称"
                  min-width="250"
                />
                <el-table-column
                  prop="productName"
                  label="优先级"
                  min-width="100"
                >
                </el-table-column>
                <el-table-column
                  prop="openFeeRate"
                  label="分配比例"
                  min-width="100"
                >
                </el-table-column>
                <el-table-column
                  prop="openFeeRate"
                  label="保有量上限"
                  min-width="100"
                >
                </el-table-column>
                <el-table-column
                  prop="openFeeRate"
                  label="分配开关"
                  min-width="100"
                >
                  <template #default="scope">
                    <el-switch
                      v-model="scope.row.openFp"
                      inline-prompt
                      active-text="开"
                      inactive-text="关"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>

          <div
            class="title_text"
            style="margin-bottom: 20px; margin-top: 35px"
          >
            营业部-销售分配规则
          </div>

          <el-form-item label="" style="margin-left: 35px" v-if="isSelect == 0">
            <div class="select_bm_box">
              <div
                :class="[
                  'bm_item',
                  selsetBmIndex == index ? 'bm_item_ac' : 'bm_item_nol',
                ]"
                v-for="(item, index) in bmList"
                :key="index"
                @click="selsetBmFun(index)"
              >
                {{ item.name }}
              </div>
            </div>
          </el-form-item>

          <el-form-item label="选择分配模式" style="width: 700px">
            <div style="margin-top: 30px; margin-left: -95px">
              <el-radio-group v-model="form.optSystagType">
                <el-radio :value="1"
                  >自动平均分配（所有线索自动随机分配给所选营业部）</el-radio
                >
                <el-radio :value="2"
                  >手动调整分配（按参数手动调整营业部分配比例）</el-radio
                >
              </el-radio-group>
            </div>
          </el-form-item>

          <el-form-item
            label="设置参数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            style="width: 1100px"
          >
            <div class="setBox">
              <div class="setBtn" @click="dispatchPlanXsfun">
                <img src="../../../assets/images/common/set_icon.png" alt="" />
                <span>设置</span>
              </div>
              <el-table
                border
                :data="form.dataTable"
                style="width: 100%; margin-top: 5px"
                :header-cell-style="headerCellStyle"
              >
                <template #empty>
                  <div class="table_box">
                    <img
                      src="../../../assets/images/common/table_bg.png"
                      alt=""
                    />
                    <div>点击【设置按钮】添加参与派单的营业部</div>
                  </div>
                </template>
                <el-table-column
                  prop="exchangeName"
                  label="营业部名称"
                  min-width="250"
                />
                <el-table-column
                  prop="productName"
                  label="销售名称"
                  min-width="100"
                >
                </el-table-column>
                <el-table-column
                  prop="productName"
                  label="优先级"
                  min-width="100"
                >
                </el-table-column>
                <el-table-column
                  prop="openFeeRate"
                  label="分配比例"
                  min-width="100"
                >
                </el-table-column>
                <el-table-column
                  prop="openFeeRate"
                  label="保有量上限"
                  min-width="100"
                >
                </el-table-column>
                <el-table-column
                  prop="openFeeRate"
                  label="分配开关"
                  min-width="100"
                >
                  <template #default="scope">
                    <el-switch
                      v-model="scope.row.openFp"
                      inline-prompt
                      active-text="开"
                      inactive-text="关"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              style="margin-left: 34px"
              @click="onSubmit(1)"
              >保存派单方案</el-button
            >
            <el-button @click="drawerRight = false">取消</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-drawer>
    <dispatchPlanBm ref="dispatchPlanBmRef"></dispatchPlanBm>
    <dispatchPlanXs ref="dispatchPlanXsRef"></dispatchPlanXs>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { cloneDeep } from "lodash";
import dispatchPlanBm from "./dispatchPlanBm.vue";
import dispatchPlanXs from "./dispatchPlanXs.vue";
import {
  saveOrUpdateJob,
  jobDataDetail,
} from "@/api/taskCenter/taskStatistics";

const props = defineProps({ setQuery: Function });

const triggerType = ref(0);
const isEndTime = ref(0);
const value1 = ref("");
const selsetBmIndex = ref(0);
const bmList = ref([
  {
    name: "上海浦东大道营业部",
    type: "1",
  },
  {
    name: "北京王府井营业部",
    type: "2",
  },
]);

const selsetBmFun = (index) => {
  selsetBmIndex.value = index;
};

const dispatchPlanBmRef = ref();
const dispatchPlanBmfun = () => {
  dispatchPlanBmRef.value.handleOpen();
};

const dispatchPlanXsRef = ref();
const dispatchPlanXsfun = () => {
  dispatchPlanXsRef.value.handleOpen();
};

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

const headerCellStyle = () => {
  return {
    background: "#f5f7fa",
    color: "#111316",
    fontSize: "14px",
    fontWeight: 600,
  };
};

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

const confirmClick = (e, taskId) => {
  isNew.value = e;
  drawerRight.value = true;
  if (taskId) {
    jobDataDetailFun(taskId);
  }
};

// 任务数据
const jobDataDetailFun = (taskId) => {
  jobDataDetail({ taskId: taskId }).then((res) => {
    if (res.code == 200) {
      console.log(res.date);
      form.value = cloneDeep(res.date);
      isSelect.value = form.value.taskType - 1;
      if (form.value.smsTemplateId) {
        form.value.smsTemplateId =
          res.date.smsTemplateId + "," + res.date.tempContent;
      }

      if (form.value.qwUserInfoList) {
        form.value.qwUserInfoList = res.date.qwUserInfoList.map((item1) => {
          return item1.userId + "," + item1.userName;
        });
      }

      if (form.value.sysTags) {
        form.value.sysTags = res.date.sysTags.map((item1) => {
          return item1.tagId + "," + item1.tagName;
        });
      }

      isEndTime.value = form.value.endTime ? 1 : 0;
      triggerType.value = form.value.triggerType == 1 ? 1 : 0;
    }
  });
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

const textList = [
  {
    name: "分配至营业部再二次分配",
    text: "分配至营业部公海再转派给员工，整个流程需设定2层逻辑",
  },
  {
    name: "直接分配给员工",
    text: "每位销售设定权重，同时设定保有量上限",
  },
];
const selectFun = (index) => {
  isSelect.value = index;
  form.value.taskType = index + 1;
  if (index == 1) {
  }
  if (index != 2) {
    form.value.optSystagType = 1;
  }
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
.list_box {
  width: 570px;
  display: flex;
  justify-content: space-between;
  .item {
    width: 267px;
    height: 108px;
    border-radius: 2px;
    padding: 12px;
    position: relative;
    cursor: pointer;
    .isChose {
      position: absolute;
      width: 12px;
      height: 12px;
      right: 0;
      top: 0;
      background-color: #f65800;
      border-radius: 0px 1.5px 0px 0px;
      img {
        position: absolute;
        width: 9px;
        height: 9px;
        top: 1.5px;
        left: 1.5px;
      }
    }
    .top_text {
      font-size: 14px;
      line-height: 20px;
      font-weight: 600;
    }
    .bottom_text {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      line-height: 20px;
      margin-top: 4px;
    }
  }
  .activeBor {
    border: 1px solid #f65800;
  }
  .nolBor {
    border: 1px solid #d9d9d9;
  }
  .activeText {
    color: #f65800;
  }
  .nolText {
    color: rgba(0, 0, 0, 0.85);
  }
}
.sc_info {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 20px;
  margin-left: 110px;
  margin-bottom: 5px;
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
.top_info {
  width: 100%;
  background: #fff7f2;
  padding: 8px 20px;
  color: #f65800;
  font-size: 14px;
  text-align: left;
  line-height: 22px;
  margin-bottom: 30px;
}
.el-checkbox {
  margin-right: 15px;
  padding: 6px 16px 6px 12px !important;
}
:deep(.el-checkbox__inner) {
  display: none;
}
.exportBox {
  margin-top: 8px;
  width: 338px;
  height: 160px;
  border-radius: 4px;
  border: 1px dashed #d9d9d9;
  text-align: center;
  cursor: pointer;
  img {
    width: 48px;
    height: 48px;
    margin-top: 28px;
  }
  .exportBox_text {
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 20px;
  }
  .exportBox_info {
    margin-top: 5px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 20px;
  }
}
.down_text {
  color: #f65800;
  font-size: 14px;
  line-height: 20px;
  margin-top: 5px;
  width: 338px;
  cursor: pointer;
  text-align: center;
}
.setBox {
  width: 1000px;
  margin-left: -95px;
  text-align: right;
}
.setBtn {
  display: inline-block;
  padding: 0 12px;
  border-radius: 4px;
  border: 1px solid #cfd0e1;
  cursor: pointer;
  img {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
  span {
    color: rgba(0, 0, 0, 0.85);
    text-align: center;
    font-size: 14px;
    vertical-align: middle;
  }
}
.el-input {
  width: 570px;
}

// table
.table_box {
  line-height: 0;
  display: inline-block;
  img {
    width: 80px;
    height: 80px;
    margin-top: 20px;
  }
  div {
    height: 20px;
    margin-top: 0;
    line-height: 20px;
  }
}
:deep(.el-table__empty-block) {
  min-height: 150px !important;
}
.select_bm_box {
  display: flex;
  justify-content: left;
  .bm_item {
    margin-right: 12px;
    padding: 6px 20px;
    line-height: 20px;
    border-radius: 2px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  .bm_item_ac {
    border: 1px solid #f65800;
    background: #fff7f3;
    color: #f65800;
  }
  .bm_item_nol {
    border: 1px solid #e0e0e0;
    background: #fafafa;
    color: #000;
  }
}
</style>
