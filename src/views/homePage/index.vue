<template>
  <div class="home-page">
    <el-form class="query-container" label-position="top" inline>
      <el-form-item props="date" label="时间筛选">
        <el-date-picker
          class="date-picker"
          v-model="queryParams.date"
          type="daterange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
        <el-button style="margin-left: 12px" type="primary">搜索</el-button>
        <el-button>导出</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="table-header">孕产期妇女抑郁症筛查</div>
      <el-table
        class="table-body"
        :data="list"
        :span-method="spanMethod"
        border
        :cell-class-name="cellClassName"
      >
        <el-table-column prop="index" label="编号" width="180" />
        <el-table-column prop="project" label="项目" width="180" />
        <el-table-column prop="type" label="类型" width="90" align="center" />
        <el-table-column prop="city" label="天目" width="180" />
        <el-table-column prop="city2" label="北站" width="180" />
        <el-table-column prop="city2" label="宝山" width="180" />
        <el-table-column prop="city2" label="大宁" width="180" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { cloneDeep } from "lodash";
const defaultQueryParams = {
  date: [],
};
const queryParams = ref(cloneDeep(defaultQueryParams));
const list = ref([
  {
    index: 1,
    project: "孕期筛查",
    type: "评估数",
    city: "100",
    city2: "100",
  },
  {
    index: 2,
    project: "孕期筛查",
    type: "阳性数",
    city: "100",
    city2: "100",
  },
  {
    index: 3,
    project: "孕期筛查",
    type: "转诊数",
    city: "100",
    city2: "100",
  },
  {
    index: 4,
    project: "孕期筛查",
    type: "拒诊数",
    city: "100",
    city2: "100",
  },
  {
    index: 5,
    project: "孕期筛查",
    type: "评估数",
    city: "100",
    city2: "100",
  },
  {
    index: 6,
    project: "孕期筛查",
    type: "阳性数",
    city: "100",
    city2: "100",
  },
  {
    index: 7,
    project: "孕期筛查",
    type: "转诊数",
    city: "100",
    city2: "100",
  },
  {
    index: 8,
    project: "孕期筛查",
    type: "拒诊数",
    city: "100",
    city2: "100",
  },
  {
    index: 9,
    project: "孕期筛查",
    type: "评估数",
    city: "100",
    city2: "100",
  },
  {
    index: 10,
    project: "孕期筛查",
    type: "阳性数",
    city: "100",
    city2: "100",
  },
  {
    index: 11,
    project: "孕期筛查",
    type: "转诊数",
    city: "100",
    city2: "100",
  },
  {
    index: 12,
    project: "孕期筛查",
    type: "拒诊数",
    city: "100",
    city2: "100",
  },
]);


/*
【rowIndex， columnIndex】
[1,1]表示不变
[0,0]表示删除此单元格
[2,1]表示表格向下合并一个单元格
[1,2]表示表格向右合并一个单元格
*/
const spanMethod = ({
  rowIndex,
  columnIndex,
}) => {
  if(columnIndex === 1) {
    if(rowIndex % 4 === 0) {
      return {
        rowspan: 4,
        colspan: 1
      }
    }
    return {
      rowspan: 0,
      colspan: 0
    }
  }
  return {
    rowspan: 1,
    colspan: 1
  }
}

const cellClassName = ({ column, columnIndex, row, rowIndex }) => {
  if (columnIndex == 2) {
    if (row.type == "评估数") {
      return "success-row";
    }
    if (row.type == "阳性数") {
      return "danger-row";
    }
    if (row.type == "转诊数") {
      return "warning-row";
    }
    if (row.type == "拒诊数") {
      return "purple-row";
    }
    return "";
  }
  return "";
};
</script>

<style lang="less" scoped>
.home-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .query-container {
    flex-shrink: 0;
    padding: 24px 35px 6px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
    .date-picker {
      width: 225px !important;
    }
  }
  .table-container {
    flex: 1;
    overflow: hidden;
    margin-top: 20px;
    padding: 16px 15px;
    border-radius: 4px;
    background: #fff;
    display: flex;
    flex-direction: column;
    .table-header {
      flex-shrink: 0;
      line-height: 21px;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      position: relative;
      padding-left: 18px;
      margin-bottom: 16px;
      &::before {
        content: "";
        width: 8px;
        height: 23px;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        background: #4f8df5;
      }
    }
    .table-body {
      flex: 1;
      overflow: hidden;
      overflow-y: auto;
    }

    :deep(.el-table--enable-row-hover) {
      .el-table__body tr:hover > td.el-table__cell {
        background: #ffbebe !important;
      }
    }
  }
}
</style>
<style>
.success-row {
  background: #ebffe7 !important;
}
.danger-row {
  background: #ffbebe !important;
}
.warning-row {
  background: #ffd1a0 !important;
}
.purple-row {
  background: #eac1ff !important;
}
</style>
