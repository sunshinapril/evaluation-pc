<template>
  <div class="content">
    <div class="dataBox">
      <div class="dataItem" v-for="(item, index) in dataT" :key="index">
        <div class="item_text">{{ item.name }}</div>
        <div class="item_num">{{ item.data }}</div>
        <!-- <img class="img_bg" :src="item.img" alt="" /> -->
      </div>
    </div>
    <div class="searchBox">
      <el-select v-model="channelId" placeholder="客户群">
        <el-option
          v-for="(item, index) in channelList"
          :key="index"
          :label="item.name"
          :value="item.chatId"
        />
      </el-select>
      <el-select v-model="userId" placeholder="群主归属">
        <el-option
          v-for="(item, index) in userListArr"
          :key="index"
          :label="item.name"
          :value="item.userid"
        />
      </el-select>
      <el-button type="primary" size="small" @click="setQuery">查询</el-button>
      <el-button size="small" @click="reset">重置</el-button>
    </div>
    <!-- <div class="btn_box">
      <div class="btn_info">企微获客短链列表</div>
      <el-button type="primary" size="small" @click="updateFun(true, '')"
        >创建短链</el-button
      >
    </div> -->
    <q-table ref="table" :loading="loading" :query="queryTable" border>
      <el-table-column
        label="序号"
        width="80"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column
        label="客户群名称"
        min-width="120"
        align="left"
        prop="name"
      ></el-table-column>
      <el-table-column
        label="群主（客户经理）"
        min-width="120"
        align="left"
        prop="ownerName"
      ></el-table-column>
      <el-table-column
        label="群人数"
        min-width="120"
        align="left"
        prop="totalMemberCount"
      ></el-table-column>
      <el-table-column
        label="今日新增人数"
        min-width="120"
        align="left"
        prop="todayAddMemberCount"
      ></el-table-column>
      <el-table-column
        label="今日流失人数"
        min-width="120"
        align="left"
        prop="todayLossMemberCount"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        min-width="150"
        align="center"
        prop="createTime"
      ></el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="dataFun(scope.row.chatId)"
            >数据报表</el-button
          >
        </template>
      </el-table-column>
    </q-table>
    <dataStatistics ref="dataStatistic"></dataStatistics>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import {
  chatPageList,
  pageSummaryData,
  findAllList,
} from "@/api/userMessage/wecomUserList";
import { userList } from "@/api/leadgen/channelCode";
import dataStatistics from "./components/dataStatistics.vue";
import qw_bg1 from "@/assets/images/common/qw_bg1.png";
import qw_bg2 from "@/assets/images/common/qw_bg2.png";

// 列表数据
const queryTable = ref(null);
const loading = ref(false);

const channelId = ref(null);
const userId = ref(null);
const dataT = ref([
  {
    name: "企业微信群总数",
    data: "0",
    img: qw_bg1,
  },
  {
    name: "今日新增微信群总数",
    data: "0",
    img: qw_bg2,
  },
  {
    name: "今日进群客户数",
    data: "0",
    img: qw_bg2,
  },
  {
    name: "今日退群客户数",
    data: "0",
    img: qw_bg2,
  },
]);

const setQuery = () => {
  queryTable.value = (page, size) => {
    const condition = {
      chatId: channelId.value,
      owner: userId.value,
    };
    const params = {
      condition: condition,
      pageNum: page,
      pageSize: size,
    };
    return chatPageList({
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

// 统计数据
const summaryDataFun = () => {
  pageSummaryData().then((res) => {
    if (res.code == 200) {
      dataT.value = [
        {
          name: "企业微信群总数",
          data: res.date.chatTotalCount,
          img: qw_bg1,
        },
        {
          name: "今日新增微信群总数",
          data: res.date.chatAddTodayCount,
          img: qw_bg2,
        },
        {
          name: "今日进群客户数",
          data: res.date.custJoinTodayCount,
          img: qw_bg2,
        },
        {
          name: "今日退群客户数",
          data: res.date.custLossTodayCount,
          img: qw_bg2,
        },
      ];
    }
  });
};

// 抽屉
const dataStatistic = ref();
const dataFun = (data) => {
  dataStatistic.value.confirmClick(data);
};

const reset = () => {
  channelId.value = null;
  userId.value = null;
  setQuery();
};

// 群列表
const channelList = ref([]);
const channelListFun = () => {
  findAllList().then((res) => {
    if (res.code == 200) {
      channelList.value = res.date;
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
  channelListFun();
  userListFun();
  setQuery();
  summaryDataFun();
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
  justify-content: space-between;
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
  height: 84px;
  display: flex;
  justify-content: left;
  text-align: left;
  min-width: 1100px;
  .dataItem {
    width: 364px;
    height: 80px;
    background-color: #fff7f2;
    border-radius: 3px;
    border: 1px solid rgba(246, 88, 0, 0.3);
    margin-right: 30px;
    position: relative;
    .item_text {
      margin-top: 12px;
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
      top: 11px;
      width: 60px;
      height: 60px;
    }
  }
}
</style>
