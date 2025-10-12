<template>
  <div style="text-align: left">
    <el-drawer
      v-model="drawerRight"
      :size="'75%'"
      :direction="'rtl'"
      @close="closeFun"
    >
      <template #header>
        <div class="title_text">线索合并</div>
      </template>
      <template #default>
        <div class="top_info">
          注意：执行合并后，例如将A并入B<br />
          1、A线索被回收，
          线索公海列表将不展示A，仅保留B；A线索的主联系人同步B，A线索用户轨迹、服务记录等同理<br />
          2、谨慎操作， 合并操作不可撤回，
          合并历史记录可至【客户合并历史】中查询
        </div>
        <div class="hb_box">
          <div class="hb_item">
            <div class="title">从</div>
            <el-form
              ref="formRef"
              :model="form1"
              :rules="rules"
              label-width="auto"
              style="max-width: 670px"
            >
              <el-form-item label="选择线索" prop="mergeWithClueId">
                <el-select
                  v-model="form1.mergeWithClueId"
                  placeholder="用户手机号查询"
                  filterable
                  :filter-method="filterFun1"
                  @change="changeFun1"
                >
                  <el-option
                    v-for="(item, index) in chartList1"
                    :key="index"
                    :label="item.custName"
                    :value="JSON.stringify(item)"
                  />
                </el-select>
              </el-form-item>
              <div class="info_box" v-if="selectData1">
                <div class="info_item">
                  <span class="info_content" style="color: #f65800">{{
                    selectData1.custName
                  }}</span>
                </div>
                <div class="info_item">
                  <span class="info_text info_w">手机号：</span>
                  <span class="info_content">{{ selectData1.custPhone }}</span>
                </div>
                <div class="info_item">
                  <span class="info_text info_w">主联系人：</span>
                  <span class="info_content">{{ selectData1.followName }}</span>
                </div>
                <div class="info_item">
                  <span class="info_text info_w">客户ID：</span>
                  <span class="info_content">{{ selectData1.id }}</span>
                </div>
                <div class="info_item">
                  <span class="info_text info_w">客户来源：</span>
                  <span class="info_content">{{ selectData1.custSource }}</span>
                </div>
              </div>
            </el-form>
          </div>
          <div class="hb_item">
            <div class="title">并入至</div>
            <el-form
              ref="formRef"
              :model="form2"
              :rules="rules"
              label-width="auto"
              style="max-width: 670px"
            >
              <el-form-item label="选择线索" prop="mergeByClueId">
                <el-select
                  v-model="form2.mergeByClueId"
                  placeholder="用户手机号查询"
                  filterable
                  :filter-method="filterFun2"
                  @change="changeFun2"
                >
                  <el-option
                    v-for="(item, index) in chartList2"
                    :key="index"
                    :label="item.custName"
                    :value="JSON.stringify(item)"
                  />
                </el-select>
              </el-form-item>
              <div class="info_box" v-if="selectData2">
                <div class="info_item">
                  <span class="info_content" style="color: #f65800">{{
                    selectData2.custName
                  }}</span>
                </div>
                <div class="info_item">
                  <span class="info_text info_w">手机号：</span>
                  <span class="info_content">{{ selectData2.custPhone }}</span>
                </div>
                <div class="info_item">
                  <span class="info_text info_w">主联系人：</span>
                  <span class="info_content">{{ selectData2.followName }}</span>
                </div>
                <div class="info_item">
                  <span class="info_text info_w">客户ID：</span>
                  <span class="info_content">{{ selectData2.id }}</span>
                </div>
                <div class="info_item">
                  <span class="info_text info_w">客户来源：</span>
                  <span class="info_content">{{ selectData2.custSource }}</span>
                </div>
              </div>
            </el-form>
          </div>
        </div>
        <div style="margin-top: 40px">
          <el-button style="margin-left: 79px" @click="drawerRight = false"
            >取消</el-button
          >
          <el-button type="primary" @click="onSubmit">执行合并操作</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  findClueListByPhoneName,
  mergeClueCust,
} from "@/api/userMessage/clueSeas";
const props = defineProps({ setQuery: Function });
const drawerRight = ref(false);

const form1 = ref({
  mergeWithClueId: "",
});
const form2 = ref({
  mergeByClueId: "",
});
const rules = ref({
  mergeWithClueId: [{ required: true, message: "请选择线索", trigger: "blur" }],
  mergeByClueId: [{ required: true, message: "请选择线索", trigger: "blur" }],
});

const confirmClick = () => {
  drawerRight.value = true;
};

const chartList1 = ref();
const chartList2 = ref();
const pageList = (e, index) => {
  const params = {
    custPhone: e,
    custName: "",
  };
  findClueListByPhoneName(params).then((res) => {
    if (res.code == 200) {
      if (index == 1) {
        chartList1.value = res.date;
      } else {
        chartList2.value = res.date;
      }
    }
  });
};

const selectData1 = ref();
const selectData2 = ref();
const changeFun1 = () => {
  selectData1.value = JSON.parse(form1.value.mergeWithClueId);
  console.log(selectData1.value);
};

const changeFun2 = () => {
  selectData2.value = JSON.parse(form2.value.mergeByClueId);
};

const filterFun1 = (e) => {
  console.log(e);
  pageList(e, 1);
};

const filterFun2 = (e) => {
  pageList(e, 2);
};

const onSubmit = () => {
  const data = {
    mergeByClueId: JSON.parse(form2.value.mergeByClueId).id,
    mergeWithClueId: JSON.parse(form1.value.mergeWithClueId).id,
  };
  mergeClueCust(data).then((res) => {
    if (res.code == 200) {
      props.setQuery();
      drawerRight.value = false;
      ElMessage.success("合并成功");
    }
  });
};
const closeFun = () => {
  form1.value = {
    mergeWithClueId: "",
  };
  form2.value = {
    mergeByClueId: "",
  };
  selectData1.value = "";
  selectData2.value = "";
};

onMounted(() => {
  pageList();
});
defineExpose({ confirmClick });
</script>

<style lang="less" scoped>
:deep(.el-drawer__body) {
  padding-top: 0;
  padding-left: 40px;
}
:deep(.el-drawer__header) {
  padding-left: 40px;
}
.title_text {
  height: 16px;
  border-left: 3px solid #f65800;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: 600;
  line-height: 16px;
  padding-left: 8px;
}
.top_info {
  width: 100%;
  background: #fff7f2;
  padding: 8px;
  color: #f65800;
  font-size: 14px;
  text-align: left;
  line-height: 22px;
  margin-bottom: 30px;
}
.hb_box {
  display: flex;
  justify-content: left;
  .hb_item {
    color: rgba(0, 0, 0, 0.85);
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    width: 650px;
    margin-right: 40px;
  }
}
.el-form {
  margin-top: 25px;
  font-weight: 400;
}
.info_box {
  margin-top: 20px;
  background-color: #f7f7f7;
  width: calc(100% - 79px);
  margin-left: 79px;
  padding: 28px;
}
.info_item {
  margin-bottom: 10px;
}
.info_text {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
  display: inline-block;
  // vertical-align: middle;
}
.info_w {
  width: 85px;
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
</style>
