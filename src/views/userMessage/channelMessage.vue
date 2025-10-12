<template>
  <div class="content">
    <div class="content_left">
      <div class="m_top">
        <span class="m_line"></span>
        <span class="m_title">平台分类</span>
      </div>
      <div
        :class="['clue_item', isSelectIndex == index ? 'acSty' : 'nolSty']"
        v-for="(item, index) in clueTypeList"
        :key="index"
        @click="isSelectFun(index)"
      >
        {{ item.platformName }}
        <!-- ({{ item.number }}) -->
      </div>
    </div>
    <div class="table_box">
      <div class="title_box">
        <div>
          <span class="title_text">渠道列表</span>
          <span class="top_info">共计0个渠道 </span>
        </div>
        <div class="searchBox">
          <el-button type="primary" size="small" @click="newChannelFun('')"
            >新建渠道</el-button
          >
        </div>
      </div>
      <div class="table_top">
        <el-table
          border
          :data="dataObj"
          style="width: 100%; overflow-y: auto"
          height="250"
          :header-cell-style="headerCellStyle"
        >
          <el-table-column prop="channelId" label="渠道ID" min-width="180" />
          <el-table-column prop="channelName" label="渠道名称" min-width="180">
          </el-table-column>
          <el-table-column prop="openFeeRate" label="管理员" min-width="180">
          </el-table-column>

          <el-table-column
            prop="validClueNum"
            label="有效/总数"
            min-width="180"
          >
            <template #default="scope">
              <div v-if="scope.row.totalClueNum">
                {{ scope.row.validClueNum || 0 }}/{{ scope.row.totalClueNum }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalReceiveClueNum"
            label="累计接收条数"
            min-width="180"
          >
          </el-table-column>
          <el-table-column
            prop="lastReceiveClueTime"
            label="最新一条线索接收时间"
            min-width="180"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            width="250"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="changeChannel(scope.row)"
                >线索清单</el-button
              >
              <el-button
                type="primary"
                size="small"
                @click="newChannelFun(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="primary"
                size="small"
                @click="deleteFun(scope.row.channelId)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="title_box" style="margin-top: 25px">
        <div>
          <span class="title_text"
            >{{ selectChannel.channelName }}-线索清单</span
          >
          <span class="top_info">共计18999条线索 今日新推160条 </span>
        </div>
        <div class="searchBox">
          <el-date-picker
            style="margin-right: 20px"
            v-model="value1"
            type="daterange"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <!-- <el-button size="small" @click="isOpen = !isOpen"
          >{{ isOpen ? "收起" : "展开" }}
          <el-icon v-if="isOpen" class="el-icon--right"><ArrowUp /></el-icon>
          <el-icon v-else class="el-icon--right"><ArrowDown /></el-icon>
        </el-button> -->
          <el-button type="primary" size="small" @click="setQuery"
            >查询</el-button
          >
          <el-button size="small" @click="reset">重置</el-button>
          <el-button type="primary" size="small" @click="exportDataFun"
            >列表导出</el-button
          >
        </div>
      </div>

      <q-table
        style="margin-top: 8px"
        ref="table"
        :loading="loading"
        :query="queryTable"
        border
      >
        <el-table-column
          label="第三方平台线索ID"
          min-width="100"
          align="left"
          prop="thirdAdId"
        ></el-table-column>
        <el-table-column
          label="本系统线索ID"
          min-width="190"
          align="left"
          prop="clueId"
        ></el-table-column>
        <el-table-column
          label="客户来源"
          min-width="200"
          align="left"
          prop="custSource"
        ></el-table-column>
        <el-table-column
          label="线索名称"
          min-width="120"
          align="left"
          prop="custName"
        >
          <!-- <template #default="scope">
            <div class="custName" @click="dataFun(null, scope.row.id)">
              {{ scope.row.custName }}
            </div>
          </template> -->
        </el-table-column>
        <el-table-column
          label="客户手机号"
          min-width="120"
          align="left"
          prop="custPhone"
        ></el-table-column>
        <el-table-column
          label="线索推送时间"
          min-width="180"
          align="center"
          prop="ctime"
        ></el-table-column>

        <el-table-column
          label="导入状态"
          min-width="150"
          align="center"
          prop="clueStatus"
        >
          <template #default="scope">
            <div>{{ statusList(scope.row.clueStatus) }}</div>
          </template></el-table-column
        >
        <el-table-column
          label="是否派单"
          min-width="150"
          align="center"
          prop="clueStatus"
        >
          <template #default="scope">
            <div>已派单</div>
          </template></el-table-column
        >
      </q-table>
    </div>
    <dataDetail ref="dataDetails"></dataDetail>
    <newChannel
      ref="newChannelRef"
      :findChannelListFun="findChannelListFun"
    ></newChannel>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";

import {
  findAllPtList,
  findChannelList,
  pageClueList,
  delClueChannel,
  clueExportJl,
} from "@/api/userMessage/channelMessage";
import dataDetail from "./components/dataDetail.vue";
import newChannel from "./components/newChannel.vue";

const headerCellStyle = () => {
  return {
    background: "#f5f7fa",
    color: "#111316",
    fontSize: "14px",
    fontWeight: 600,
  };
};

// 线索状态列表
const isSelectIndex = ref(0);
const dataObj = ref([]);
const queryTable = ref(null);
const loading = ref(false);
const clueTypeList = ref([]);
const isSelectFun = (index) => {
  isSelectIndex.value = index;
  findChannelListFun();
};

// 平台分裂列表
const findAllPtListFun = () => {
  findAllPtList().then((res) => {
    if (res.code == 200) {
      clueTypeList.value = res.date;
      findChannelListFun();
    }
  });
};

// 渠道列表
const selectChannel = ref({});
const findChannelListFun = () => {
  findChannelList({
    platformId: clueTypeList.value[isSelectIndex.value].platformId,
  }).then((res) => {
    if (res.code == 200) {
      dataObj.value = res.date || [];
      selectChannel.value = dataObj.value[0] || "";
      setQuery();
    }
  });
};
const changeChannel = (item) => {
  selectChannel.value = item;
  setQuery();
};

// 删除
const deleteFun = (id) => {
  ElMessageBox.confirm("确定删除吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "error",
  })
    .then(() => {
      delClueChannel({
        channelId: id,
      }).then((res) => {
        if (res.code == 200) {
          ElMessage.success("删除成功");
          findChannelListFun();
        }
      });
    })
    .catch(() => {
      // console.log("用户点击了取消");
    });
};

const exportDataFun = () => {
  loading.value = true;
  clueExportJl({
    channelId: selectChannel.value.channelId,
    startDay: value1.value && value1.value.length > 0 ? value1.value[0] : null,
    endDay: value1.value && value1.value.length > 0 ? value1.value[1] : null,
  }).then((res) => {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(new Blob([res.data]));
    link.setAttribute(
      "download",
      selectChannel.value.channelName + "-线索清单.xlsx"
    ); // 设置下载的文件名
    document.body.appendChild(link);
    link.click(); // 触发下载

    // 清理 DOM
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  });
};

// 列表数据
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

const setQuery = () => {
  queryTable.value = (page, size) => {
    const condition = {
      channelId: selectChannel.value.channelId,
      startDay:
        value1.value && value1.value.length > 0 ? value1.value[0] : null,
      endDay: value1.value && value1.value.length > 0 ? value1.value[1] : null,
    };
    const params = {
      condition: condition,
      pageNum: page,
      pageSize: size,
    };
    return pageClueList({
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

// 新建渠道
const newChannelRef = ref();
const newChannelFun = (item) => {
  newChannelRef.value.handleOpen(
    item,
    clueTypeList.value[isSelectIndex.value].platformId
  );
};

onMounted(() => {
  findAllPtListFun();
});
</script>
<style lang="less" scoped>
.content {
  height: calc(100% - 20px);
  display: flex;
  justify-content: space-between;
  .title_box {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  width: calc(100% - 200px);
  height: 100%;
  // flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-left: 20px;
}
.searchBox {
  text-align: left;
  .el-select,
  .el-input {
    width: 247px;
    margin-right: 20px;
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

.table_top {
  margin-top: 20px;
}
:deep(.el-table__empty-block) {
  min-height: 200px !important;
}
</style>
