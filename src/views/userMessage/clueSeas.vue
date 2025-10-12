<template>
  <div class="content">
    <div class="searchBox">
      <el-input v-model="custName" placeholder="客户名称" />
      <el-select v-if="isOpen" v-model="custSource" placeholder="客户来源">
        <el-option
          v-for="(item, index) in sourceListData"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-select v-if="isOpen" v-model="clueStatus" placeholder="线索状态">
        <el-option
          v-for="(value, key) in clueStatusListData"
          :key="key"
          :label="value"
          :value="key"
        />
      </el-select>
      <el-select v-model="followId" placeholder="所属负责人">
        <el-option
          v-for="(item, index) in userListArr"
          :key="index"
          :label="item.name"
          :value="item.userid"
        />
      </el-select>
      <el-date-picker
        v-if="isOpen"
        style="margin-right: 20px; margin-top: 20px"
        v-model="value1"
        type="daterange"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button size="small" @click="isOpen = !isOpen"
        >{{ isOpen ? "收起" : "展开" }}
        <el-icon v-if="isOpen" class="el-icon--right"><ArrowUp /></el-icon>
        <el-icon v-else class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <el-button type="primary" size="small" @click="setQuery">查询</el-button>
      <el-button size="small" @click="reset">重置</el-button>
    </div>
    <div class="btn_box">
      <!-- <el-button type="primary" size="small" @click="batchAssignFun"
        >分配</el-button
      > -->
      <el-button type="primary" size="small" @click="clueSeasHB"
        >线索合并</el-button
      >
    </div>
    <q-table
      @selection-change="handleSelectionChange"
      ref="table"
      :loading="loading"
      :query="queryTable"
      border
    >
      <el-table-column align="center" type="selection" width="75" />
      <el-table-column
        label="客户名称"
        min-width="120"
        align="left"
        prop="custName"
      >
        <template #default="scope">
          <div class="custName" @click="dataFun(null, scope.row.id)">
            {{ scope.row.custName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="客户手机号"
        min-width="120"
        align="left"
        prop="custPhone"
      ></el-table-column>
      <el-table-column
        label="客户标签"
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
        label="所属负责人"
        min-width="120"
        align="left"
        prop="followName"
      ></el-table-column>
      <el-table-column
        label="所属客群"
        min-width="120"
        align="left"
        prop="custChats"
      ></el-table-column>
      <el-table-column
        label="客户状态"
        min-width="120"
        align="left"
        prop="clueStatus"
      >
        <template #default="scope">
          <div>{{ statusList(scope.row.clueStatus) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="客户来源"
        min-width="120"
        align="left"
        prop="custSource"
      ></el-table-column>
      <el-table-column
        label="添加时间"
        min-width="150"
        align="center"
        prop="ctime"
      ></el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="dataFun(null, scope.row.id)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </q-table>
    <dataDetail ref="dataDetails"></dataDetail>
    <clueSeasDig ref="clueSeas" :setQuery="setQuery"></clueSeasDig>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import {
  oceanPageList,
  sourceList,
  clueStatusList,
} from "@/api/userMessage/clueSeas";
import { userList } from "@/api/leadgen/channelCode";
import dataDetail from "./components/dataDetail.vue";
import clueSeasDig from "./components/clueSeasDig.vue";
import { ArrowUp, ArrowDown } from "@element-plus/icons-vue";

// 列表数据
const queryTable = ref(null);
const loading = ref(false);
const isOpen = ref(false);

const custName = ref(null);
const custSource = ref(null);
const clueStatus = ref(null);
const followId = ref(null);
const value1 = ref("");

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

const clueSeas = ref();
const clueSeasHB = () => {
  clueSeas.value.confirmClick();
};

const setQuery = () => {
  queryTable.value = (page, size) => {
    const condition = {
      custName: custName.value,
      custSource: custSource.value,
      clueStatus: clueStatus.value,
      followId: followId.value,
      startDay:
        value1.value && value1.value.length > 0 ? value1.value[0] : null,
      endDay: value1.value && value1.value.length > 0 ? value1.value[1] : null,
    };
    const params = {
      condition: condition,
      pageNum: page,
      pageSize: size,
    };
    return oceanPageList({
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
  custSource.value = null;
  custName.value = null;
  clueStatus.value = null;
  value1.value = "";
  followId.value = null;
  setQuery();
};

// 抽屉
const dataDetails = ref();
const dataFun = (externalUserId, clueId) => {
  dataDetails.value.confirmClick(externalUserId, clueId);
};

// 来源列表
const sourceListData = ref([]);
const sourceListFun = () => {
  sourceList().then((res) => {
    if (res.code == 200) {
      sourceListData.value = res.date;
    }
  });
};

// 线索状态列表
const clueStatusListData = ref([]);
const clueStatusListFun = () => {
  clueStatusList().then((res) => {
    if (res.code == 200) {
      clueStatusListData.value = res.date;
    }
  });
};

// 分配
const batchAssignList = ref([]);

const handleSelectionChange = (e) => {
  batchAssignList.value = e.map((item) => {
    return item.id;
  });
  console.log(batchAssignList.value);
};

const batchAssignFun = () => {
  // batchAssign({
  //   clueIdList: batchAssignList.value,
  // }).then((res) => {
  //   if (res.code == 200) {
  //     ElMessage.success("分配成功");
  //   }
  // });
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
  sourceListFun();
  clueStatusListFun();
  userListFun();
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
</style>
