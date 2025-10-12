<template>
  <div style="padding: 24px">
    <div class="kh_box">
      <div class="kh_top">
        <span class="m_line"></span>
        <span class="m_title">基础资料</span>
        <!-- <img src="../../../assets/images/common/edit_icon.png" alt="" /> -->
      </div>
      <div class="descriptions_box">
        <el-descriptions
          class="margin-top"
          :column="2"
          label-width="130px"
          size="default"
          border
        >
          <el-descriptions-item label="姓名">
            {{ userData.custName || "--" }}
            <!-- <el-input v-model="userData.custName" placeholder="填写姓名" /> -->
          </el-descriptions-item>
          <el-descriptions-item label="身份证">
            {{ userData.idCard || "--" }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号">{{
            userData.custPhone || "--"
          }}</el-descriptions-item>
          <el-descriptions-item label="是否开户">
            {{ userData.isAccountOpen == 0 ? "未开户" : "已开户" }}
          </el-descriptions-item>
          <el-descriptions-item label="渠道">
            {{ userData.custSource || "--" }}
          </el-descriptions-item>
          <el-descriptions-item label="所属分公司">
            {{ userData.custCompany || "--" }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <div class="kh_box">
      <div class="kh_top">
        <span class="m_line"></span>
        <span class="m_title">渠道分配</span>
      </div>
      <div class="descriptions_box">
        <el-descriptions
          class="margin-top"
          :column="1"
          label-width="130px"
          size="default"
          border
        >
          <el-descriptions-item label="客户来源">
            <div class="info_content">{{ userData.addWayDetail || "--" }}</div>
            <div class="info_time" v-if="userData.qwCustCtime">
              入库-{{ userData.qwCustCtime }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="主联系人">
            <div class="info_content">
              {{ userData.currFollowerName || "--" }}
            </div>
            <div class="info_time" v-if="userData.custEmpCtime">
              分配时间-{{ userData.custEmpCtime }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="加入群聊"
            ><div class="info_content">
              <div
                style="display: inline-block"
                v-for="(item, index) in userData.qwCustChat"
                :key="index"
              >
                {{ item
                }}<span v-if="index != userData.qwCustChat.length - 1">，</span>
              </div>
            </div></el-descriptions-item
          >
          <el-descriptions-item label="次联系人"
            ><div class="info_content">
              <div
                style="display: inline-block"
                v-for="(item, index) in userData.otherFollowers"
                :key="index"
              >
                {{ item
                }}<span v-if="index != userData.otherFollowers.length - 1"
                  >，</span
                >
              </div>
            </div></el-descriptions-item
          >
        </el-descriptions>
      </div>
    </div>
    <div class="kh_box">
      <div class="kh_top">
        <span class="m_line"></span>
        <span class="m_title">客户画像</span>
      </div>
      <div class="descriptions_box">
        <el-descriptions
          class="margin-top"
          style="margin-bottom: 24px"
          :column="1"
          label-width="130px"
          size="default"
          border
        >
          <el-descriptions-item label="系统标签">
            <div class="code_box">
              <div class="info_content">
                <span class="bq_title" @click="tagEditFun(1, userData.sysTags)"
                  >编辑</span
                >
                <img
                  @click="tagEditFun(1, userData.sysTags)"
                  class="edit_icon"
                  src="../../../assets/images/common/edit_icon2.png"
                  alt=""
                />
                <span class="bq_title_2" v-if="isTop1" @click="isTopFun(false)"
                  >收起</span
                >
                <img
                  v-if="isTop1"
                  @click="isTopFun(false)"
                  class="ss_icon"
                  src="../../../assets/images/common/top.png"
                  alt=""
                />
                <span v-if="!isTop1" class="bq_title_2" @click="isTopFun(true)"
                  >展开</span
                >
                <img
                  @click="isTopFun(true)"
                  v-if="!isTop1"
                  class="ss_icon"
                  src="../../../assets/images/common/bottom.png"
                  alt=""
                />
              </div>
              <div :class="[isTop1 ? 'code_item_box' : 'isHeight']">
                <div
                  class="code_item"
                  v-for="(item, index) in userData.sysTags"
                  :key="index"
                >
                  {{ item.tagName }}
                </div>
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>

        <el-descriptions
          v-if="externalUserId"
          class="margin-top"
          :column="1"
          label-width="130px"
          size="default"
          border
        >
          <el-descriptions-item label="企微标签">
            <div class="code_box">
              <div class="info_content">
                <span class="bq_title" @click="tagEditFun(2, userData.qwTags)"
                  >编辑</span
                >
                <img
                  @click="tagEditFun(2, userData.qwTags)"
                  class="edit_icon"
                  src="../../../assets/images/common/edit_icon2.png"
                  alt=""
                />
                <span class="bq_title_2" v-if="isTop2" @click="isTopFun2(false)"
                  >收起</span
                >
                <img
                  v-if="isTop2"
                  @click="isTopFun2(false)"
                  class="ss_icon"
                  src="../../../assets/images/common/top.png"
                  alt=""
                />
                <span v-if="!isTop2" class="bq_title_2" @click="isTopFun2(true)"
                  >展开</span
                >
                <img
                  @click="isTopFun2(true)"
                  v-if="!isTop2"
                  class="ss_icon"
                  src="../../../assets/images/common/bottom.png"
                  alt=""
                />
              </div>
              <div :class="[isTop2 ? 'code_item_box' : 'isHeight']">
                <div
                  class="code_item"
                  v-for="(item, index) in userData.qwTags"
                  :key="index"
                >
                  {{ item.tagName }}
                </div>
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <tagDig ref="tagDigDom" :updateCustClueFun="updateCustClueFun"></tagDig>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import tagDig from "./tagDig.vue";
import { findCustProfile } from "@/api/userMessage/userDetail";
const props = defineProps({ externalUserId: String, clueId: String });

const isTop1 = ref(true);
const isTop2 = ref(true);
const isTopFun = (e) => {
  isTop1.value = e;
};
const isTopFun2 = (e) => {
  isTop2.value = e;
};

const tagDigDom = ref();
const tagEditFun = (index, tag) => {
  console.log(1);
  tagDigDom.value.handleOpen(index, tag, props.externalUserId, props.clueId);
};

// 用户信息
const userData = ref({});
const updateCustClueFun = () => {
  findCustProfile({
    externalUserId: props.externalUserId,
    clueId: props.clueId,
  }).then((res) => {
    if (res.code == 200) {
      userData.value = res.date;
    }
  });
};

onMounted(() => {
  updateCustClueFun();
});
</script>

<style lang="less" scoped>
.khly {
  margin-top: 24px;
}

.kh_box {
  padding-top: 10px;
  padding-bottom: 22px;
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
  .m_title {
    display: inline-block;
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    margin-left: 10px;
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
  flex-wrap: wrap;
  padding-top: 0;
  height: 0;
  // transition: 0.5s;
  overflow-y: hidden;
}
.code_item_box {
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  padding-top: 12px;
  height: auto;
  // transition: 0.5s;
}
.code_item {
  margin: 4px 0;
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
.el-input {
  width: 150px;
  border: 0 !important;
}
::v-deep .el-input__wrapper {
  border: 0 !important;
}
</style>
