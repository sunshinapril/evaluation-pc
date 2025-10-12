<template>
  <div style="padding-left: 24px;padding-top: 14px;">
    <div class="btn_box">
      <div
        :class="['btn_item', isActiveBtn == 1 ? 'ac' : 'nol']"
        @click="isActiveFun(1)"
      >
        开户资料
      </div>
      <div
        :class="['btn_item', isActiveBtn == 2 ? 'ac' : 'nol']"
        @click="isActiveFun(2)"
      >
        银行信息
      </div>
      <div
        :class="['btn_item', isActiveBtn == 3 ? 'ac' : 'nol']"
        @click="isActiveFun(3)"
      >
        品种权限
      </div>
    </div>
    <openAccount
      v-if="isActiveBtn == 1"
      :externalUserId="externalUserId"
      :clueId="clueId"
    ></openAccount>
    <bankInfo
      v-if="isActiveBtn == 2"
      :externalUserId="externalUserId"
      :clueId="clueId"
    ></bankInfo>
    <productPerm
      v-if="isActiveBtn == 3"
      :externalUserId="externalUserId"
      :clueId="clueId"
    ></productPerm>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import openAccount from "./assetAccount/openAccount.vue";
import bankInfo from "./assetAccount/bankInfo.vue";
import productPerm from "./assetAccount/productPerm.vue";
import { findCustAccounts } from "@/api/userMessage/userDetail";
const props = defineProps({ externalUserId: String, clueId: String });

const isActiveBtn = ref("1");
const isActiveFun = (index) => {
  isActiveBtn.value = index;
};

// 页面数据
const khzlData = ref();
const yhxxData = ref();
const pzqxData = ref();
const findCustAccountsFun = () => {
  findCustAccounts({
    externalUserId: props.externalUserId,
    clueId: props.clueId,
  }).then((res) => {
    if (res.code == 200) {
      khzlData.value = res.date.accountOpenInfo;
      yhxxData.value = res.date.bankFuturesInfo;
      pzqxData.value = res.date.productAccessInfo;
    }
  });
};
onMounted(() => {
  findCustAccountsFun();
});
</script>

<style lang="less" scoped>
.btn_box {
  height: 35px;
  display: flex;
  justify-content: left;
  margin-top: 12px;
  margin-bottom: 20px;
  .btn_item {
    border-radius: 2px;
    font-size: 16px;
    line-height: 22px;
    padding: 6px 20px;
    cursor: pointer;
    margin-right: 15px;
  }
  .nol {
    border: 1px solid #e0e0e0;
    background: #fafafa;
    color: rgba(0, 0, 0, 0.85);
  }
  .ac {
    border: 1px solid #f65800;
    background: #fff7f3;
    color: #f65800;
    font-weight: 600;
  }
}
</style>
