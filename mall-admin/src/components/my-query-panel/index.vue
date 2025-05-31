<template>
  <div>
    <el-card class="my-query-panel">
      <el-form
        ref="queryFormRef"
        :model="queryForm"
        :inline="true"
        label-width="80px"
      >
        <el-form-item
          v-for="(condition, index) in queryForm.conditions"
          :key="index"
          :label="condition.label"
        >
          <!-- 输入框 -->
          <el-input
            v-if="condition.type === 'input'"
            v-model="condition[Object.keys(condition)[2]]"
          />
          <!-- 下拉框 -->
          <el-select
            v-else-if="condition.type === 'select'"
            v-model="condition[Object.keys(condition)[2]]"
            :placeholder="`请选择${condition.label}`"
          >
            <el-option
              v-for="item in condition.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- 日期选择 -->
          <el-date-picker
            v-else-if="condition.type === 'date'"
            v-model="condition[Object.keys(condition)[2]]"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item class="form-buttons">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, defineProps, getCurrentInstance } from "vue";

/**
 * 查询模块组件
 * 用于统一管理表单条件查询，支持 input/select/date 类型
 */

// props
const props = defineProps({
  queryForm: {
    type: Object,
    default: () => ({
      conditions: [
        {
          type: "input",
          label: "文本条件",
          value: "",
        },
      ],
    }),
  },
});

// 表单 ref
const queryFormRef = ref(null);

// 向父组件发出查询条件
const emit = defineEmits(["queryFilter"]);

// 调用父组件方法
const { proxy } = getCurrentInstance();

function onSubmit() {
  emit("queryFilter", props.queryForm.conditions);
  proxy?.$parent?.getDataList?.();
}

function reset() {
  props.queryForm.conditions.forEach((condition) => {
    condition[Object.keys(condition)[2]] = "";
  });
}
</script>

<style lang="less" scoped>
.my-query-panel {
  margin-bottom: 20px;
}

.query-form {
  display: flex;
  flex-wrap: wrap;
  position: relative;
}

.form-btn-right {
  margin-left: auto;
  margin-top: auto;
}
</style>
