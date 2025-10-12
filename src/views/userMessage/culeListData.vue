<template>
  <div class="content">
    <div class="btnBox">
      <div @click="selectFun(1)" :class="[selectIndex == 1 ? 'ac' : 'nol']">
        全部线索
      </div>
      <div @click="selectFun(2)" :class="[selectIndex == 2 ? 'ac' : 'nol']">
        线索公海
      </div>
    </div>
    <div class="searchBox">
      <el-input v-model="custName" placeholder="线索名称" />
      <el-input v-model="custPhone" placeholder="手机号" />
      <el-select v-model="custSource" placeholder="渠道来源">
        <el-option
          v-for="(item, index) in chartList"
          :key="index"
          :label="item.deptName"
          :value="item.deptId"
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
        start-placeholder="开始日期"
        end-placeholder="结束日期"
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

      <el-button size="small" @click="isOpen = !isOpen"
        >{{ isOpen ? "收起" : "展开" }}
        <el-icon v-if="isOpen" class="el-icon--right"><ArrowUp /></el-icon>
        <el-icon v-else class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <el-button type="primary" size="small" @click="setQuery">查询</el-button>
      <el-button size="small" @click="reset">重置</el-button>
    </div>
    <div class="dashboard-container">
      <q-pure-table
        :columns="columns"
        :dataList="dataList"
        :total="total"
        title="线索管理"
        @refresh="onSearch"
        @pagination-change="paginationChange"
        @selection-change="handleSelectionChange"
        border
      >
        <template #buttons>
          <el-button type="primary" size="small" @click="newCuleFun"
            >新建线索</el-button
          >
          <el-button type="primary" size="small" @click="clueSeasHB"
            >线索合并</el-button
          >
          <el-button type="primary" size="small" @click="handDistributeFun"
            >手动派发</el-button
          >
          <el-button type="primary" plain size="small" @click="uploadFileFun"
            >批量导入</el-button
          >
          <el-button type="primary" plain size="small" @click="exportDataFun"
            >导出列表</el-button
          >
        </template>
        <template #followName="{ row }">
          <div>{{ row.followName }}</div>
        </template>
        <!-- <template #operation="{ row }">
          <el-button type="primary" size="small" @click="edit(row)"
            >编辑</el-button
          >
          <el-button type="primary" size="small" @click="edit(row)"
            >编辑</el-button
          >
        </template> -->
      </q-pure-table>
    </div>
    <uploadFile ref="uploadFileRef"></uploadFile>
    <newCule ref="newCuleRef"></newCule>
    <handDistribute ref="handDistributeRef"></handDistribute>
    <clueSeasDig ref="clueSeas" :setQuery="setQuery"></clueSeasDig>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { smsPageList, qwList, smsDelete } from "@/api/taskCenter/smsMessage";
import { sourceList, clueStatusList } from "@/api/userMessage/clueSeas";

import {
  findClueListByPhoneName,
  exportData,
} from "@/api/userMessage/culeListData";
import { userList } from "@/api/leadgen/channelCode";
import uploadFile from "./components/uploadFile.vue";
import newCule from "./components/newCule.vue";
import handDistribute from "./components/handDistribute.vue";
import clueSeasDig from "./components/clueSeasDig.vue";
import { ArrowUp, ArrowDown } from "@element-plus/icons-vue";
import moment from "moment";

const selectIndex = ref(1);
const selectFun = (index) => {
  selectIndex.value = index;
  setQuery();
};

// 列表数据
const loading = ref(false);
const isOpen = ref(false);

// 搜索字段
const custName = ref(null);
const custPhone = ref(null);
const custSource = ref(null);
const clueStatus = ref(null);
const pageNum = ref(1);
const pageSize = ref(20);
const value1 = ref("");

const isAccountOpen = ref(null);
const intentLevel = ref(null);
const isBindQwCust = ref(null);
const isFunded = ref(null);
const isTradingActive = ref(null);

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

// 列表配置
const selectable = ref([]);
const columns = ref([
  // {
  //   type: "selection",
  //   label: "全选",
  //   width: 55,
  //   hide: false,
  //   align: "center",
  //   fixed: "left",
  // },
  {
    label: "线索名称",
    prop: "custName",
    minWidth: 100,
    hide: false,
    fixed: "left",
  },
  {
    label: "手机号",
    prop: "custPhone",
    minWidth: 120,
    hide: false,
  },
  {
    label: "线索状态",
    prop: "custStatus",
    minWidth: 150,
    hide: false,
    formatter: ({ custStatus }) => {
      return custStatus == 0
        ? "潜在客户"
        : custStatus == 1
        ? "已联系"
        : "已删好友";
    },
  },
  {
    label: "分配客户经理",
    prop: "followName",
    minWidth: 150,
    hide: false,
    slot: "followName",
  },
  {
    label: "客户来源",
    prop: "custSource",
    minWidth: 150,
    hide: false,
  },
  {
    label: "入库时间",
    prop: "ctime",
    minWidth: 150,
    hide: false,
    formatter: ({ ctime }) => moment(ctime).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    label: "意向等级",
    prop: "intentLevel",
    minWidth: 150,
    hide: false,
  },
  {
    label: "是否开户",
    prop: "isAccountOpen",
    minWidth: 150,
    hide: false,
    formatter: ({ isAccountOpen }) => {
      return isAccountOpen == 1 ? "已开户" : "未开户";
    },
  },
  {
    label: "是否加企微",
    prop: "isBindQwCust",
    minWidth: 150,
    hide: false,
    formatter: ({ isBindQwCust }) => {
      return isBindQwCust == 1 ? "是" : "否";
    },
  },
  {
    label: "是否入金",
    prop: "isFunded",
    minWidth: 150,
    hide: false,
    formatter: ({ isFunded }) => {
      return isFunded == 1 ? "是" : "否";
    },
  },
  {
    label: "是否交易",
    prop: "isTradingActive",
    minWidth: 150,
    hide: false,
    formatter: ({ isTradingActive }) => {
      return isTradingActive == 1 ? "是" : "否";
    },
  },
  // {
  //   label: "操作",
  //   fixed: "right",
  //   slot: "operation",
  //   minWidth: 250,
  // },
]);
const dataList = ref([]);

const handleSelectionChange = (e) => {
  console.log(e);
};

const total = ref(100);

const paginationChange = (data) => {
  console.log(data);
  pageSize.value = data.pageSize;
  pageNum.value = data.currentPage;
  setQuery();
};
const onSearch = () => {
  console.log("search");
};

// 线索合并
const clueSeas = ref();
const clueSeasHB = () => {
  clueSeas.value.confirmClick();
};

// 批量导入
const uploadFileRef = ref();
const uploadFileFun = (item) => {
  uploadFileRef.value.handleOpen(item);
};

// 新建线索
const newCuleRef = ref();
const newCuleFun = () => {
  newCuleRef.value.handleOpen();
};

// 手动分配
const handDistributeRef = ref();
const handDistributeFun = () => {
  handDistributeRef.value.handleOpen();
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

const setQuery = () => {
  const condition = {
    custName: custName.value,
    custPhone: custPhone.value,
    custSource: custPhone.value,
    clueStatus: clueStatus.value,

    isAccountOpen: isAccountOpen.value,
    intentLevel: intentLevel.value,
    isBindQwCust: isBindQwCust.value,
    isFunded: isFunded.value,
    isTradingActive: isTradingActive.value,
  };
  const params = {
    condition: condition,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
  };
  findClueListByPhoneName({
    ...params,
  })
    .then((res) => {
      loading.value = false;
      dataList.value = res.date;
      total.value = res.date.length;
    })
    .catch(() => {
      console.log("res");
      loading.value = false;
    });
};

const reset = () => {
  custSource.value = null;
  custName.value = null;
  clueStatus.value = null;
  custPhone.value = null;
  isAccountOpen.value = "";
  intentLevel.value = "";
  isBindQwCust.value = "";
  isFunded.value = "";
  isTradingActive.value = "";
  setQuery();
};

// 抽屉
const addSmsDom = ref();
const addSmsDomFun = (e, item) => {
  addSmsDom.value.confirmClick(e, item);
};

// 历史记录
const summarySmsDom = ref();
const summarySmsDomFun = (e, item) => {
  summarySmsDom.value.confirmClick(e, item);
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

const exportDataFun = () => {
  loading.value = true;
  exportData({
    custName: custName.value,
    custPhone: custPhone.value,
    custSource: custPhone.value,
    clueStatus: clueStatus.value,
    startDay: value1.value && value1.value.length > 0 ? value1.value[0] : null,
    endDay: value1.value && value1.value.length > 0 ? value1.value[1] : null,
  }).then((res) => {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(new Blob([res.data]));
    link.setAttribute("download", "线索列表.xlsx"); // 设置下载的文件名
    document.body.appendChild(link);
    link.click(); // 触发下载

    // 清理 DOM
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  });
};

const deleteCode = (id) => {
  ElMessageBox.confirm("确定删除吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "error",
  })
    .then(() => {
      smsDelete({ templateId: id }).then((res) => {
        if (res.code == 200) {
          ElMessage.success("删除成功");
          setQuery();
        }
      });
    })
    .catch(() => {
      // console.log("用户点击了取消");
    });
};

onMounted(() => {
  sourceListFun();
  clueStatusListFun();
  userListFun();
  setQuery();
  qwListFun();
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
  .el-select,
  .el-input {
    width: 187px;
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
  .box_text {
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    line-height: 22px;
    font-weight: 600;
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
.bh_sty {
  color: #f65800;
  font-size: 14px;
  line-height: 22px;
  word-break: break-all;
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

// 列表
.dashboard-container {
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  .box {
    width: 100%;
    height: 100px;
    background: #ff5658;
    margin: 20px;
    position: sticky;
  }
}
:deep(
    .el-table__body-wrapper .el-table-column--selection > .cell,
    .el-table__header-wrapper .el-table-column--selection > .cell
  ) {
  justify-content: center;
}
</style>
