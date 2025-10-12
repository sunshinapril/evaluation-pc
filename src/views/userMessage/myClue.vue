<template>
  <div class="content">
    <div class="content_left">
      <div class="m_top">
        <span class="m_line"></span>
        <span class="m_title">线索</span>
      </div>
      <div
        :class="['clue_item', isSelectIndex == index ? 'acSty' : 'nolSty']"
        v-for="(item, index) in clueTypeList"
        :key="index"
        @click="isSelectFun(index)"
      >
        {{ item.codeName }}({{ item.number }})
      </div>
    </div>
    <div class="table_box">
      <div class="title_box">
        <span class="title_text">线索列表</span>
        <span class="top_info"
          >共计{{ mySummaryData.totalClues }}条线索（已跟进{{
            mySummaryData.followedClues
          }}
          未跟进{{ mySummaryData.pendingFollowClues }}），今日新推{{
            mySummaryData.todayNewClues
          }}条
        </span>
      </div>
      <div class="searchBox">
        <el-input v-model="custName" placeholder="客户名称" />
        <el-select v-model="custSource" placeholder="客户来源">
          <el-option
            v-for="(item, index) in sourceListData"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-select v-model="clueStatus" placeholder="线索状态">
          <el-option
            v-for="(value, key) in clueStatusListData"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
        <el-date-picker
          style="margin-right: 20px; margin-top: 20px"
          v-model="value1"
          type="daterange"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          range-separator="至"
          start-placeholder="入库时间起"
          end-placeholder="入库时间止"
        />
        <el-select
          style="width: 130px"
          v-if="isOpen"
          v-model="intentLevel"
          placeholder="意向等级"
        >
          <el-option label="高" value="高" />
          <el-option label="中" value="中" />
          <el-option label="低" value="低" />
        </el-select>
        <el-select
          style="width: 130px"
          v-if="isOpen"
          v-model="isAccountOpen"
          placeholder="是否开户"
        >
          <el-option label="是" :value="1" />
          <el-option label="否" :value="2" />
        </el-select>
        <el-select
          style="width: 130px"
          v-if="isOpen"
          v-model="isBindQwCust"
          placeholder="是否加企微"
        >
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
        <el-select
          style="width: 130px"
          v-if="isOpen"
          v-model="isFunded"
          placeholder="是否入金"
        >
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
        <el-select
          style="width: 130px"
          v-if="isOpen"
          v-model="isTradingActive"
          placeholder="是否交易"
        >
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
        <!-- <el-date-picker
          v-if="isOpen"
          style="margin-right: 20px; margin-top: 20px"
          v-model="value1"
          type="daterange"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          range-separator="至"
          start-placeholder="分配时间起"
          end-placeholder="分配时间止"
        /> -->

        <el-button size="small" @click="isOpen = !isOpen"
          >{{ isOpen ? "收起" : "展开" }}
          <el-icon v-if="isOpen" class="el-icon--right"><ArrowUp /></el-icon>
          <el-icon v-else class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <el-button type="primary" size="small" @click="setQuery"
          >查询</el-button
        >
        <el-button size="small" @click="reset">重置</el-button>
      </div>
      <q-table
        @selection-change="handleSelectionChange"
        ref="table"
        :loading="loading"
        :query="queryTable"
        border
      >
        <!-- <el-table-column align="center" type="selection" width="75" /> -->
        <el-table-column
          label="序号"
          width="80"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column
          label="线索名称"
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
          label="跟进状态"
          min-width="120"
          align="left"
          prop="clueStatus"
        >
          <template #default="scope">
            <div>{{ statusList(scope.row.clueStatus) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="分配客户经理"
          min-width="200"
          align="left"
          prop="followName"
        >
          <template #default="scope">
            <div class="headerBox" v-if="scope.row.followName">
              <img src="../../assets/images/common/header_icon.png" alt="" />
              <span>{{ scope.row.followName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="客户来源"
          min-width="200"
          align="left"
          prop="custSource"
        ></el-table-column>
        <el-table-column
          label="入库时间"
          min-width="180"
          align="center"
          prop="ctime"
        ></el-table-column>

        <el-table-column
          label="意向等级"
          min-width="150"
          align="center"
          prop="intentLevel"
        >
        </el-table-column>
        <el-table-column
          label="是否开户"
          min-width="150"
          align="center"
          prop="isAccountOpen"
        >
          <template #default="scope">
            <div>{{ scope.row.isAccountOpen == 1 ? "是" : "否" }}</div>
          </template></el-table-column
        >
        <el-table-column
          label="是否加企微"
          min-width="150"
          align="center"
          prop="isBindQwCust"
        >
          <template #default="scope">
            <div>{{ scope.row.isBindQwCust == 1 ? "是" : "否" }}</div>
          </template></el-table-column
        >
        <el-table-column
          label="是否入金"
          min-width="150"
          align="center"
          prop="isFunded"
        >
          <template #default="scope">
            <div>{{ scope.row.isFunded == 1 ? "是" : "否" }}</div>
          </template></el-table-column
        >
        <el-table-column
          label="是否交易"
          min-width="150"
          align="center"
          prop="isTradingActive"
        >
          <template #default="scope">
            <div>{{ scope.row.isTradingActive == 1 ? "是" : "否" }}</div>
          </template></el-table-column
        >
      </q-table>
    </div>
    <dataDetail ref="dataDetails"></dataDetail>
    <clueSeasDig ref="clueSeas" :setQuery="setQuery"></clueSeasDig>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { sourceList, clueStatusList } from "@/api/userMessage/clueSeas";

import { myCluePage, mySummary } from "@/api/userMessage/channelMessage";
import dataDetail from "./components/dataDetail.vue";
import clueSeasDig from "./components/clueSeasDig.vue";
import { ArrowUp, ArrowDown } from "@element-plus/icons-vue";

// 线索状态列表
const isSelectIndex = ref(0);
const clueTypeList = ref([
  {
    codeName: "全部线索",
    number: 390,
    followStatus: null,
  },
  {
    codeName: "待跟进",
    number: 3,
    followStatus: 0,
  },
  {
    codeName: "已跟进",
    number: 377,
    followStatus: 1,
  },
]);

// 列表数据
const queryTable = ref(null);
const loading = ref(false);
const isOpen = ref(false);

const custName = ref(null);
const custSource = ref(null);
const clueStatus = ref(null);
const value1 = ref("");
const isAccountOpen = ref(null);
const intentLevel = ref(null);
const isBindQwCust = ref(null);
const isFunded = ref(null);
const isTradingActive = ref(null);
const followStatus = ref(null);

const isSelectFun = (index) => {
  isSelectIndex.value = index;
  followStatus.value = clueTypeList.value[index].followStatus;
  setQuery();
};

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
      startDay:
        value1.value && value1.value.length > 0 ? value1.value[0] : null,
      endDay: value1.value && value1.value.length > 0 ? value1.value[1] : null,
      isAccountOpen: isAccountOpen.value,
      intentLevel: intentLevel.value,
      isBindQwCust: isBindQwCust.value,
      isFunded: isFunded.value,
      isTradingActive: isTradingActive.value,
      followStatus: followStatus.value,
    };
    const params = {
      condition: condition,
      pageNum: page,
      pageSize: size,
    };
    return myCluePage({
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
  isAccountOpen.value = "";
  intentLevel.value = "";
  isBindQwCust.value = "";
  isFunded.value = "";
  isTradingActive.value = "";
  followStatus.value = "";
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

// 统计数据
const mySummaryData = ref({
  totalClues: 0,
  pendingFollowClues: 0,
  followedClues: 0,
  todayNewClues: 0,
});
const mySummaryFun = () => {
  mySummary().then((res) => {
    if (res.code == 200) {
      mySummaryData.value = res.date;
      clueTypeList.value = [
        {
          codeName: "全部线索",
          number: res.date.totalClues || 0,
          followStatus: null,
        },
        {
          codeName: "待跟进",
          number: res.date.pendingFollowClues || 0,
          followStatus: 0,
        },
        {
          codeName: "已跟进",
          number: res.date.followedClues || 0,
          followStatus: 1,
        },
      ];
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

onMounted(() => {
  sourceListFun();
  clueStatusListFun();
  mySummaryFun();
  setQuery();
});
</script>
<style lang="less" scoped>
.content {
  height: calc(100% - 20px);
  display: flex;
  justify-content: space-between;
  .title_box {
    margin-top: 15px;
  }
  .title_text {
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
  }
  .top_info {
    width: 100%;
    // background: #fff7f2;
    padding: 8px;
    margin-left: 4px;
    color: #f65800;
    font-size: 14px;
    text-align: left;
    line-height: 22px;
  }
}
.content_left {
  width: 200px;
  height: calc(100% -15px);
  margin-top: 15px;
  border-right: 0.5px solid #dfe6ec;
  .clue_item {
    width: 176px;
    padding: 10px 20px;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
    margin-right: 20px;
  }
  .nolSty {
    color: rgba(0, 0, 0, 0.85);
    background-color: #fff;
  }
  .acSty {
    background-color: #fff7f3;
    color: #f65800;
  }
}
.table_box {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-left: 20px;
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

//
.m_top {
  position: relative;
  margin-bottom: 16px;
  .m_line {
    width: 4px;
    height: 16px;
    display: inline-block;
    background-color: #f65800;
    vertical-align: middle;
  }
  .m_title {
    display: inline-block;
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    margin-left: 10px;
    vertical-align: middle;
  }
  .el-button {
    position: absolute;
    right: 0;
  }
}
</style>
