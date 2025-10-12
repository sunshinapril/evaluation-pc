<template>
  <div class="content_box" style="padding-right: 24px; padding-bottom: 40px">
    <div class="kh_box">
      <div class="kh_top">
        <span class="m_line"></span>
        <span class="m_title">开户信息</span>
      </div>
      <div class="m_title" style="margin-top: 24px">-基本资料</div>
      <div class="descriptions_box">
        <el-descriptions
          class="margin-top"
          :column="2"
          label-width="130px"
          size="default"
          border
        >
          <el-descriptions-item label="性别">
            {{ dataObj.gender }}
          </el-descriptions-item>
          <el-descriptions-item label="国籍">
            {{ dataObj.nationality }}
          </el-descriptions-item>
          <el-descriptions-item label="开户营业部">
            {{ dataObj.openAccountDept }}
          </el-descriptions-item>
          <el-descriptions-item label="年龄">{{
            dataObj.age
          }}</el-descriptions-item>
          <el-descriptions-item label="风险评测时间">
            {{ dataObj.riskAssessmentTime }}
          </el-descriptions-item>
          <el-descriptions-item label="学历">
            {{ dataObj.education }}
          </el-descriptions-item>
          <el-descriptions-item label="业务类型">
            {{ dataObj.businessType }}
          </el-descriptions-item>
          <el-descriptions-item label="受理单号">
            {{ dataObj.receiptNumber }}
          </el-descriptions-item>
          <el-descriptions-item label="证件地址">
            {{ dataObj.idAddress }}
          </el-descriptions-item>
          <el-descriptions-item label="联系地址">
            {{ dataObj.contactAddress }}
          </el-descriptions-item>
          <el-descriptions-item label="注册电话">
            {{ dataObj.registerPhone }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ dataObj.contactPhone }}
          </el-descriptions-item>
          <el-descriptions-item label="交易者适当性分类">
            {{ dataObj.investorClassification }}
          </el-descriptions-item>
          <el-descriptions-item label="身份证有效期限">
            {{ dataObj.idCardValidity }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <div class="kh_box">
      <div class="m_title" style="margin-top: 24px">-开通的账户</div>
      <div class="descriptions_box">
        <el-descriptions
          class="margin-top"
          :column="1"
          label-width="130px"
          size="default"
          border
        >
          <el-descriptions-item label="资金账号">
            {{ dataObj.fundAccount }}
          </el-descriptions-item>
          <el-descriptions-item label="本次选择的期货账户">
            {{ dataObj.selectedFuturesAccounts }}
          </el-descriptions-item>
          <el-descriptions-item label="开通成功的期货账户"
            ><div class="info_content">
              {{ dataObj.successFuturesAccounts }}
            </div></el-descriptions-item
          >
          <!-- <el-descriptions-item label="次联系人"
            >{{ dataObj.idCardValidity }}</el-descriptions-item
          > -->
        </el-descriptions>
      </div>
    </div>
    <div class="kh_box">
      <div class="m_title" style="margin-top: 24px">-风险评测结果</div>
      <div class="descriptions_box">
        <el-descriptions
          class="margin-top"
          :column="2"
          label-width="130px"
          size="default"
          border
        >
          <el-descriptions-item label="投资者适当性分类">
            普通
            <!-- {{ dataObj.successFuturesAccounts }} -->
          </el-descriptions-item>
          <el-descriptions-item label="试题名称">
            {{ dataObj.riskQuestionTitle }}
          </el-descriptions-item>
          <el-descriptions-item label="得分">
            {{ dataObj.score }}</el-descriptions-item
          >
          <el-descriptions-item label="风险等级">
            {{ dataObj.riskLevel }}</el-descriptions-item
          >
          <el-descriptions-item label="文件">
            {{ dataObj.riskAssessFile }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <div class="kh_box">
      <div class="m_title" style="margin-top: 24px">-回访问卷结果</div>
      <div class="descriptions_box">
        <el-descriptions
          class="margin-top"
          :column="1"
          label-width="130px"
          size="default"
          border
        >
          <el-descriptions-item label="试题名称">
            {{ dataObj.visitQuestionTitle }}
          </el-descriptions-item>
          <el-descriptions-item label="文件">
            {{ dataObj.visitQuestionFile }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <div class="kh_box">
      <div class="m_title" style="margin-top: 24px">-开户步骤</div>
      <div class="lu_line">
        <el-steps direction="vertical">
          <el-step
            v-for="(item, index) in dataObj.accountOpeningSteps"
            :key="index"
          >
            <template #title>
              <div style="font-weight: 400">
                <span class="title_box">{{ item.ctime }}</span>
                <span class="title_info">{{ item.operateType }}</span>
              </div>
              <div style="height: 20px"></div>
            </template>
          </el-step>
        </el-steps>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { findCustAccounts } from "@/api/userMessage/userDetail";
const props = defineProps({ externalUserId: String, clueId: String });
const dataObj = ref({});
const findCustAccountsFun = () => {
  findCustAccounts({
    externalUserId: props.externalUserId,
    clueId: props.clueId,
  }).then((res) => {
    if (res.code == 200) {
      dataObj.value = res.date;
    }
  });
};
onMounted(() => {
  findCustAccountsFun();
});
</script>

<style lang="less" scoped>
.content_box {
  height: calc(100vh - 205px);
  overflow-y: auto;
}
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
.khly {
  margin-top: 24px;
}

.kh_box {
  padding-top: 10px;
}
.info_content {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 22px;
  position: relative;
}
.info_time {
  border-radius: 2px;
  background: #f6f6f6;
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  margin-top: 8px;
  padding: 2px 6px;
  display: inline-block;
}
.kh_top {
  .m_line {
    width: 4px;
    height: 16px;
    display: inline-block;
    background-color: #f65800;
    vertical-align: middle;
  }
  img {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-left: 8px;
    margin-top: 1px;
  }
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
.descriptions_box {
  margin-top: 16px;
}
.bq_title {
  display: inline-block;
  vertical-align: middle;
  color: #f65800;
  cursor: pointer;
}
.bq_title_2 {
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  position: absolute;
  right: 26px;
}
.edit_icon {
  width: 16px;
  height: 16px;
  margin-left: 2px;
  vertical-align: middle;
  cursor: pointer;
}
.ss_icon {
  width: 12px;
  height: 12px;
  vertical-align: middle;
  position: absolute;
  right: 11px;
  top: 5px;
  cursor: pointer;
}
.code_box {
  padding-bottom: 12px;
}
.isHeight {
  display: flex;
  justify-content: left;
  padding-top: 0;
  height: 0;
  // transition: 0.5s;
  overflow-y: hidden;
}
.code_item_box {
  display: flex;
  justify-content: left;
  padding-top: 12px;
  height: auto;
  // transition: 0.5s;
}
.code_item {
  border-radius: 4px;
  border: 1px solid #f65800;
  background: #fff;
  display: inline-flex;
  padding: 4px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: #f65800;
  font-size: 14px;
  margin-right: 8px;
}
.lu_line {
  margin-top: 15px;
  padding: 0 20px;
  border-radius: 2px;
  border: 1px solid #ededed;
  background: #fafafa;
}

//
.el-steps {
  margin-top: 24px;
}
.title_box {
  position: relative;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}
.title_info {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 20px;
  margin-left: 16px;
}
::v-deep .el-step__icon.is-text {
  border-color: #f65800;
  width: 12px;
  height: 12px;
  margin-left: 6px;
}
::v-deep .el-step__icon-inner {
  display: none;
}
::v-deep .el-step.is-vertical .el-step__line {
  top: 12px;
  bottom: -5px;
  background-color: #f65800;
  width: 1.5px;
}
::v-deep .el-step__description {
  padding-right: 0;
}
</style>
