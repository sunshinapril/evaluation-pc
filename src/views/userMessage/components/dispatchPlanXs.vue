<template>
  <div>
    <el-dialog
      style="text-align: left"
      v-model="dialogVisible"
      :title="title"
      width="1000"
      :before-close="handleClose"
    >
      <template #header>
        <div class="my_header">
          {{ title }}
        </div>
      </template>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="auto"
        style="max-width: 1000px"
      >
        <el-form-item label="">
          <div class="select_bm_box">
            <div
              :class="[
                'bm_item',
                selsetBmIndex == index ? 'bm_item_ac' : 'bm_item_nol',
              ]"
              v-for="(item, index) in bmList"
              :key="index"
              @click="selsetBmFun(index)"
            >
              {{ item.name }}
            </div>
          </div>
        </el-form-item>

        <el-form-item label="选择分配模式" style="width: 700px">
          <div style="margin-top: 30px; margin-left: -95px">
            <el-radio-group v-model="form.optSystagType">
              <el-radio :value="1"
                >自动平均分配（所有线索自动随机分配给所选营业部）</el-radio
              >
              <el-radio :value="2"
                >手动调整分配（按参数手动调整营业部分配比例）</el-radio
              >
            </el-radio-group>
          </div>
        </el-form-item>
        <el-table
          border
          :data="form.dataTable"
          style="width: 100%; margin-top: 5px"
          :header-cell-style="headerCellStyle"
        >
          <template #empty>
            <div class="table_box">
              <img src="../../../assets/images/common/table_bg.png" alt="" />
              <div>暂无数据</div>
            </div>
          </template>
          <el-table-column
            prop="exchangeName"
            label="所属营业部"
            min-width="250"
          />
          <el-table-column prop="productName" label="销售名称" min-width="100">
          </el-table-column>
          <el-table-column prop="productName" label="绩效" min-width="100">
            <template #default="scope">
              <el-input
                v-model="scope.row.num"
                type="number"
                style="width: 100px"
                :min="1"
                placeholder=""
              />
            </template>
          </el-table-column>
          <el-table-column prop="openFeeRate" label="分配比例" min-width="100">
            <template #default="scope">
              <el-input
                v-model="scope.row.num"
                type="number"
                style="width: 100px"
                :min="1"
                placeholder=""
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="openFeeRate"
            label="保有量上限"
            min-width="100"
          >
            <template #default="scope">
              <el-input
                v-model="scope.row.num"
                type="number"
                style="width: 100px"
                :min="1"
                placeholder=""
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false"
            >取消</el-button
          >
          <el-button size="small" type="primary" @click="onSubmit">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { groupUpdate } from "@/api/userMessage/codeMessage";
const props = defineProps({ codeListFun: Function });

const dialogVisible = ref(false);
const chartList = ref([]);
const formRef = ref();
const title = ref("营业部-销售分配规则");

const selsetBmIndex = ref(0);
const bmList = ref([
  {
    name: "上海浦东大道营业部",
    type: "1",
  },
  {
    name: "北京王府井营业部",
    type: "2",
  },
]);

const selsetBmFun = (index) => {
  selsetBmIndex.value = index;
};

const form = ref({
  groupName: "",
  tagList: [],
  dataTable: [],
  optSystagType: 1,
});
const rules = ref({
  groupName: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
  tagList: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
});

const handleOpen = (item) => {
  console.log(item);
  dialogVisible.value = true;
};

const onSubmit = () => {
  console.log(form.value);
  formRef.value.validate((valid) => {
    if (valid) {
      form.value.tagList = arr;
      groupUpdate(form.value).then((res) => {
        if (res.code == 200) {
          props.codeListFun();
          handleClose();
          ElMessage.success("修改成功");
        }
      });
    }
  });
};

const headerCellStyle = () => {
  return {
    background: "#f5f7fa",
    color: "#111316",
    fontSize: "14px",
    fontWeight: 600,
  };
};

const handleClose = () => {
  formRef.value.resetFields();
  form.value = {
    groupName: "",
    tagList: [],
  };
  dialogVisible.value = false;
};

defineExpose({ handleOpen });
</script>

<style lang="less" scoped>
::v-deep .el-dialog {
  padding: 0;
}
::v-deep .el-dialog__headerbtn {
  height: 60px;
}
::v-deep .el-dialog__header.show-close {
  padding-right: 0;
}
.my_header {
  width: 100%;
  height: 60px;
  line-height: 60px;
  padding-left: 20px;
  border-bottom: 0.5px solid #d9d9d9;
  color: #000;
  font-size: 18px;
  font-weight: 600;
}
.el-form {
  padding: 0 20px;
}
.dialog-footer {
  padding: 20px;
}

.title_text {
  height: 16px;
  border-left: 3px solid #f65800;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  padding-left: 8px;
}
.addTag {
  color: #979797;
  font-size: 14px;
  line-height: 20px;
  padding-left: 92px;
  cursor: pointer;
}
.top_title {
  font-weight: 600;
  font-size: 16px;
  color: #000;
  padding-left: 20px;
  margin-bottom: 15px;
}
.table_box {
  line-height: 0;
  display: inline-block;
  img {
    width: 80px;
    height: 80px;
    margin-top: 20px;
  }
  div {
    height: 20px;
    margin-top: 0;
    line-height: 20px;
  }
}
:deep(.el-table__empty-block) {
  min-height: 150px !important;
}
.select_bm_box {
  display: flex;
  justify-content: left;
  .bm_item {
    margin-right: 12px;
    padding: 6px 20px;
    line-height: 20px;
    border-radius: 2px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  .bm_item_ac {
    border: 1px solid #f65800;
    background: #fff7f3;
    color: #f65800;
  }
  .bm_item_nol {
    border: 1px solid #e0e0e0;
    background: #fafafa;
    color: #000;
  }
}
</style>
