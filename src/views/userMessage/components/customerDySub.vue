<template>
  <div style="padding: 24px">
    <div class="m_top">
      <span class="m_line"></span>
      <span class="m_title">平台注册信息</span>
    </div>
    <div class="dataBox">
      <div class="appBox" v-for="(item, index) in userRegMgr" :key="index">
        <div class="app_top">
          <img src="../../../assets/images/common/header_icon.png" alt="" />
          <span>{{ item.manageName }}</span>
        </div>
        <div class="info_box">
          <div
            class="info_item"
            v-if="item.manageName && item.manageType == 'app'"
          >
            <span class="info_text info_w">APP名称：</span>
            <span class="info_content">{{ item.manageName }}</span>
          </div>
          <div class="info_item">
            <span class="info_text info_w" style="vertical-align: middle"
              >头像：</span
            >
            <img
              v-if="item.userAvatar"
              class="info_header"
              style="vertical-align: middle"
              :src="item.userAvatar"
              alt=""
            />
            <img
              v-else
              class="info_header"
              style="vertical-align: middle"
              src="../../../assets/images/common/default_avatar.png"
              alt=""
            />
          </div>
          <div class="info_item">
            <span class="info_text info_w">用户昵称：</span>
            <span class="info_content">{{ item.userNickname }}</span>
          </div>
          <div class="info_item">
            <span class="info_text info_w">手机号：</span>
            <span class="info_content">{{ item.userPhone }}</span>
          </div>
          <div
            class="info_item"
            v-if="
              item.manageType == 'mini_program' ||
              item.manageType == 'official_account'
            "
          >
            <span class="info_text info_w">Openid：</span>
            <span class="info_content">{{ item.openId }}</span>
          </div>
          <div class="info_item" v-if="item.manageType == 'apqy_wechatp'">
            <span class="info_text info_w">external_user_id：</span>
            <span class="info_content">{{ item.externalUserId }}</span>
          </div>
          <div class="info_item" v-if="item.manageType == 'qy_wechat'">
            <span class="info_text info_w">添加好友时间：</span>
            <span class="info_content">{{ item.registerTime }}</span>
          </div>
          <div class="info_item" v-if="item.manageType !== 'qy_wechat'">
            <span class="info_text info_w">{{
              item.manageType == "official_account"
                ? "首次关注时间："
                : "注册时间："
            }}</span>
            <span class="info_content">{{ item.registerTime }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="m_top">
      <span class="m_line"></span>
      <span class="m_title">用户轨迹</span>
    </div>
    <div class="line"></div>
    <div v-for="(item1, key) in dataList" :key="key">
      <div class="date">{{ item1.date }}</div>
      <el-steps direction="vertical">
        <el-step v-for="(item, index) in item1.data" :key="index">
          <template #title>
            <div class="title_box">
              <span style="font-weight: 600; color: rgba(0, 0, 0, 0.85)">{{
                item.sourceName
              }}</span>
              <!-- <div class="headerBox">
                <img
                  src="../../../assets/images/common/header_icon.png"
                  alt=""
                />
                <span>{{ item.userName }}</span>
              </div> -->
              <span class="time">发生时间：{{ item.ctime }}</span>
            </div>
          </template>
          <template #description>
            <div class="content_box">
              <div class="content_top">
                <div v-if="item.behavior">
                  <span class="info_text">行为类型：</span>
                  <span class="info_content">{{
                    item.behavior == 1 ? "客户行为" : "员工行为"
                  }}</span>
                </div>
                <!-- <div v-if="item.source">
                  <span class="info_text">轨迹来源：</span>
                  <span class="info_content">{{ item.source }}</span>
                </div> -->

                <div v-if="item.sendSuccess || item.sendSuccess * 1 > -1">
                  <span class="info_text">发送成功：</span>
                  <span class="info_content">{{
                    item.sendSuccess == 1 ? "是" : "否"
                  }}</span>
                </div>
                <div v-if="item.mediaId">
                  <span class="info_text">素材ID：</span>
                  <span class="info_content">{{ item.mediaId }}</span>
                  <span class="info_btn" @click="copyData(item.mediaId)"
                    >复制</span
                  >
                </div>
                <div v-if="item.custMeidaView || item.custMeidaView * 1 > -1">
                  <span class="info_text">客户是否查看：</span>
                  <span class="info_content">{{
                    item.custMeidaView == 1 ? "是" : "否"
                  }}</span>
                </div>
                <div v-if="item.followType">
                  <span class="info_text">派发方式：</span>
                  <span class="info_content">{{ item.followType }}</span>
                </div>
                <div
                  style="display: flex"
                  v-if="item.userName && item.followType"
                >
                  <span class="info_text">派发给：</span>
                  <div
                    class="headerBox"
                    style="
                      margin-top: -2px;
                      line-height: 22px;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      white-space: nowrap;
                    "
                  >
                    <img
                      src="../../../assets/images/common/header_icon.png"
                      alt=""
                      style="margin-top: 2px"
                    />
                    <span>{{ item.userName }}</span>
                  </div>
                </div>
              </div>
              <div class="content_bottom">
                <div
                  :class="[
                    'info_content',
                    item.isOpen ? '' : 'text-overflow--2',
                  ]"
                >
                  {{ item.traceContent }}
                </div>
                <div
                  :ref="(el) => setRef(el, item)"
                  style="
                    position: absolute;
                    top: 0;
                    opacity: 0;
                    z-index: 1;
                    padding-right: 16px;
                  "
                  class="info_content"
                >
                  {{ item.traceContent }}
                </div>
                <div class="content_btn" @click="openText(key, index)">
                  {{ item.isOpen ? "收起" : "展开"
                  }}<img src="../../../assets/images/common/zk.png" alt="" />
                </div>
              </div>
            </div>
          </template>
        </el-step>
      </el-steps>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { findCustTrace } from "@/api/userMessage/userDetail";
import clipboard3 from "vue-clipboard3";
const { toClipboard } = clipboard3();
const props = defineProps({ externalUserId: String, clueId: String });

const copyData = async (link) => {
  try {
    await toClipboard(link);
    ElMessage.success("已复制");
  } catch (error) {
    ElMessage.error("复制失败");
  }
};

const dataList = ref([]);
const userRegMgr = ref([]);

const elementRefs = ref([]);
const setRef = (el, item) => {
  if (el && item.id) {
    // elementRefs.value[`ref${item.id}`] = el;
    elementRefs.value.push(el);
  }
};
const openText = (key, index) => {
  dataList.value[key].data[index].isOpen =
    !dataList.value[key].data[index].isOpen;
};

const dataUpdate = (key, value) => {
  let valueData = value.map((item, index) => {
    return {
      ...item,
      isOpen: false,
      id: index + Math.random() * 100,
    };
  });
  return {
    date: key,
    data: valueData,
  };
};

// 轨迹信息
const findCustTraceFun = () => {
  findCustTrace({
    externalUserId: props.externalUserId,
    clueId: props.clueId,
  }).then((res) => {
    if (res.code == 200) {
      userRegMgr.value = res.date.userRegMgr;
      Object.entries(res.date.dayTraceMap).forEach(([key, value]) => {
        dataList.value.push(dataUpdate(key, value));
      });
      setTimeout(() => {
        // console.log(elementRefs.value);
        elementRefs.value.map((item) => {
          if (item.offsetHeight > 44) {
            item.parentNode.childNodes[2].style.display = "block";
          } else {
            item.parentNode.childNodes[2].style.display = "none";
          }
        });
      }, 200);
    }
  });
};

onMounted(() => {
  dataList.value = [];
  elementRefs.value = [];
  findCustTraceFun();
});
</script>

<style lang="less" scoped>
.dataBox {
  margin-top: 20px;
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .appBox {
    width: calc(50% - 6px);
    padding: 15px 20px;
    background-color: #f7f7f7;
    margin-bottom: 12px;
    border-radius: 4px;
    .info_header {
      border-radius: 50%;
      width: 28px;
      height: 28px;
    }
    .info_box {
      margin-top: 10px;
    }
    .info_item {
      margin-top: 8px;
    }
    .app_top {
      height: 38px;
      border-bottom: 1px solid #dfe6ec;
      img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
        vertical-align: middle;
      }
      span {
        color: rgba(0, 0, 0, 0.85);
        font-size: 16px;
        font-weight: 600;
        vertical-align: middle;
        display: inline-block;
      }
    }
  }
}
.m_top {
  position: relative;
  margin-top: 10px;
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
.line {
  height: 0.5px;
  background-color: #dfe6ec;
  margin-top: 12px;
}
.date {
  margin-top: 20px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}
.el-steps {
  margin-top: 24px;
}
.title_box {
  position: relative;
  .time {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 20px;
    position: absolute;
    right: 0;
    font-weight: 400;
  }
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
  margin-left: 8px;
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
    font-weight: 400;
  }
}

.content_box {
  margin-top: 3px;
  margin-bottom: 40px;
  .content_top {
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    div {
      margin-right: 40px;
      margin-bottom: 10px;
    }
  }
}
.info_text {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
  display: inline-block;
  // vertical-align: middle;
}
.info_content {
  display: inline-block;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 22px;
  position: relative;
  z-index: 2;
  cursor: pointer;
}
.info_w {
  width: 120px;
}
.info_btn {
  color: #f65800;
  font-size: 14px;
  line-height: 22px;
  margin-left: 12px;
  cursor: pointer;
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
.content_bottom {
  padding: 16px;
  background-color: #f7f7f7;
  position: relative;
  cursor: pointer;
}

.text-overflow--2 {
  position: relative;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  z-index: 2;
}
.content_btn {
  position: absolute;
  right: 0;
  bottom: -10px;
  color: #f65800;
  font-size: 14px;
  line-height: 26px;
  z-index: 2;
  cursor: pointer;
  display: none;
  width: 100%;
  text-align: right;
  padding-right: 16px;
  background-color: #f7f7f7;
  font-size: 14px;
  img {
    width: 12px;
    height: 12px;
    vertical-align: middle;
    margin-left: 3px;
  }
}

.text-overflow--2 {
  position: relative;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  z-index: 2;
}
</style>
