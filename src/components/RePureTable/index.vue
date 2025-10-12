<template>
  <div class="q-pure-table">
    <div class="q-pure-main">
      <div class="q-pure-title">
        <template v-if="slots?.title">
          <slot name="title" />
        </template>
        <p v-else class="font-bold">{{props.title}}</p>
      </div>
      <div class="q-pure-action">
        <template v-if="slots?.buttons">
          <div class="slot-buttons">
            <slot name="buttons" />
          </div>
        </template>
        <el-tooltip
          effect="dark"
          content='刷新'
          placement="top"
        >
          <Refresh class="svg-icon rotate" @click="onReFresh" :style="{transform: `rotate(${rotate}deg)`}"/>
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-tooltip
          effect="dark"
          content='密度'
          placement="top"
        >
        <el-dropdown trigger="click">
          <svg-icon name="collapse" />
          <template #dropdown>
            <el-dropdown-menu class="translation">
              <el-dropdown-item
                v-for="item in dropdown"
                @click="clickDropdown(item)"
              >
                {{ item.name }}
              </el-dropdown-item>
              
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-tooltip
          effect="dark"
          content='列设置'
          placement="top"
        >
          <div>
            <el-popover
            placement="bottom-start"
            :popper-style="{padding: 0}"
            width="200"
            trigger="click"
            popper-class="columnSettings"
          >
            <template #reference>
              <svg-icon 
                name="settings" 
                @click="isExpandAll = !isExpandAll" 
              />
            </template>
            <div class='top-class'>
              <el-checkbox
                label="列展示"
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="value => handleCheckAllChange(value)"
              />
              <el-button type="primary" link @click="onReset">
                重置
              </el-button>
            </div>
            <div class="drag-list">
              <el-scrollbar max-height="36vh">
                <el-checkbox-group
                  v-model="checkedColumns"
                  @change="value => handleCheckedColumnsChange(value)"
                >
                  <el-space
                    direction="vertical"
                    alignment="flex-start"
                    size=""
                  >
                  <div class="drag-item" v-for="item in checkColumnList">
                      <svg-icon 
                        name="drag"
                        :class='[
                                  "drag-btn",
                                  isFixedColumn(item)
                                    ? "!cursor-no-drop"
                                    : "!cursor-grab"
                                ]'
                        @mouseenter="(e) => rowDrop(e)"
                      />
                      <el-checkbox
                        :key="item.label"
                        :label="item"
                        @change="value => handleCheckColumnListChange(value, item)"
                      >
                        <span :title="item">
                          {{item}}
                        </span>
                      </el-checkbox>
                    </div>
                  </el-space>
                </el-checkbox-group>
              </el-scrollbar>
            </div>
            </el-popover>
          </div>
        </el-tooltip>
      </div>
    </div>
    <slot :dynamicColumns="dynamicColumns" :size="size" />
  </div>
</template>
<script setup>
import { Refresh } from "@element-plus/icons-vue";
import {
  delay,
  cloneDeep,
  isBoolean,
  isFunction,
  getKeyList
} from "@pureadmin/utils";

import Sortable from "sortablejs";
import {ref, nextTick, computed} from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const fullPath = computed(() => {
  return router.currentRoute.value.fullPath;
});


const slots = defineSlots();

const props = defineProps({
  title: String,
  columns: Array,
});

const emits= defineEmits(['refresh'])
const isExpandAll = ref(false);
const loading = ref(false);
const size = ref('default');
const rotate = ref(0);

// 密度下啦
const dropdown = ref([
  {
    name: '宽松',
    value: 'large'
  },
  {
    name: '默认',
    value: 'default'
  },
  {
    name: '紧凑',
    value: 'small'
  },
]);
const clickDropdown = (item) => {
  size.value = item.value;
}
const onReFresh = () => {
  if(loading.value) return;
  loading.value = true;
  emits("refresh");
  rotate.value += 180;
  delay(500).then(() => (loading.value = false));
}

// const checkAll = ref(true);
// const isIndeterminate = ref(false);
// const filterColumns = cloneDeep(props?.columns).filter(column =>
//       isBoolean(column?.hide)
//         ? !column.hide
//         : !(isFunction(column?.hide) && column?.hide())
//     );
// const checkColumnList = ref(getKeyList(cloneDeep(props?.columns), "label"));
// const checkedColumns = ref(getKeyList(cloneDeep(filterColumns), "label"));
// const dynamicColumns = ref(cloneDeep(props?.columns));

const getColumns = localStorage.getItem(fullPath.value);
const pGetColumns = getColumns ? JSON.parse(getColumns).map(item => {
  const find = props?.columns.find((i) => i.prop === item.prop);
  return {
    ...find,
    hide: item.hide
  }
}) : null;
const myColumns = (pGetColumns && pGetColumns.length == cloneDeep(props?.columns).length) ? pGetColumns : cloneDeep(props?.columns);
const noHideLength = myColumns.filter(item => !item.hide).length;
const columnsLength = props?.columns?.length;
const checkAll = ref(noHideLength === columnsLength);
const isIndeterminate = ref(noHideLength > 0 && noHideLength < columnsLength);
const filterColumns = cloneDeep(myColumns).filter(column =>
      isBoolean(column?.hide)
        ? !column.hide
        : !(isFunction(column?.hide) && column?.hide())
    );
const checkColumnList = ref(getKeyList(myColumns, "label"));
const checkedColumns = ref(getKeyList(cloneDeep(filterColumns), "label"));
const dynamicColumns = ref(myColumns);

const handleCheckAllChange = (val) => {
  checkedColumns.value = val ? checkColumnList.value : [];
  isIndeterminate.value = false;
  dynamicColumns.value.map(column =>
    val ? (column.hide = false) : (column.hide = true)
  );
  localStorage.setItem(fullPath.value, JSON.stringify(dynamicColumns.value));
}


const handleCheckColumnListChange = (val, label) => {
  dynamicColumns.value.filter(item => item.label === label)[0].hide = !val;
  localStorage.setItem(fullPath.value, JSON.stringify(dynamicColumns.value));
}

const handleCheckedColumnsChange = (value) => {
  const checkedCount = value && value.length;
  checkAll.value = checkedCount === checkColumnList.value.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < checkColumnList.value.length;
}


    /** 列展示拖拽排序 */
    const rowDrop = (event) => {
      event.preventDefault();
      nextTick(() => {
        const wrapper = document.querySelector(
          ".el-checkbox-group>div"
        );
        Sortable.create(wrapper, {
          animation: 300,
          handle: ".drag-btn",
          onEnd: ({ newIndex, oldIndex, item }) => {
            const targetThElem = item;
            const wrapperElem = targetThElem.parentNode;
            const oldColumn = dynamicColumns.value[oldIndex];
            const newColumn = dynamicColumns.value[newIndex];
            if (oldColumn?.fixed || newColumn?.fixed) {
              // 当前列存在fixed属性 则不可拖拽
              const oldThElem = wrapperElem.children[oldIndex];
              if (newIndex > oldIndex) {
                wrapperElem.insertBefore(targetThElem, oldThElem);
              } else {
                wrapperElem.insertBefore(
                  targetThElem,
                  oldThElem ? oldThElem.nextElementSibling : oldThElem
                );
              }
              return;
            }
            const currentRow = dynamicColumns.value.splice(oldIndex, 1)[0];
            dynamicColumns.value.splice(newIndex, 0, currentRow);
            localStorage.setItem(fullPath.value, JSON.stringify(dynamicColumns.value));
          }
        });
      });
    };

const isFixedColumn = (label) => {
      return dynamicColumns.value.filter(item => item.label === label)[0].fixed
        ? true
        : false;
    };

const onReset = async() => {
  checkAll.value = true;
  isIndeterminate.value = false;
  localStorage.removeItem(fullPath.value);
  dynamicColumns.value = cloneDeep(props?.columns);
  checkColumnList.value = [];
  checkColumnList.value = await getKeyList(cloneDeep(props?.columns), "label");
  checkedColumns.value = getKeyList(cloneDeep(filterColumns), "label");
}


</script>
<style lang="less" scoped>
.q-pure-table {
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  .q-pure-main {
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .q-pure-title {
     .font-bold {
       font-weight: 600;
       font-size: 14px;
     }
    }
    .q-pure-action {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .slot-buttons {
        display: flex;
        padding: 0 10px;
      }
      .svg-icon {
        flex-shrink: 0;
        color: #000;
        cursor: pointer;
        width: 16px;
        height: 32px;
        &.rotate {
          transition: transform .5s ease-in-out;
        }
      }
    }
  }

}

</style>
<style lang="less">
.columnSettings {
  padding: 0;
  .top-class {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 11px 0;
    border-bottom: 1px solid rgb(220,223,230);
  }
  .drag-list {
    padding: 6px 0 0 11px;
    .drag-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 18px;
      .svg-icon {
        margin-right: 5px;
        &.drag-btn {
          cursor: grab;
        }
      }
    }
  }
}
</style>