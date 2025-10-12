<template>
  <div
    style="
      padding: 24px 0 0;
      height: calc(100vh - 122px);
      overflow-y: auto;
      position: relative;
    "
  >
    <div class="dataBox">
      <div class="dataItem" v-for="(item, index) in dataT" :key="index">
        <div class="item_text">{{ item.name }}</div>
        <div class="item_num">{{ item.data }}</div>
      </div>
    </div>
    <div class="m_top">
      <span class="m_line"></span>
      <span class="m_title">跟进记录</span>
      <el-button type="primary" size="small" @click="htmlToPDF"
        >导出PDF</el-button
      >
    </div>
    <div class="line"></div>
    <div class="line_box" ref="domBox">
      <div v-for="(item1, key) in dataList" :key="key">
        <div class="date">{{ item1.date }}</div>
        <el-steps direction="vertical">
          <el-step v-for="(item, index) in item1.data" :key="index">
            <template #title>
              <div class="title_box">
                <span style="font-weight: 600; color: rgba(0, 0, 0, 0.85)">{{
                  item.followType
                }}</span>
                <div class="headerBox">
                  <img
                    src="../../../assets/images/common/header_icon.png"
                    alt=""
                  />
                  <span>{{ item.userName }}</span>
                </div>
                <span class="time">发生时间：{{ item.operateTime }}</span>
              </div>
            </template>
            <template #description>
              <div class="content_box">
                <div class="content_top">
                  <div v-if="item.isContacted || item.isContacted * 1 > -1">
                    <span class="info_text">是否接通：</span>
                    <span class="info_content">{{
                      item.isContacted == 1 ? "是" : "否"
                    }}</span>
                  </div>
                  <div v-if="item.callDuration">
                    <span class="info_text">通话时长：</span>
                    <span class="info_content">{{ item.callDuration }}</span>
                  </div>
                  <div
                    v-if="
                      item.translateTextLength ||
                      item.sensitiveWordResult ||
                      item.sensitiveWordResult * 1 > -1
                    "
                  >
                    <span class="info_text">敏感词质检：</span>
                    <span
                      :class="[
                        'jc_code',
                        item.sensitiveWordResult == 1
                          ? 'successSty'
                          : 'errorSty',
                      ]"
                      >{{
                        item.sensitiveWordResult == 1 ? "检测通过" : "检测失败"
                      }}</span
                    >
                    <span class="info_content" v-if="item.translateTextLength"
                      >{{ item.translateTextLength }}个字</span
                    >
                  </div>
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
                  <!-- <div v-if="item.followType">
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
                  </div> -->
                </div>
                <div class="content_bottom">
                  <div
                    :class="[
                      'info_content',
                      item.isOpen ? '' : 'text-overflow--2',
                    ]"
                  >
                    {{ newStr(item.operateContent) }}
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
                    {{ item.operateContent }}
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { findUserTrace } from "@/api/userMessage/userDetail";
import clipboard3 from "vue-clipboard3";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const { toClipboard } = clipboard3();

const props = defineProps({ externalUserId: String, clueId: String });

const newStr = (data) => {
  const regex = new RegExp('"', "g");
  const data1 = data.replace(regex, "");
  const data2 = data1.replace(/\[/g, "");
  const data3 = data2.replace(/\]/g, "");
  return data3.replace(/\,/g, "，");
};

//

const domBox = ref();

// 分页，会切割元素
const htmlToPDF = async (bgColor = "#fff") => {
  const pdfDom = domBox.value;
  pdfDom.style.padding = "0 10px !important";

  const A4Width = 595.28;
  const A4Height = 841.89;

  const canvas = await html2canvas(pdfDom, {
    scale: 2,
    useCORS: true,
    windowHeight: domBox.value.scrollHeight + 400, // 可以设置一个较大的宽度来确保内容完全渲染，即使它不在视口内
    backgroundColor: bgColor,
  });

  let pageHeight = (canvas.width / A4Width) * A4Height;
  let leftHeight = canvas.height;
  let position = 0;
  let imgWidth = A4Width;
  let imgHeight = (A4Width / canvas.width) * canvas.height;

  const pageData = canvas.toDataURL("image/jpeg", 1.0);
  const PDF = new jsPDF("p", "pt", "a4");

  if (leftHeight < pageHeight) {
    PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
  } else {
    while (leftHeight > 0) {
      PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
      leftHeight -= pageHeight;
      position -= A4Height;
      if (leftHeight > 0) {
        PDF.addPage();
      }
    }
  }

  PDF.save("轨迹信息.pdf");
};

// 不分页，会失真
// const generatePDF = async () => {
//   console.log(domBox);
//   const element = domBox.value; // 获取你要导出的元素
//   const canvas = await html2canvas(element, {
//     scale: 1, // 提高分辨率
//     useCORS: true, // 如果你的图片有跨域问题，则需要设置这个选项
//     logging: true, // 开启日志记录，有助于调试
//     windowHeight: element.scrollHeight + 100, // 可以设置一个较大的宽度来确保内容完全渲染，即使它不在视口内
//     x: 0,
//     y: 0,
//     width: element.scrollWidth + 20, // 设置画布的宽度
//     height: element.scrollHeight, // 使用 scrollHeight 来确保内容全部渲染
//   });
//   const imgData = canvas.toDataURL("image/png");
//   const pdf = new jsPDF("p", "pt", "a4"); // A4 大小页面，纵向
//   const imgWidth = pdf.internal.pageSize.getWidth(); // 获取PDF页面的宽度
//   pdf.addImage(
//     imgData,
//     "PNG",
//     0,
//     0,
//     imgWidth,
//     pdf.internal.pageSize.getHeight()
//   ); // 将图片添加到PDF中
//   pdf.save("download.pdf"); // 保存PDF文件
// };

//
const dataT = ref([
  {
    name: "电话联系次数",
    data: "0",
  },
  {
    name: "手动跟进次数",
    data: "0",
  },
  {
    name: "最新企微聊天日期",
    data: "0",
  },
]);

const copyData = async (link) => {
  try {
    await toClipboard(link);
    ElMessage.success("已复制");
  } catch (error) {
    ElMessage.error("复制失败");
  }
};

const dataList = ref([]);

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
  findUserTrace({
    externalUserId: props.externalUserId,
    clueId: props.clueId,
  }).then((res) => {
    if (res.code == 200) {
      // dataList.value = res.date.userRecordMap;
      Object.entries(res.date.userRecordMap).forEach(([key, value]) => {
        dataList.value.push(dataUpdate(key, value));
      });
      dataT.value = [
        {
          name: "电话联系次数",
          data: res.date.phoneContactCount,
        },
        {
          name: "手动跟进次数",
          data: res.date.followCount,
        },
        {
          name: "最新企微聊天日期",
          data: res.date.lastChatTime,
        },
      ];
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
  height: 110px;
  display: flex;
  justify-content: space-between;
  text-align: left;
  min-width: 720px;
  max-width: 900px;
  margin-top: 10px;
  padding: 0 24px;
  .dataItem {
    width: 260px;
    height: 88px;
    background-color: #fff7f2;
    border-radius: 3px;
    border: 1px solid rgba(246, 88, 0, 0.3);
    margin-right: 24px;
    position: relative;
    .item_text {
      margin-top: 16px;
      margin-left: 32px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      line-height: 20px;
    }
    .item_num {
      color: rgba(0, 0, 0, 0.85);
      font-size: 24px;
      font-weight: 500;
      line-height: 42px;
      margin-left: 32px;
    }
  }
}
.m_top {
  position: relative;
  margin-top: 10px;
  padding: 0 24px;
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
  margin-left: 24px;
}
.date {
  // margin-top: 20px;
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
  // display: inline-block;
  color: rgba(0, 0, 0);
  font-size: 14px;
  line-height: 22px;
  position: relative;
  z-index: 2;
  cursor: pointer;
  word-wrap: break-word;
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

.line_box {
  flex: 1;
  padding: 24px 24px 0 24px;
  height: calc(100% - 168px);
  overflow-y: auto;
}
.jc_code {
  font-size: 14px;
  font-style: normal;
  line-height: 20px;
  padding: 2px 4px;
  margin-right: 8px;
  border-radius: 2px;
}
.successSty {
  color: #28b840;
  background-color: #ebffee;
}
.errorSty {
  background-color: #ffeee5;
  color: #f65800;
}
</style>
