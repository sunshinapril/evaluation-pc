<template>
  <div style="text-align: left">
    <el-drawer
      v-model="drawerRight"
      :size="'85%'"
      :direction="'rtl'"
      @close="closeFun"
    >
      <template #header>
        <div>
          <span class="digTitle">客户详情</span>
          <!-- <span class="digTime">更新时间：{{ updateTime() }}</span> -->
        </div>
      </template>
      <template #default>
        <div class="box_content">
          <div class="box_left">
            <div style="padding-left: 20px">
              <div class="header">
                <img
                  v-if="userData.custAvatar"
                  :src="userData.custAvatar"
                  alt=""
                />
                <img
                  v-else
                  src="../../../assets/images/common/default_avatar.png"
                  alt=""
                />
                <span class="header_name">{{ userData.custName }}</span>
              </div>
              <div class="user_tag_box">
                <div v-for="(item, index) in userTag" :key="index">
                  <div class="tab_item">
                    {{ item.name }}
                  </div>
                </div>
              </div>
              <div class="user_info_box">
                <div class="info_item">
                  <span class="info_text">手机号：</span>
                  <span class="info_content">{{
                    userData.custPhone || "--"
                  }}</span>
                  <span
                    class="info_btn"
                    @click="phoneBtn(userData.custPhone, userData.otherMobiles)"
                    >管理</span
                  >
                  <span
                    class="info_btn"
                    v-if="userData.custPhone"
                    @click="copyData(userData.custPhone)"
                    >复制</span
                  >
                </div>
                <div class="info_item">
                  <span class="info_text">主联系人：</span>
                  <span class="info_content">{{
                    userData.followName || "--"
                  }}</span>
                </div>
                <div class="info_item">
                  <span class="info_text">客户ID：</span>
                  <span class="info_content">{{
                    externalUserId || clueId
                  }}</span>
                  <span
                    class="info_btn"
                    @click="copyData(externalUserId || clueId)"
                    >复制</span
                  >
                </div>
              </div>
            </div>
            <div class="m_box">
              <div class="m_top">
                <span class="m_line"></span>
                <span class="m_title">客户来源</span>
              </div>
              <div class="khly">
                <span class="info_text">客户来源：</span>
                <div class="info_box">
                  <span class="info_content">{{
                    userData.custSource || "--"
                  }}</span>
                  <div class="info_time" v-if="userData.ctime">
                    {{ userData.ctime || "--" }}
                  </div>
                </div>
              </div>
              <div class="khly">
                <span class="info_text">主联系人：</span>
                <div class="info_box">
                  <span class="info_content">{{
                    userData.followName || "--"
                  }}</span>
                  <div class="info_time" v-if="userData.assignerTime">
                    分配时间-{{ userData.assignerTime }}
                  </div>
                  <!-- <div class="info_time" v-if="userData.followName">
                    手动派单-2025-03-07 18:00
                  </div> -->
                </div>
              </div>
            </div>
            <div class="m_box">
              <div class="m_top">
                <span class="m_line"></span>
                <span class="m_title">群聊及应用</span>
              </div>
              <div class="khly" style="margin-top: 10px">
                <span class="info_text" style="margin-top: 10px"
                  >添加群聊：</span
                >
                <div class="info_box">
                  <span
                    :class="['info_content', 'khly_text']"
                    v-for="(item, index) in userData.custChats"
                    :key="index"
                    >{{ item.chatName }}</span
                  >
                  <span
                    class="info_content khly_text"
                    v-if="userData.custChats && userData.custChats.length == 0"
                    >--</span
                  >
                </div>
              </div>
              <div class="khly" style="margin-top: 10px">
                <span class="info_text" style="margin-top: 10px"
                  >添加应用：</span
                >
                <div class="info_box">
                  <span
                    :class="['info_content', 'khly_text']"
                    v-for="(item, index) in userData.addApps"
                    :key="index"
                    >{{ item }}</span
                  >
                  <span
                    class="info_content khly_text"
                    v-if="userData.addApps && userData.addApps.length == 0"
                    >--</span
                  >
                </div>
              </div>
            </div>
            <div class="m_box" v-if="clueId">
              <div class="m_top">
                <span class="m_line"></span>
                <span class="m_title">手动跟进</span>
              </div>
              <div class="khly" style="margin-top: 10px">
                <div class="radio_box">
                  <span class="info_text" style="vertical-align: middle"
                    >是否接通：</span
                  >
                  <el-radio-group
                    v-model="userData.isContacted"
                    style="vertical-align: middle"
                  >
                    <el-radio :value="1" size="large">是</el-radio>
                    <el-radio :value="0" size="large">否</el-radio>
                  </el-radio-group>
                </div>
                <div class="radio_box">
                  <span class="info_text" style="vertical-align: middle"
                    >是否加微：</span
                  >
                  <el-radio-group
                    v-model="userData.isBindQwCust"
                    style="vertical-align: middle"
                  >
                    <el-radio :value="1" size="large">是</el-radio>
                    <el-radio :value="0" size="large">否</el-radio>
                  </el-radio-group>
                </div>
                <div class="radio_box">
                  <span class="info_text" style="vertical-align: middle"
                    >意向等级：</span
                  >
                  <el-radio-group
                    v-model="userData.intentLevel"
                    style="vertical-align: middle"
                  >
                    <el-radio value="无" size="large">无</el-radio>
                    <el-radio value="低" size="large">低</el-radio>
                    <el-radio value="中" size="large">中</el-radio>
                    <el-radio value="高" size="large">高</el-radio>
                  </el-radio-group>
                </div>
                <div style="margin-top: 10px">
                  <span class="info_text">添加备注：</span>
                  <el-input
                    v-model="userData.followRemark"
                    style="width: 365px; margin-top: 8px"
                    :rows="4"
                    type="textarea"
                    placeholder="写点什么"
                  />
                </div>
              </div>
              <el-button
                style="margin-top: 13px"
                type="primary"
                size="small"
                @click="updateCustClueFun"
                >保存</el-button
              >
            </div>
          </div>
          <div class="box_right">
            <el-tabs
              v-model="activeName"
              class="demo-tabs"
              @tab-click="handleClick"
            >
              <el-tab-pane label="客户画像" name="1"
                ><userInfoSub
                  v-if="activeName == '1'"
                  :externalUserId="externalUserId"
                  :clueId="clueId"
                ></userInfoSub
              ></el-tab-pane>
              <el-tab-pane label="服务轨迹" name="2">
                <serverLineSub
                  v-if="activeName == '2'"
                  :externalUserId="externalUserId"
                  :clueId="clueId"
                ></serverLineSub>
              </el-tab-pane>
              <el-tab-pane label="客户动态" name="3">
                <customerDySub
                  v-if="activeName == '3'"
                  :externalUserId="externalUserId"
                  :clueId="clueId"
                ></customerDySub>
              </el-tab-pane>
              <el-tab-pane label="资产透视" name="4">
                <assetAccountSub
                  v-if="activeName == '4'"
                  :externalUserId="externalUserId"
                  :clueId="clueId"
                ></assetAccountSub>
              </el-tab-pane>
              <!-- <el-tab-pane label="资产透视" name="5">权益透视</el-tab-pane> -->
            </el-tabs>
          </div>
        </div>
      </template>
    </el-drawer>
    <phoneDig
      ref="phoneDigDom"
      :findCustClueByIdFun="findCustClueByIdFun"
    ></phoneDig>
  </div>
</template>

<script setup>
import { ref } from "vue";
import userInfoSub from "./userInfoSub.vue";
import customerDySub from "./customerDySub.vue";
import serverLineSub from "./serverLineSub.vue";
import assetAccountSub from "./assetAccountSub.vue";
import phoneDig from "./phoneDig.vue";
import clipboard3 from "vue-clipboard3";
import { findCustClueById, updateCustClue } from "@/api/userMessage/userDetail";
const { toClipboard } = clipboard3();
const drawerRight = ref(false);

const externalUserId = ref(null);
const clueId = ref(null);
const confirmClick = (data1, data2) => {
  drawerRight.value = true;
  externalUserId.value = data1;
  clueId.value = data2;
  activeName.value = "1";
  findCustClueByIdFun();
};

//客户经理搜索
const value1 = ref("");
const currentTime = ref("");
const closeFun = () => {
  value1.value = [];
  activeName.value = "";
};

const updateTime = (time) => {
  const now = time ? new Date(time * 1000) : new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以要加1
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return currentTime.value;
};

// 列表数据
const loading = ref(false);
const userTag = ref([
  { name: "已添加企微好友" },
  { name: "已分配客户经理" },
  { name: "未开户" },
]);
const radio1 = ref("1");
const textarea = ref("");

// 标签页
const activeName = ref("1");
const handleClick = (tab) => {
  //
};

const phoneDigDom = ref();
const phoneBtn = (phone, phoneArr) => {
  phoneDigDom.value.handleOpen(
    phone,
    phoneArr,
    externalUserId.value,
    clueId.value
  );
};

const copyData = async (link) => {
  try {
    await toClipboard(link);
    ElMessage.success("已复制");
  } catch (error) {
    ElMessage.error("复制失败");
  }
};

// 客户信息
const userData = ref([]);
const findCustClueByIdFun = () => {
  findCustClueById({
    clueId: clueId.value,
    externalUserId: externalUserId.value,
  }).then((res) => {
    if (res.code == 200) {
      userData.value = res.date;
      userTag.value = [
        {
          name:
            res.date.isBindQwCust == 1 ? "已添加企微好友" : "未添加企微好友",
        },
        {
          name: clueStatus(res.date.clueStatus),
        },
        { name: res.date.isAccountOpen == 1 ? "已开户" : "未开户" },
      ];
    }
  });
};

const clueStatus = (code) => {
  switch (code) {
    case "unassigned":
      return "未分配客户经理";
    case "assigned":
      return "已分配客户经理";
    case "following":
      return "跟进中";
    case "converted":
      return "已转化";
    case "rejected":
      return "已拒绝";
    default:
      return "无效线索";
  }
};

// 更新跟进
const updateCustClueFun = () => {
  updateCustClue({
    intentLevel: userData.value.intentLevel,
    isContacted: userData.value.isContacted,
    isBindQwCust: userData.value.isBindQwCust,
    followRemark: userData.value.followRemark,
    id: clueId.value,
    updateType: 1,
  }).then((res) => {
    if (res.code == 200) {
      ElMessage.success("保存成功");
    }
  });
};

defineExpose({ confirmClick });
</script>

<style lang="less" scoped>
:deep(.el-drawer__header) {
  padding: 18px 20px;
  margin-bottom: 0;
  border-bottom: 0.5px solid #dfe6ec;
}
:deep(.el-drawer__body) {
  padding: 0;
}
.digTitle {
  display: inline-block;
  color: rgba(0, 0, 0, 0.85);
  font-size: 18px;
  line-height: 25px;
  vertical-align: middle;
  width: 120px;
  font-weight: 600;
}
.digTime {
  display: inline-block;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 20px;
  vertical-align: middle;
}
.box_content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: left;
}

.box_left {
  display: inline-block;
  width: 418px;
  height: 100%;
  overflow-y: auto;
  border-right: 12px solid #f7f7f7;
  .header {
    padding-top: 24px;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      vertical-align: middle;
    }
    .header_name {
      display: inline-block;
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      vertical-align: middle;
      margin-left: 14px;
      font-weight: 600;
    }
  }
  .user_tag_box {
    margin-top: 22px;
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    .tab_item {
      padding: 2px 6px;
      line-height: 22px;
      color: #986b52;
      font-size: 14px;
      border-radius: 2px;
      border: 0.5px solid #986b52;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .user_info_box {
    margin-top: 14px;
    margin-bottom: 20px;
    .info_item {
      margin-bottom: 12px;
      .info_btn {
        color: #f65800;
        font-size: 14px;
        line-height: 22px;
        margin-left: 12px;
        cursor: pointer;
      }
    }
  }
  .khly {
    margin-top: 14px;
    .khly_text {
      display: block;
      width: 294px;
      // margin-top: 10px;
      padding: 9px 0;
      border-bottom: 0.5px solid #dfe6ec;
    }
  }
}
.box_right {
  display: inline-block;
  width: calc(100% - 400px);
  height: 100%;
  overflow-y: auto;
  // padding: 0 0 0 24px;
}
.el-radio {
  margin-right: 20px;
}
:deep(.el-tabs__nav-wrap:after) {
  height: 0.5px;
}
:deep(.el-tabs__item) {
  color: rgba(0, 0, 0, 0.65);
  font-size: 18px;
  line-height: 25px;
  height: 60px;
}
:deep(.el-tabs__item.is-active, .el-tabs__item:hover) {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}
:deep(.el-tabs__active-bar) {
  height: 4px;
}
:deep(.el-tabs__nav-scroll) {
  height: 60px;
}

//
.info_box {
  display: inline-block;
  vertical-align: top;
}
.info_text {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
  width: 85px;
  display: inline-block;
  vertical-align: middle;
}
.info_content {
  display: inline-block;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 22px;
  max-width: 230px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
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
}
.m_box {
  padding: 22px 0 22px 20px;
  border-top: 0.5px solid #dfe6ec;
}
.m_top {
  .m_line {
    width: 4px;
    height: 14px;
    display: inline-block;
    background-color: #f65800;
    vertical-align: middle;
  }
  .m_title {
    display: inline-block;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    margin-left: 10px;
    vertical-align: middle;
  }
}
.el-tabs {
  height: 100%;
}
::v-deep .el-tabs__content {
  height: calc(100% - 60px);
  overflow-y: auto;
}
:deep(.el-tabs__header) {
  margin-bottom: 0;
  margin-left: 24px;
}
//
</style>
