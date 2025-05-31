<template>
  <div class="my-data-table">
    <div class="table-header" v-if="props.headerShow">
      <div class="left">
        <div class="title" v-if="props.tableTitle">
          <i class="el-icon-date"></i>&nbsp;{{ props.tableTitle }}
        </div>
        <slot name="left"></slot>
      </div>
      <div class="right">
        <slot name="tableBtn"></slot>
        <div
          v-for="(item, index) in props.tableHeaderButtons"
          :key="index"
          class="list"
        >
          <el-button
            :type="item.type || item.type === '' ? item.type : 'primary'"
            size="default"
            @click="item.clickFunc"
            >{{ item.buttonName }}</el-button
          >
        </div>
      </div>
    </div>

    <el-table
      class="table-float"
      :border="props.border"
      :max-height="props.tableFixedHeigth"
      :data="props.data"
      :row-key="props.rowKey"
      @selection-change="handleSelectionChange"
      :row-class-name="props.rowClassName"
      @sort-change="sortChange"
    >
      <el-table-column
        v-if="props.checkbox"
        type="selection"
        :reserve-selection="props.keepSelect"
        align="center"
        :width="props.checkboxWidth"
        fixed
      />

      <el-table-column
        v-if="props.isIndex"
        type="index"
        label="序号"
        align="center"
        width="60"
        fixed
      >
        <template #default="scope">
          <span>{{
            scope.$index + (props.pager.current - 1) * props.pager.size + 1
          }}</span>
        </template>
      </el-table-column>

      <template v-for="(item, index) in props.options" :key="index">
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :width="item.width || 'auto'"
          :min-width="item.minWidth"
          header-align="left"
          :align="item.align || 'left'"
          :fixed="props.data.length > 0 ? item.fixed : false"
          :sortable="item.sortable || false"
          :show-overflow-tooltip="item.overflow ?? true"
        >
          <template #default="scope">
            <slot
              v-if="item.slot"
              :name="scope.column.property"
              :row="scope.row"
              :index="scope.$index"
            ></slot>
            <span v-else>{{ scope.row[scope.column.property] }}</span>
          </template>
        </el-table-column>
      </template>

      <el-table-column
        v-if="props.menu"
        label="操作"
        :align="props.menuAlign"
        :width="props.menuWidth"
        :fixed="customFixed"
      >
        <template #default="scope">
          <div class="menu-cell">
            <slot name="menu" :row="scope.row" :index="scope.$index"></slot>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="table-footer">
      <div class="footer">
        <slot name="footer"></slot>
      </div>
      <MyDataPager :pager="props.pager"></MyDataPager>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";
import MyDataPager from "../my-data-pager/index.vue";

const props = defineProps({
  headerShow: { type: Boolean, default: true },
  tableTitle: { type: String, default: "列表" },
  tableHeaderButtons: { type: Array, default: () => [] },
  checkbox: { type: Boolean, default: false },
  checkboxWidth: { type: Number, default: 50 },
  isIndex: { type: Boolean, default: false },
  menu: { type: Boolean, default: true },
  menuWidth: { type: Number, default: 150 },
  menuAlign: { type: String, default: "center" },
  menuFixed: { type: [Boolean, String], default: false },
  pager: { type: Object, default: () => ({}) },
  tableFixedHeigth: { type: String, default: "auto" },
  data: { type: Array, default: () => [] },
  options: { type: Array, default: () => [] },
  rowClassName: Function,
  isCategory: { type: Boolean, default: false },
  autoTableFixed: { type: Boolean, default: false },
  rowKey: { type: String, default: "" },
  keepSelect: { type: Boolean, default: false },
  border: { type: Boolean, default: true },
});

const emits = defineEmits(["sortChange"]);

const selected = ref([]);

const customFixed = computed(() => {
  const list = [true, "left", "right"];
  return list.includes(props.menuFixed) ? props.menuFixed : false;
});

function handleSelectionChange(val) {
  selected.value = val;
}

function sortChange(column) {
  emits("sortChange", {
    columnName: column.prop,
    order: column.order,
  });
}
</script>

<style lang="less" scoped>
.my-data-table {
  th.el-table-column--selection {
    .cell {
      padding-left: 7px !important;
    }
  }
  .menu-cell {
    display: flex;
    .btn-wrapper {
      display: flex;
      flex-wrap: wrap;
      button {
        margin: 5px;
      }
    }
  }
  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    margin: 16px -20px;
    height: 10px;
    :deep(.el-button) {
      min-width: 80px;
      padding: 10px 15px;
      font-size: 12px;
      border-radius: 3px;
    }
    > .left {
      .title {
        color: #333;
        font-size: 16px;
        font-weight: 600;
      }
    }
    > .right {
      display: flex;
      align-items: center;
      .list {
        margin-left: 10px;
      }
    }
  }
  .table-footer {
    display: flex;
    justify-content: space-between;
    .footer {
      flex: 2;
    }
    .fl-data-pager {
      flex: 4;
    }
  }
}
.el-card__body {
  padding-top: 10px;
}
</style>
