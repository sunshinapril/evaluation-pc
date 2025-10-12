<template>
  <div class="content">
    <div class="btnBox">
      <div
        @click="selectFun(index)"
        :class="[selectIndex == index ? 'ac' : 'nol']"
        v-for="(item, index) in tabList"
        :key="index"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="searchBox">
      <el-input v-model="custName" placeholder="规则名称" />
      <!-- <el-select v-model="custSource" placeholder="规则名称">
        <el-option
          v-for="(item, index) in sourceListData"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select> -->
      <el-select v-model="custSource" placeholder="营业部">
        <el-option
          v-for="(item, index) in sourceListData"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-select v-model="clueStatus" placeholder="渠道类型">
        <el-option
          v-for="(item, index) in clueTypeList"
          :key="index"
          :label="item.platformName"
          :value="item.platformId"
        />
      </el-select>
      <!-- <el-button size="small" @click="isOpen = !isOpen"
        >{{ isOpen ? "收起" : "展开" }}
        <el-icon v-if="isOpen" class="el-icon--right"><ArrowUp /></el-icon>
        <el-icon v-else class="el-icon--right"><ArrowDown /></el-icon>
      </el-button> -->
      <el-button type="primary" size="small" @click="setQuery">查询</el-button>
      <el-button size="small" @click="reset">重置</el-button>
      <!-- <el-button
        type="primary"
        style="float: right; margin-top: 23px"
        size="small"
        @click="newDispatch()"
        >新建派单方案</el-button
      > -->
    </div>
    <div class="btn_box">
      <div class="info_title">规则列表</div>
      <div class="btn_item">
        <el-button
          type="primary"
          size="small"
          @click="newRecyclePlanFun(tabList[selectIndex].name)"
          >新建回收规则</el-button
        >
        <el-button type="primary" size="small" plain @click="clueSeasHB"
          >列表导出</el-button
        >
      </div>
    </div>
    <q-table ref="table" :loading="loading" :query="queryTable" border>
      <el-table-column
        label="规则名称"
        min-width="120"
        align="left"
        prop="custName"
      >
      </el-table-column>
      <el-table-column
        label="规则天数"
        min-width="120"
        align="left"
        prop="custPhone"
      ></el-table-column>
      <el-table-column
        v-if="selectIndex == 1"
        label="营业部"
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
        label="渠道类型"
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
        label="创建时间"
        min-width="150"
        align="center"
        prop="ctime"
      ></el-table-column>
      <el-table-column
        label="创建人"
        min-width="120"
        align="left"
        prop="followName"
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
    <newRecyclePlan
      ref="newRecyclePlanDom"
      :setQuery="setQuery"
    ></newRecyclePlan>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import {
  oceanPageList,
  sourceList,
  clueStatusList,
} from "@/api/userMessage/clueSeas";

import {
  findAllPtList,
  findChannelList,
} from "@/api/userMessage/channelMessage";
import { userList } from "@/api/leadgen/channelCode";
import newRecyclePlan from "./components/newRecyclePlan.vue";
// import { ArrowUp, ArrowDown } from "@element-plus/icons-vue";

const tabList = ref([
  { name: "开户回收方案" },
  { name: "入金回收方案" },
  { name: "休眠回收方案" },
  { name: "销户回收方案" },
  { name: "公海自动回收方案" },
]);

const selectIndex = ref(0);
const selectFun = (index) => {
  selectIndex.value = index;
  setQuery();
};

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

const newRecyclePlanDom = ref();
const newRecyclePlanFun = (name) => {
  newRecyclePlanDom.value.confirmClick(name);
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

// 平台分类列表
const clueTypeList = ref([]);
const findAllPtListFun = () => {
  findAllPtList().then((res) => {
    if (res.code == 200) {
      clueTypeList.value = res.date;
    }
  });
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

onMounted(() => {
  findAllPtListFun();

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
  margin: 10px 0 20px 0;
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
  margin: 0 0 15px 0;
  display: flex;
  justify-content: space-between;
  .info_title {
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
  }
  .btn_item {
    display: inline-block;
  }
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
