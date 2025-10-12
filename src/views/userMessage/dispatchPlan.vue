<template>
  <div class="content">
    <div class="btnBox">
      <div @click="selectFun(1)" :class="[selectIndex == 1 ? 'ac' : 'nol']">
        营业部方案
      </div>
      <div @click="selectFun(2)" :class="[selectIndex == 2 ? 'ac' : 'nol']">
        销售方案
      </div>
    </div>
    <div class="searchBox">
      <el-input v-model="ruleName" placeholder="方案名称" />
      <el-select v-model="channelId" placeholder="渠道搜索">
        <el-option
          v-for="(item, index) in channelList"
          :key="index"
          :label="item.channelName"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="deptId" placeholder="适用营业部">
        <el-option
          v-for="(item, index) in chartList"
          :key="index"
          :label="item.deptName"
          :value="item.deptId"
        />
      </el-select>
      <!-- <el-button size="small" @click="isOpen = !isOpen"
        >{{ isOpen ? "收起" : "展开" }}
        <el-icon v-if="isOpen" class="el-icon--right"><ArrowUp /></el-icon>
        <el-icon v-else class="el-icon--right"><ArrowDown /></el-icon>
      </el-button> -->
      <el-button type="primary" size="small" @click="setQuery">查询</el-button>
      <el-button size="small" @click="reset">重置</el-button>
      <el-button
        type="primary"
        style="float: right; margin-top: 23px"
        size="small"
        @click="newDispatch()"
        >新建派单方案</el-button
      >
    </div>
    <!-- <div class="btn_box">
      <el-button type="primary" size="small" @click="clueSeasHB"
        >线索合并</el-button
      >
    </div> -->
    <q-table ref="table" :loading="loading" :query="queryTable" border>
      <el-table-column
        label="派单方案名称"
        min-width="120"
        align="left"
        prop="ruleName"
      >
        <template #default="scope">
          <div class="custName" @click="dataFun(null, scope.row.id)">
            {{ scope.row.ruleName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="适用平台-渠道"
        min-width="120"
        align="left"
        prop="custPhone"
      ></el-table-column>
      <el-table-column
        v-if="selectIndex == 1"
        label="适用营业部"
        min-width="220"
        align="left"
        prop="sysTags"
      >
        <template #default="scope">
          <div
            class="codeItem"
            v-for="(item, index) in scope.row.sysTags"
            :key="index"
          >
            {{ item.tagName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="适用销售"
        min-width="220"
        align="left"
        prop="sysTags"
      >
        <template #default="scope">
          <div
            class="codeItem"
            v-for="(item, index) in scope.row.sysTags"
            :key="index"
          >
            {{ item.tagName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="方案起止时间"
        min-width="150"
        align="center"
        prop="ctime"
      ></el-table-column>
      <el-table-column
        label="方案创建人"
        min-width="120"
        align="left"
        prop="followName"
      ></el-table-column>
      <el-table-column
        label="方案更新时间"
        min-width="180"
        align="left"
        prop="custSource"
      ></el-table-column>

      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="dataFun(null, scope.row.id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="dataFun(null, scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </q-table>
    <newDispatchPlan
      ref="newDispatchPlanDom"
      :setQuery="setQuery"
    ></newDispatchPlan>
    <dataDetail ref="dataDetails"></dataDetail>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { clueStatusList } from "@/api/userMessage/clueSeas";

import { dispCuleList, deleteDisp } from "@/api/userMessage/culeListData";
import { qwList } from "@/api/taskCenter/smsMessage";
import { allChannelList, userList } from "@/api/leadgen/channelCode";
import newDispatchPlan from "./components/newDispatchPlan.vue";
import dataDetail from "./components/dataDetail.vue";
// import { ArrowUp, ArrowDown } from "@element-plus/icons-vue";

const selectIndex = ref(1);
const selectFun = (index) => {
  selectIndex.value = index;
  setQuery();
};

// 列表数据
const queryTable = ref(null);
const loading = ref(false);
const isOpen = ref(false);

const deptId = ref(null);
const ruleName = ref(null);
const channelId = ref(null);

const statusList = (status) => {
  if (status == "unassigned") {
    return "未分配";
  } else if (status == "assigned") {
    return "已分配";
  } else if (status == "following") {
    return "跟进中";
  } else if (status == "converted") {
    return "已转化";
  } else if (status == "rejected") {
    return "已拒绝";
  } else if (status == "invalid") {
    return "无效线索";
  }
};

const newDispatchPlanDom = ref();
const newDispatch = () => {
  newDispatchPlanDom.value.confirmClick();
};

const setQuery = () => {
  queryTable.value = (page, size) => {
    const condition = {
      ruleName: ruleName.value,
      deptId: deptId.value,
      channelId: channelId.value,
    };
    const params = {
      condition: condition,
      pageNum: page,
      pageSize: size,
    };
    return dispCuleList({
      ...params,
    })
      .then((res) => {
        loading.value = false;
        return {
          data: res.date.data,
          total: res.date.total,
        };
      })
      .catch(() => {
        console.log("res");
        loading.value = false;
      });
  };
};

const reset = () => {
  deptId.value = null;
  ruleName.value = null;
  channelId.value = null;
  setQuery();
};

// 抽屉
const dataDetails = ref();
const dataFun = (externalUserId, clueId) => {
  dataDetails.value.confirmClick(externalUserId, clueId);
};

// 渠道列表
const channelList = ref([]);
const channelListFun = () => {
  allChannelList().then((res) => {
    if (res.code == 200) {
      channelList.value = res.date;
    }
  });
};

// 企业列表
const chartList = ref();
const qwListFun = () => {
  qwList().then((res) => {
    if (res.code == 200) {
      chartList.value = res.date;
    }
  });
};

onMounted(() => {
  qwListFun();
  channelListFun();
  setQuery();
});
</script>
<style lang="less" scoped>
.content {
  height: calc(100% - 20px);
  // flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-align: center;
  .top_info {
    width: 100%;
    background: #fff7f2;
    padding: 8px;
    color: #f65800;
    font-size: 14px;
    text-align: left;
    line-height: 22px;
  }
}
.searchBox {
  text-align: left;
  margin: 0 0 20px 0;
  .el-select,
  .el-input {
    width: 247px;
    margin-right: 20px;
    margin-top: 20px;
  }
  .el-button {
    margin-top: 20px;
  }
}
.btn_box {
  margin: 15px 0;
  display: flex;
  justify-content: left;
  .btn_info {
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    line-height: 22px;
  }
}
:deep(.el-table__empty-block) {
  min-height: 700px;
}
.headerBox {
  padding: 0 8px;
  border-radius: 14px;
  height: 28px;
  border-radius: 20px;
  border: 0.5px solid rgba(0, 0, 0, 0.1);
  background: #f7f7f7;
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 8px;
  img {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
  span {
    vertical-align: middle;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    margin-left: 4px;
  }
}

.dataBox {
  height: 110px;
  display: flex;
  justify-content: left;
  text-align: left;
  min-width: 1100px;
  .dataItem {
    width: 364px;
    height: 102px;
    background-color: #fff7f2;
    border-radius: 3px;
    border: 1px solid rgba(246, 88, 0, 0.3);
    margin-right: 30px;
    position: relative;
    .item_text {
      margin-top: 24px;
      margin-left: 32px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      line-height: 20px;
    }
    .item_num {
      color: rgba(0, 0, 0, 0.85);
      font-size: 30px;
      font-weight: 500;
      line-height: 42px;
      margin-left: 32px;
    }
    .img_bg {
      position: absolute;
      right: 24px;
      top: 21px;
      width: 60px;
      height: 60px;
    }
  }
}
.codeItem {
  border-radius: 2px;
  border: 0.5px solid #fa3;
  background: #fffaf2;
  padding: 5px 8px;
  color: #e58f17;
  font-size: 14px;
  line-height: 17px;
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 8px;
}
.custName {
  cursor: pointer;
  color: #f65800;
  font-size: 14px;
}

.btnBox {
  display: flex;
  justify-content: left;
  border-bottom: 0.5px solid #dfe6ec;
  height: 60px;
  div {
    height: 100%;
    line-height: 60px;
    margin-right: 36px;
    border-bottom: 4px solid;
    cursor: pointer;
  }
  .nol {
    color: rgba(0, 0, 0, 0.65);
    font-size: 18px;
    border-bottom-color: #fff;
  }
  .ac {
    color: rgba(0, 0, 0, 0.85);
    font-size: 18px;
    font-weight: 600;
    border-bottom-color: #f65800;
  }
}
</style>
