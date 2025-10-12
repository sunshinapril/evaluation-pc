<template>
  <div style="text-align: left">
    <el-drawer
      v-model="drawerRight"
      :size="'80%'"
      :direction="'rtl'"
      @close="closeFun"
    >
      <template #header>
        <div>
          <span class="digTitle">客户群统计</span>
          <span class="digTime">更新时间：{{ updateTime() }}</span>
        </div>
      </template>
      <template #default>
        <div class="dataBox">
          <div class="dataItem" v-for="(item, index) in dataT" :key="index">
            <div class="item_text">{{ item.name }}</div>
            <div class="item_num">{{ item.data }}</div>
          </div>
        </div>
        <!-- <div class="btn_box">
          <div
            :class="['btn', selectBtn == 0 ? 'ac' : '']"
            @click="selectFun(0)"
          >
            按客户经理查询
          </div>
          <div
            :class="['btn', selectBtn == 1 ? 'ac' : '']"
            @click="selectFun(1)"
          >
            按日期查询
          </div>
        </div> -->
        <div class="searchBox">
          <span>客户入群明细</span>
          <el-date-picker
            v-model="value1"
            type="daterange"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
          />
          <el-button type="primary" size="small" @click="exportDataFun"
            >导出入群明细</el-button
          >
        </div>
        <div style="margin-top: 11px; height: calc(100% - 177px)">
          <q-table ref="table" :loading="loading" :query="queryTable" border>
            <el-table-column
              label="微信头像"
              width="100"
              align="center"
              prop="userAvatar"
            >
              <template #default="scope">
                <el-image
                  style="width: 40px; height: 40px; border-radius: 50%"
                  :src="scope.row.userAvatar"
                />
              </template>
            </el-table-column>

            <el-table-column
              label="微信昵称"
              min-width="150"
              align="center"
              prop="userName"
            ></el-table-column>
            <el-table-column
              label="手机号"
              min-width="100"
              align="center"
              prop="userPhone"
            >
              <template #default="scope">
                <div>{{ scope.row.userPhone || "--" }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="归属客户经理"
              min-width="180"
              align="center"
              prop="ownerName"
            ></el-table-column>
            <el-table-column
              label="归属营业部"
              min-width="180"
              align="center"
              prop="followerDeptName"
            ></el-table-column>
            <el-table-column
              label="添加时间"
              width="180"
              align="center"
              prop="createtime"
            >
              <template #default="scope">
                <div>{{ returnTime(scope.row.joinTime) }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              width="120"
              align="center"
              prop="isDel"
            >
              <template #default="scope">
                <div>{{ scope.row.isDel == 0 ? "在群里" : "已退群" }}</div>
              </template>
            </el-table-column>
          </q-table>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  todaySummary,
  todaySummaryPageList,
  exportData,
} from "@/api/userMessage/wecomUserList";
const drawerRight = ref(false);

const state = ref("");
const confirmClick = (data) => {
  drawerRight.value = true;
  state.value = data;

  todaySummaryData();
  setQuery();
  // updateTime();
};

const dataT = ref([
  {
    name: "群最新人数",
    data: "0",
  },
  {
    name: "群最新人数",
    data: "0",
  },
  {
    name: "今日退群",
    data: "0",
  },
]);

//客户经理搜索
const value1 = ref("");
const currentTime = ref("");
const closeFun = () => {
  value1.value = [];
};

const updateTime = (time) => {
  const now = time ? new Date(time * 1000) : new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以要加1
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return currentTime.value;
};

const returnTime = (time) => {
  const now = new Date(time * 1000);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 列表数据
const queryTable = ref(null);
const loading = ref(false);
const changeDate = () => {
  console.log(value1.value);
  setQuery();
};
const setQuery = () => {
  queryTable.value = (page, size) => {
    const condition = {
      startDay:
        value1.value && value1.value.length > 0 ? value1.value[0] : null,
      endDay: value1.value && value1.value.length > 0 ? value1.value[1] : null,
      chatId: state.value,
    };
    const params = {
      condition: condition,
      pageNum: page,
      pageSize: size,
    };
    return todaySummaryPageList({
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

const exportDataFun = () => {
  loading.value = true;
  exportData({
    chatId: state.value,
    startDay: value1.value && value1.value.length > 0 ? value1.value[0] : null,
    endDay: value1.value && value1.value.length > 0 ? value1.value[1] : null,
  }).then((res) => {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(new Blob([res.data]));
    link.setAttribute("download", "客户信息.xlsx"); // 设置下载的文件名
    document.body.appendChild(link);
    link.click(); // 触发下载

    // 清理 DOM
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  });
};

// 客户数据
const todaySummaryData = () => {
  todaySummary({ chatId: state.value }).then((res) => {
    if (res.code == 200) {
      dataT.value = [
        {
          name: "群最新人数",
          data: res.date.chatCustTotalCount,
        },
        {
          name: "今日新增",
          data: res.date.custJoinTodayCount,
        },
        {
          name: "今日退群",
          data: res.date.custLossTodayCount,
        },
      ];
    }
  });
};

onMounted(() => {});

defineExpose({ confirmClick });
</script>

<style lang="less" scoped>
:deep(.el-drawer__header) {
  padding: 18px 20px;
  margin-bottom: 0;
  border-bottom: 0.5px solid #dfe6ec;
}
.digTitle {
  display: inline-block;
  color: rgba(0, 0, 0, 0.85);
  font-size: 18px;
  line-height: 25px;
  vertical-align: middle;
  width: 120px;
}
.digTime {
  display: inline-block;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  line-height: 20px;
  vertical-align: middle;
}
.dataBox {
  height: 84px;
  max-width: 1100px;
  display: flex;
  justify-content: left;
  .dataItem {
    width: 233px;
    height: 80px;
    background-color: #fff7f2;
    border-radius: 3px;
    border: 1px solid rgba(246, 88, 0, 0.3);
    margin-right: 30px;
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
  }
}
.btn_box {
  height: 46px;
  border-bottom: 1px solid #dfe6ec;
  display: flex;
  justify-content: left;
  .btn {
    color: rgba(0, 0, 0, 0.65);
    font-size: 16px;
    line-height: 43px;
    border-bottom: 3px solid #fff;
    margin-right: 40px;
    cursor: pointer;
  }
  .ac {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    border-bottom: 3px solid #f65800;
  }
}
.searchBox {
  height: 32px;
  margin-top: 24px;
  span {
    color: rgba(0, 0, 0, 0.85);
    font-size: 18px;
    line-height: 32px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 30px;
  }
  .el-button {
    float: right;
    margin-top: 4px;
  }
}
.table-container {
  height: 100%;
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
</style>
