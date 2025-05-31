<template>
  <my-data-modal
    ref="dataModal"
    :title="modalTitle"
    :loading="loading"
    width="550px"
    @ok="$emit('confirm')"
  >
    <template #body>
      <p class="modal-content">{{ modalMessage }}</p>
    </template>
  </my-data-modal>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import MyDataModal from "../my-data-modal/index.vue";

/**
 * 组件说明
 * 该组件为全局统一的简单弹窗提示组件，例如删除类的二次弹窗
 * 可配置提示标题、内容、确认取消按钮等
 */
const props = defineProps({
  title: {
    // 弹窗标题
    type: String,
    default: "删除提示",
  },
  message: {
    // 弹窗内容
    type: String,
    default: "此操作将永久删除该数据, 是否继续?",
  },
  loading: {
    // 按钮loading效果
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["confirm"]);

const dataModal = ref(null);
const modalTitle = ref(props.title);
const modalMessage = ref(props.message);

const modal = (title, message) => {
  if (title && message) {
    modalTitle.value = title;
    modalMessage.value = message;
  } else {
    modalTitle.value = props.title;
    modalMessage.value = props.message;
  }
  dataModal.value.show();
};

const hide = () => {
  dataModal.value.hide();
};

// 暴露方法给父组件
defineExpose({
  modal,
  hide,
});
</script>

<style lang="less" scoped>
.modal-content {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
}
</style>
