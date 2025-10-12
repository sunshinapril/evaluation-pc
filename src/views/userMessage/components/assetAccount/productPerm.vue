<template>
  <div style="padding-right: 24px">
    <div class="kh_box">
      <div class="kh_top">
        <span class="m_line"></span>
        <span class="m_title">已开通品种权限</span>
      </div>
    </div>
    <div class="table_box">
      <el-table
        border
        :data="dataObj"
        style="width: 100%"
        :header-cell-style="headerCellStyle"
      >
        <el-table-column prop="exchangeName" label="交易所" min-width="180" />
        <el-table-column prop="productName" label="期权品种" min-width="180">
          <template #default="scope">
            <div
              :class="['itemClass', index != 0 ? 'border_bottom' : '']"
              v-for="(item, index) in scope.row.productList"
              :key="index"
            >
              {{ item.exchangeName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="openFeeRate"
          label="交易所开平手续费"
          min-width="180"
        >
          <template #default="scope">
            <div
              :class="['itemClass', index != 0 ? 'border_bottom' : '']"
              v-for="(item, index) in scope.row.productList"
              :key="index"
            >
              {{ item.openFeeRate.toFixed(2) }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { findGrantProductPerm } from "@/api/userMessage/userDetail";
const props = defineProps({ externalUserId: String, clueId: String });

const headerCellStyle = () => {
  return {
    background: "#f5f7fa",
    color: "#111316",
    fontSize: "14px",
    fontWeight: 600,
  };
};
const dataObj = ref([]);
const dataArr = ref([]);
const findCustAccountsFun = () => {
  findGrantProductPerm({
    externalUserId: props.externalUserId,
    clueId: props.clueId,
  }).then((res) => {
    if (res.code == 200) {
      dataArr.value = res.date.filter((item, index, self) => {
        return (
          index === self.findIndex((t) => t.exchangeCode === item.exchangeCode)
        );
      });
      dataObj.value = dataArr.value.map((item) => {
        return {
          ...item,
          productList: res.date.filter((item1) => {
            return (item.exchangeCode = item1.exchangeCode);
          }),
        };
      });
    }
  });
};

onMounted(() => {
  findCustAccountsFun();
});
</script>

<style lang="less" scoped>
.kh_box {
  padding-top: 10px;
}
.kh_top {
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
}
.text_box {
  margin-top: 20px;
}
.info_yy {
  padding: 4px 8px;
  border-radius: 2px;
  background: #fff7f3;
  color: #f65800;
  font-size: 14px;
  line-height: 20px;
  margin-left: 15px;
}
.info_text {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
  display: inline-block;
}
.info_content {
  display: inline-block;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 22px;
}
.btnBox {
  display: flex;
  justify-content: left;
  height: 40px;
  position: relative;
  margin-top: 10px;
  div {
    height: 100%;
    line-height: 40px;
    margin-right: 24px;
    border-bottom: 4px solid;
    cursor: pointer;
  }
  .nol {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    border-bottom-color: #fff;
  }
  .ac {
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-weight: 600;
    border-bottom-color: #f65800;
  }
  .btnSty {
    position: absolute;
    right: 0;
    top: 16px;
  }
}
.table_box {
  margin-top: 20px;
}
.itemClass {
  width: calc(100% + 24px);
  margin-left: -12px;
  height: 40px;
  line-height: 40px;
  padding: 0 12px;
}
.border_bottom {
  border-top: 1px solid #ebeef5;
}
:deep(.el-table__empty-block) {
  min-height: 200px !important;
}
</style>
