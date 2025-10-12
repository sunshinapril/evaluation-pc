<template>
  <div class="content">
    <div class="top_info">
      注：1.标签组和子标签构成本列表，
      点击新增或编辑按钮进行调配；被禁用的标签会特殊标记。<br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.企业微信标签编辑后同步至企微后台，请谨慎操作
    </div>
    <div class="btnBox">
      <div @click="selectFun(1)" :class="[selectIndex == 1 ? 'ac' : 'nol']">
        系统自建标签
      </div>
      <div @click="selectFun(2)" :class="[selectIndex == 2 ? 'ac' : 'nol']">
        企业微信标签
      </div>
      <el-button
        class="btnSty"
        type="primary"
        size="small"
        @click="newCodeBtn('新建标签分组')"
        >创建标签分组</el-button
      >
    </div>
    <div class="searchBox">
      <el-select v-model="groupId" placeholder="标签组">
        <el-option
          v-for="(item, index) in codeGroupList"
          :key="index"
          :label="item.groupName"
          :value="item.groupId"
        />
      </el-select>
      <el-input v-model="tagName" placeholder="搜索子标签名称" />
      <el-button type="primary" size="small" @click="codeListFun"
        >查询</el-button
      >
      <el-button size="small" @click="reset">重置</el-button>
    </div>
    <div style="flex: 1; overflow-y: auto">
      <div class="code_box" v-for="(itemGrop, index) in codeList" :key="index">
        <div class="code_top">
          <img class="bq" src="../../assets/images/common/bq.png" alt="" />
          <span class="code_title">{{ itemGrop.groupName }}</span>

          <div class="code_add" @click="newCodeBtn('添加标签', itemGrop)">
            <!-- <img src="../../assets/images/common/add.png" alt="" /> -->
            添加
          </div>
          <div class="code_add" @click="newCodeBtn('编辑分组名称', itemGrop)">
            <!-- <img
            src="../../assets/images/common/edit_icon2.png"
            alt=""
          /> -->
            编辑
          </div>
          <div class="code_add" @click="deleteGroup(itemGrop)">
            <!-- <img src="../../assets/images/common/add.png" alt="" /> -->
            删除
          </div>
        </div>
        <div class="code_content">
          <div
            class="code_item"
            v-for="(itemCode, index2) in itemGrop.tagList"
            :key="index2"
          >
            <span style="display: inline-block; vertical-align: middle">{{
              itemCode.name
            }}</span>
            <div>
              <img
                v-if="
                  selectIndex == 1 || (selectIndex == 2 && itemCode.type != 1)
                "
                @click="deleteCode(itemGrop, itemCode)"
                src="../../assets/images/common/close.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <newCodeDig
      ref="newCode"
      :codeListFun="codeListFun"
      :selectIndex="selectIndex"
    ></newCodeDig>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import newCodeDig from "./components/newCodeDig.vue";
import {
  allGroupList,
  groupList,
  groupDelete,
  tagDelete,
  allGroupListWe,
  groupListWe,
  groupDeleteWe,
  tagDeleteWe,
} from "@/api/userMessage/codeMessage";

const selectIndex = ref(1);
const selectFun = (index) => {
  selectIndex.value = index;
  codeListFun();
  codeGroupListFun();
};

const groupId = ref(null);
const tagName = ref(null);

// 标签列表
const codeList = ref([]);
const codeListFun = () => {
  const condition = {
    groupId: groupId.value,
    tagName: tagName.value,
  };
  if (selectIndex.value == 1) {
    allGroupList(condition).then((res) => {
      if (res.code == 200) {
        codeList.value = res.date;
      }
    });
  } else {
    allGroupListWe(condition).then((res) => {
      if (res.code == 200) {
        codeList.value = res.date;
      }
    });
  }
};

// 标签组列表
const codeGroupList = ref([]);
const codeGroupListFun = () => {
  if (selectIndex.value == 1) {
    groupList().then((res) => {
      if (res.code == 200) {
        codeGroupList.value = res.date;
      }
    });
  } else {
    groupListWe().then((res) => {
      if (res.code == 200) {
        codeGroupList.value = res.date;
      }
    });
  }
};

const reset = () => {
  groupId.value = null;
  tagName.value = null;
  codeListFun();
};

const newCode = ref(null);
const newCodeBtn = (title, item) => {
  newCode.value.handleOpen(title, item);
};

const deleteGroup = (item) => {
  ElMessageBox.confirm(
    "确定删除" + item.groupName + "以及分组下所有标签吗？",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "error",
    }
  )
    .then(() => {
      if (selectIndex.value == 1) {
        groupDelete({ groupId: item.groupId }).then((res) => {
          if (res.code == 200) {
            ElMessage.success("删除成功");
            codeListFun();
          }
        });
      } else {
        groupDeleteWe({ groupId: item.groupId }).then((res) => {
          if (res.code == 200) {
            ElMessage.success("删除成功");
            codeListFun();
          }
        });
      }
    })
    .catch(() => {
      // console.log("用户点击了取消");
    });
};

const deleteCode = (item1, item2) => {
  if (selectIndex.value == 1) {
    tagDelete({ groupId: item1.groupId, tagId: item2.tagId }).then((res) => {
      if (res.code == 200) {
        ElMessage.success("删除成功");
        codeListFun();
      }
    });
  } else {
    tagDeleteWe({ groupId: item1.groupId, tagId: item2.tagId }).then((res) => {
      if (res.code == 200) {
        ElMessage.success("删除成功");
        codeListFun();
      }
    });
  }
};

onMounted(() => {
  codeListFun();
  codeGroupListFun();
});
</script>
<style lang="less" scoped>
.content {
  height: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-align: center;
  .top_info {
    width: 100%;
    background: #fff7f2;
    padding: 8px;
    color: #f65800;
    font-size: 14px;
    text-align: left;
    line-height: 22px;
    margin-top: 10px;
  }
}
.searchBox {
  text-align: left;
  margin: 10px 0 20px;
  .el-select,
  .el-input {
    width: 247px;
    margin-right: 20px;
    margin-top: 20px;
  }
  .el-button {
    margin-top: 20px;
  }
}
.btn_box {
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
  .btn_info {
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    line-height: 22px;
  }
}
:deep(.el-table__empty-block) {
  min-height: 700px;
}
.btnBox {
  display: flex;
  justify-content: left;
  border-bottom: 0.5px solid #dfe6ec;
  height: 60px;
  position: relative;
  div {
    height: 100%;
    line-height: 60px;
    margin-right: 36px;
    border-bottom: 4px solid;
    cursor: pointer;
  }
  .nol {
    color: rgba(0, 0, 0, 0.65);
    font-size: 16px;
    border-bottom-color: #fff;
  }
  .ac {
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    font-weight: 600;
    border-bottom-color: #f65800;
  }
  .btnSty {
    position: absolute;
    right: 0;
    top: 16px;
  }
}
.code_box {
  margin-bottom: 15px;
  .code_top {
    display: flex;
    justify-content: left;
    .bq {
      width: 20px;
      height: 20px;
      vertical-align: middle;
      margin-right: 8px;
      margin-top: 2px;
    }
    .code_title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 16px;
      font-weight: 600;
      line-height: 22px;
      vertical-align: middle;
      display: inline-block;
    }
    .code_add {
      margin-left: 16px;
      color: #f65800;
      font-size: 14px;
      line-height: 22px;
      cursor: pointer;
      img {
        width: 16px;
        height: 16px;
        vertical-align: middle;
        margin-right: 4px;
      }
    }
  }
  .code_content {
    padding: 15px 0 20px 0;
    display: flex;
    justify-content: left;
    width: calc(100% - 56px);
    margin-left: 28px;
    border-bottom: 0.5px solid #dfe6ec;
    .code_item {
      border-radius: 4px;
      border: 0.5px solid #f65800;
      color: #f65800;
      padding: 4px 8px;
      font-size: 14px;
      line-height: 20px;
      margin-right: 8px;
      div {
        display: inline-block;
        height: 22px;
        padding-top: 2px;
        vertical-align: middle;
      }
      img {
        width: 16px;
        height: 16px;
        margin-left: 4px;
        margin-top: 1px;
        cursor: pointer;
      }
    }
  }
}
</style>
