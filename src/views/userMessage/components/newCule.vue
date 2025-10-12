<template>
  <div>
    <el-dialog
      style="text-align: left"
      v-model="dialogVisible"
      :title="title"
      width="800"
      :before-close="handleClose"
    >
      <template #header>
        <div class="my_header">
          {{ title }}
        </div>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="手机号码" prop="custPhone">
          <el-input v-model="form.custPhone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="渠道类型" prop="platformId">
          <el-select
            v-model="form.platformId"
            placeholder="选择渠道类型"
            @change="changePlatform"
          >
            <el-option
              v-for="(item, index) in clueTypeList"
              :key="index"
              :label="item.platformName"
              :value="item.platformId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道名称" prop="channelId">
          <el-select v-model="form.channelId" placeholder="选择渠道">
            <el-option
              v-for="(item, index) in channelListData"
              :key="index"
              :label="item.channelName"
              :value="item.channelId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="custName">
          <el-input v-model="form.custName" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="unionID" prop="unionID">
          <el-input v-model="form.unionID" placeholder="请输入unionID" />
        </el-form-item>
        <el-form-item label="客户状态" prop="clueStatus">
          <el-select v-model="form.clueStatus" placeholder="请选择客户状态部">
            <el-option
              v-for="(item, index) in clueStatusList"
              :key="index"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="营业部" prop="deptId">
          <el-select v-model="form.deptId" placeholder="请选择营业部">
            <el-option
              v-for="(item, index) in chartList"
              :key="index"
              :label="item.deptName"
              :value="item.deptId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="销售人员" prop="userid">
          <el-select v-model="form.userid" placeholder="请选择销售人员">
            <el-option
              v-for="(item, index) in userListArr"
              :key="index"
              :label="item.name"
              :value="item.userid"
            />
          </el-select>
        </el-form-item>
        <!--  -->
        <el-form-item label="资源时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY-MM-DD"
            time-format="HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择资源时间"
          />
        </el-form-item>

        <el-form-item label="推广类型" prop="tagList">
          <el-select v-model="form.mergeByClueId" placeholder="请选择推广类型">
            <el-option
              v-for="(item, index) in clueTypeList"
              :key="index"
              :label="item.platformName"
              :value="item.platformId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否添加微信" prop="isBindQwCust">
          <el-select v-model="form.isBindQwCust" placeholder="请选择">
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
        </el-form-item>

        <!-- 缺字段 -->
        <el-form-item label="标签" prop="tagList">
          <el-select v-model="form.mergeByClueId" placeholder="请选择标签">
            <el-option
              v-for="(item, index) in tagList"
              :key="index"
              :label="item.tagName"
              :value="item.tagId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="资金账号" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入资金账号" />
        </el-form-item>
        <el-form-item label="激活金额" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入激活金额" />
        </el-form-item>
        <el-form-item label="激活日期" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY-MM-DD"
            time-format="HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择激活日期"
          />
        </el-form-item>
        <el-form-item label="号码归属地" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入号码归属地" />
        </el-form-item>
        <el-form-item label="首次跟进时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY-MM-DD"
            time-format="HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择首次跟进时间"
          />
        </el-form-item>
        <el-form-item label="跟进次数" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入跟进次数" />
        </el-form-item>
        <el-form-item label="最近跟进时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY-MM-DD"
            time-format="HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择最近跟进时间"
          />
        </el-form-item>
        <el-form-item label="最近通话状态" prop="tagList">
          <el-select v-model="form.mergeByClueId" placeholder="请选择">
            <el-option
              v-for="(item, index) in chartList"
              :key="index"
              :label="item.custName"
              :value="JSON.stringify(item)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item label="搜索词" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入搜索词" />
        </el-form-item>

        <el-form-item label="计划" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入计划" />
        </el-form-item>
        <el-form-item label="单元" prop="groupName">
          <el-input
            v-model="form.groupName"
            placeholder="请输入单元"
          /> </el-form-item
        ><el-form-item label="省份" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入省份" />
        </el-form-item>
        <el-form-item label="城市" prop="groupName">
          <el-input
            v-model="form.groupName"
            placeholder="请输入城市"
          /> </el-form-item
        ><el-form-item label="IP" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入IP" />
        </el-form-item>
        <el-form-item label="落地页URL" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入落地页URL" />
        </el-form-item>

        <el-form-item label="首次外呼接通状态" prop="tagList">
          <el-select v-model="form.mergeByClueId" placeholder="请选择">
            <el-option
              v-for="(item, index) in chartList"
              :key="index"
              :label="item.custName"
              :value="JSON.stringify(item)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入备注" />
        </el-form-item>
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
import { ref, onMounted } from "vue";
import { groupUpdate } from "@/api/userMessage/codeMessage";
import {
  findAllPtList,
  findChannelList,
} from "@/api/userMessage/channelMessage";
import { qwList } from "@/api/taskCenter/smsMessage";
import { userList } from "@/api/leadgen/channelCode";
import { saveClue } from "@/api/userMessage/culeListData";

import { cloneDeep } from "lodash";
const props = defineProps({ codeListFun: Function });

const clueStatusList = [
  { code: "unassigned", name: "未分配" },
  { code: "assigned", name: "已分配" },
  { code: "following", name: "跟进中" },
  { code: "converted", name: "已转化" },
  { code: "rejected", name: "已拒绝" },
  { code: "invalid", name: "无效线索" },
];
const tagList = ref([]);

const dialogVisible = ref(false);
const formRef = ref();
const title = ref("新建线索");
const form = ref({
  custPhone: "",
  platformId: "",
  channelId: "",
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

// 平台分类列表
const clueTypeList = ref([]);
const findAllPtListFun = () => {
  findAllPtList().then((res) => {
    if (res.code == 200) {
      clueTypeList.value = res.date;
    }
  });
};
const changePlatform = () => {
  findChannelListFun();
};
// 渠道列表
const channelListData = ref();
const findChannelListFun = () => {
  findChannelList({
    platformId: form.value.platformId,
  }).then((res) => {
    if (res.code == 200) {
      channelListData.value = res.date || [];
    }
  });
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
// 客户经理（员工）列表
const userListArr = ref([]);
const userListFun = () => {
  const data = {
    condition: {},
    pageNum: 1,
    pageSize: 1000,
  };
  userList(data).then((res) => {
    if (res.code == 200) {
      userListArr.value = res.date.data;
    }
  });
};

onMounted(() => {
  findAllPtListFun();
  qwListFun();
  userListFun();
});

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
  width: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
}
.el-form-item {
  width: 360px;
  margin-right: 20px;
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
