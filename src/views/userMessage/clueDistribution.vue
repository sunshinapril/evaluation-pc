<template>
  <div class="content">
    <div class="dataBox">
      <div class="dataItem" v-for="(item, index) in dataT" :key="index">
        <div class="item_text">{{ item.name }}</div>
        <div class="item_num">
          {{ item.data
          }}<span class="item_num2" v-if="item.data2 > -1"
            >/{{ item.data2 }}</span
          >
        </div>
        <img class="img_bg" :src="item.img" alt="" />
      </div>
    </div>
    <div class="searchBox">
      <el-input v-model="custName" placeholder="客户名称" />
      <el-input v-model="custRemark" placeholder="客户备注" />
      <el-select v-model="tagId" placeholder="客户标签">
        <el-option
          v-for="(item, index) in codeList"
          :key="index"
          :label="item.name"
          :value="item.tagId"
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
        style="margin-right: 20px; margin-top: 20px"
        v-model="value1"
        type="daterange"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
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
        prop="linkName"
      ></el-table-column>
      <el-table-column
        label="客户备注"
        min-width="120"
        align="left"
        prop="linkName"
      ></el-table-column>
      <el-table-column
        label="所属负责人"
        min-width="120"
        align="left"
        prop="linkName"
      ></el-table-column>

      <el-table-column
        label="所属客群"
        min-width="120"
        align="left"
        prop="linkName"
      ></el-table-column>
      <el-table-column
        label="客户画像标签"
        min-width="120"
        align="left"
        prop="linkName"
      ></el-table-column>
      <el-table-column
        label="客户状态"
        min-width="120"
        align="left"
        prop="linkName"
      ></el-table-column>
      <el-table-column
        label="渠道来源"
        min-width="120"
        align="left"
        prop="linkName"
      ></el-table-column>
      <el-table-column
        label="添加时间"
        min-width="150"
        align="center"
        prop="ctime"
      ></el-table-column>
    </q-table>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { oceanPageList, culeOceanSummary } from "@/api/userMessage/clueSeas";
import { codeAllList } from "@/api/userMessage/codeMessage";
import { allChannelList, userList } from "@/api/leadgen/channelCode";
import qw_bg1 from "@/assets/images/common/qw_bg1.png";
import qw_bg2 from "@/assets/images/common/qw_bg2.png";

// 列表数据
const queryTable = ref(null);
const loading = ref(false);

const custName = ref(null);
const custRemark = ref(null);
const tagId = ref(null);
const followId = ref(null);

const value1 = ref("");
const dataT = ref([
  {
    name: "线索总数/今日总数",
    data: "0",
    data2: "0",
    img: qw_bg1,
  },
  {
    name: "线索今日净增",
    data: "0",
    img: qw_bg2,
  },
  {
    name: "已转化企业微信客户数",
    data: "0",
    img: qw_bg2,
  },
]);

const setQuery = () => {
  queryTable.value = (page, size) => {
    const condition = {
      custName: custName.value,
      custRemark: custRemark.value,
      tagId: tagId.value,
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
  custName.value = null;
  custRemark.value = null;
  followId.value = null;
  value1.value = "";
  tagId.value = null;
  setQuery();
};

// 渠道列表
const culeOceanSummaryFun = () => {
  culeOceanSummary().then((res) => {
    if (res.code == 200) {
      dataT.value = [
        {
          name: "线索总数/今日总数",
          data: res.date.clueTotalCount,
          data2: res.date.todayClueTotalCount,
          img: qw_bg1,
        },
        {
          name: "线索今日净增",
          data: res.date.todayClueNetIncreaseCount,
          img: qw_bg2,
        },
        {
          name: "已转化企业微信客户数",
          data: res.date.todayClueConvertedCount,
          img: qw_bg2,
        },
      ];
    }
  });
};

// 统计数据
const channelList = ref([]);
const channelListFun = () => {
  allChannelList().then((res) => {
    if (res.code == 200) {
      channelList.value = res.date;
    }
  });
};

// 标签列表
const codeList = ref([]);
const codeListFun = () => {
  codeAllList().then((res) => {
    if (res.code == 200) {
      codeList.value = res.date;
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
  culeOceanSummaryFun();
  codeListFun();
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
      .item_num2 {
        color: rgba(0, 0, 0, 0.85);
        font-size: 20px;
        line-height: 28px;
      }
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
</style>
