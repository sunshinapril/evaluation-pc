<template>
  <div style="padding-right: 24px">
    <div class="kh_box">
      <div class="kh_top">
        <span class="m_line"></span>
        <span class="m_title">银行绑定</span>
        <div class="text_box">
          <span class="info_text">资产账号：</span>
          <span class="info_content">{{ dataObj.assetAccount }}</span>
        </div>
      </div>
      <div style="margin-top: 15px">
        <q-table ref="table" :loading="false" :query="queryTable" border>
          <el-table-column
            label="序号"
            width="80"
            align="left"
            type="index"
          ></el-table-column>
          <el-table-column
            label="银期绑定银行"
            min-width="120"
            align="left"
            prop="bankName"
          ></el-table-column>
          <el-table-column
            label="银行账号"
            min-width="120"
            align="left"
            prop="bankAccount"
          ></el-table-column>
          <el-table-column
            label="绑定时间"
            min-width="120"
            align="left"
            prop="bindingTime"
          ></el-table-column>
          <el-table-column
            label="解约时间"
            min-width="120"
            align="left"
            prop="unbindingTime"
          ></el-table-column>
        </q-table>
      </div>
    </div>
    <div class="kh_box">
      <div class="kh_top">
        <span class="m_line"></span>
        <span class="m_title">出入金记录</span>
        <div class="text_box">
          <span class="info_text">转账限制：</span>
          <span class="info_content">{{ dataObj.transferLimit }}</span>
          <!-- <span class="info_yy"
            >限制原因：因银行卡业务冻结，该期银绑定的期货账户被限制住转账，错误码520</span
          > -->
        </div>
      </div>
      <div class="btnBox">
        <div @click="selectFun(1)" :class="[selectIndex == 1 ? 'ac' : 'nol']">
          实时流水
        </div>
        <div @click="selectFun(2)" :class="[selectIndex == 2 ? 'ac' : 'nol']">
          历史记录
        </div>
      </div>
      <div style="margin-top: 15px">
        <q-table ref="table" :loading="loading2" :query="queryTable2" border>
          <el-table-column
            label="交易日"
            min-width="180"
            align="left"
            prop="transactionDate"
          ></el-table-column>
          <el-table-column
            label="时间"
            min-width="120"
            align="left"
            prop="time"
          ></el-table-column>
          <el-table-column
            label="客户名称"
            min-width="120"
            align="left"
            prop="custName"
          ></el-table-column>
          <el-table-column
            label="出入金类型"
            min-width="120"
            align="left"
            prop="inOutType"
          ></el-table-column>
          <el-table-column
            label="出入金方向"
            min-width="120"
            align="left"
            prop="direction"
          ></el-table-column>
          <el-table-column
            label="金额"
            min-width="120"
            align="left"
            prop="amount"
          ></el-table-column>
          <el-table-column
            label="币种"
            min-width="120"
            align="left"
            prop="currency"
          ></el-table-column>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { linkList } from "@/api/leadgen/wecomLink";
import { findBindBankCard } from "@/api/userMessage/userDetail";
const props = defineProps({ externalUserId: String, clueId: String });
const dataObj = ref({});
const findCustAccountsFun = () => {
  findBindBankCard({
    externalUserId: props.externalUserId,
    clueId: props.clueId,
  }).then((res) => {
    if (res.code == 200) {
      dataObj.value = res.date;
      setQuery();
      setQuery2();
    }
  });
};

const queryTable = ref(null);
const queryTable2 = ref(null);
const loading = ref(false);
const loading2 = ref(false);

const selectIndex = ref(1);
const selectFun = (index) => {
  selectIndex.value = index;
  setQuery2();
};

const setQuery = () => {
  queryTable.value = (page, size) => {
    const params = {
      condition: {},
      pageNum: page,
      pageSize: size,
    };
    return linkList({
      ...params,
    })
      .then((res) => {
        loading.value = false;
        return {
          data: dataObj.value.bankBindingRecords,
        };
      })
      .catch(() => {
        console.log("res");
        loading.value = false;
      });
  };
};

const setQuery2 = () => {
  queryTable2.value = (page, size) => {
    const params = {
      condition: {},
      pageNum: page,
      pageSize: size,
    };
    return linkList({
      ...params,
    })
      .then((res) => {
        loading2.value = false;
        return {
          data:
            selectIndex.value == 2
              ? dataObj.value.historyInOutRecords
              : dataObj.value.inOutRecords,
        };
      })
      .catch(() => {
        console.log("res");
        loading2.value = false;
      });
  };
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
:deep(.el-table__empty-block) {
  min-height: 200px !important;
}
</style>
