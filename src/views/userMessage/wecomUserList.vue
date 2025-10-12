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
      <el-input v-model="custName" placeholder="客户名称" />
      <el-input v-if="isOpen" v-model="custRemark" placeholder="客户备注" />
      <el-select v-if="isOpen" v-model="custTagId" placeholder="客户标签">
        <el-option
          v-for="(item, index) in channelList"
          :key="index"
          :label="item.name"
          :value="item.tagId"
        />
      </el-select>
      <el-select v-model="currFollower" placeholder="主联系人">
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
        label="客户名称"
        min-width="120"
        align="left"
        prop="custName"
      >
        <template #default="scope">
          <div
            class="custName"
            @click="dataFun(scope.row.externalUserId, null)"
          >
            {{ scope.row.custName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="客户备注"
        min-width="120"
        align="left"
        prop="custRemark"
      ></el-table-column>
      <el-table-column
        label="主联系人"
        min-width="200"
        align="left"
        prop="currFollowerName"
      >
        <template #default="scope">
          <div class="headerBox">
            <img src="../../assets/images/common/header_icon.png" alt="" />
            <span>{{ scope.row.currFollowerName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="次联系人"
        min-width="200"
        align="left"
        prop="otherFollowers"
      >
        <template #default="scope">
          <div
            class="headerBox"
            v-for="(item, index) in scope.row.otherFollowers"
            :key="index"
          >
            <img src="../../assets/images/common/header_icon.png" alt="" />
            <span>{{ item.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="所属客群"
        min-width="120"
        align="left"
        prop="cstChatNames"
      >
        <template #default="scope">
          <div
            class="chatDiv"
            v-for="(item, index) in scope.row.cstChatNames"
            :key="index"
          >
            {{ item
            }}<span v-if="item && index != scope.row.cstChatNames.length - 1"
              >，</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="企微标签"
        min-width="200"
        align="left"
        prop="qwTags"
      >
        <template #default="scope">
          <div
            class="codeItem"
            v-for="(item, index) in scope.row.qwTags"
            :key="index"
          >
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="渠道来源"
        min-width="120"
        align="left"
        prop="addWayDetail"
      ></el-table-column>
      <el-table-column
        label="添加时间"
        min-width="180"
        align="center"
        prop="ctime"
      ></el-table-column>
    </q-table>
    <dataDetail ref="dataDetails"></dataDetail>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { linkList, summaryData } from "@/api/userMessage/wecomUserList";
import { followtagList, userList } from "@/api/leadgen/channelCode";
import dataDetail from "./components/dataDetail.vue";
import qw_bg1 from "@/assets/images/common/qw_bg1.png";
import qw_bg2 from "@/assets/images/common/qw_bg2.png";
import { ArrowUp, ArrowDown } from "@element-plus/icons-vue";

// 列表数据
const queryTable = ref(null);
const loading = ref(false);
const isOpen = ref(false);

const custRemark = ref("");
const custName = ref("");
const custTagId = ref("");
const currFollower = ref("");
const value1 = ref("");
const dataT = ref([
  {
    name: "企业微信客户总数",
    data: "0",
    img: qw_bg1,
  },
  {
    name: "今日净增客户数",
    data: "0",
    img: qw_bg2,
  },
  {
    name: "留存客户数",
    data: "0",
    img: qw_bg2,
  },
  {
    name: "流失客户数",
    data: "0",
    img: qw_bg2,
  },
]);

const setQuery = () => {
  queryTable.value = (page, size) => {
    const condition = {
      custName: custName.value,
      custRemark: custRemark.value,
      custTagId: custTagId.value,
      currFollower: currFollower.value,
      startTime:
        value1.value && value1.value.length > 0 ? value1.value[0] : null,
      endTime: value1.value && value1.value.length > 0 ? value1.value[1] : null,
    };
    const params = {
      condition: condition,
      pageNum: page,
      pageSize: size,
    };
    return linkList({
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
  custName.value = "";
  custRemark.value = "";
  custTagId.value = "";
  currFollower.value = "";
  value1.value = [];
  setQuery();
};

// 抽屉
const dataDetails = ref();
const dataFun = (externalUserId, clueId) => {
  dataDetails.value.confirmClick(externalUserId, clueId);
};

// 标签列表
const channelList = ref([]);
const channelListFun = () => {
  followtagList().then((res) => {
    if (res.code == 200) {
      channelList.value = res.date;
    }
  });
};

// 统计数据
const dataTop = ref([]);
const summaryDataFun = () => {
  summaryData().then((res) => {
    if (res.code == 200) {
      dataTop.value = res.date;
      dataT.value = [
        {
          name: "企业微信客户总数",
          data: res.date.totalCustCount,
          img: qw_bg1,
        },
        {
          name: "今日净增客户数",
          data: res.date.netIncreaseToday,
          img: qw_bg2,
        },
        {
          name: "留存客户数",
          data: res.date.retainedCustCount,
          img: qw_bg2,
        },
        {
          name: "流失客户数",
          data: res.date.lostCustCount,
          img: qw_bg2,
        },
      ];
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
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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
.chatDiv {
  display: inline-block;
}
.custName {
  cursor: pointer;
  color: #f65800;
  font-size: 14px;
}
</style>
