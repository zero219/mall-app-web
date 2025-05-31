<template>
  <transition name="slide">
    <div class="my-data-modal" :class="modalClass" v-show="showModal">
      <div class="mask"></div>
      <div
        class="modal-dialog"
        :style="{ width: modalDialogWidth, 'max-height': modalHeight }"
      >
        <div class="modal-header">
          <slot name="header">
            <span class="title">{{ title }}</span>
          </slot>
          <span class="close" @click="hide('close')" v-if="showClose">
            <i class="el-icon-circle-close"></i>
          </span>
        </div>
        <div class="modal-body" :style="{ 'max-height': modalBodyHeight }">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer" v-if="showFooter">
          <slot name="footer">
            <div class="btn-group">
              <el-button @click="hide('cancel')" :disabled="cancelDisabled">
                {{ cancelText }}
              </el-button>
              <slot name="buttons"></slot>
              <el-button
                type="primary"
                @click="$emit('ok')"
                v-if="showOk"
                :disabled="okDisabled"
                :loading="loading"
              >
                {{ loading ? "请稍后" : okText }}
              </el-button>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, defineExpose } from "vue";
import { useWindowSize } from "@vueuse/core";

const props = defineProps({
  title: String,
  customClass: {
    type: String,
    default: "",
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  showOk: {
    type: Boolean,
    default: true,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: "md",
  },
  scrollable: {
    type: Boolean,
    default: false,
  },
  width: String,
  okText: {
    type: String,
    default: "确定",
  },
  cancelText: {
    type: String,
    default: "关闭",
  },
  cancelDisabled: {
    type: Boolean,
    default: false,
  },
  okDisabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["ok", "reset", "cancel", "close"]);

const showModal = ref(false);

const modalSizes = [
  { size: "xm", value: "300px" },
  { size: "sm", value: "400px" },
  { size: "md", value: "600px", default: true },
  { size: "lg", value: "900px" },
  { size: "xl", value: "1200px" },
];

const modalDialogWidth = computed(() => {
  if (props.width) {
    const width = props.width + "";
    const units = ["%", "px", "vw", "em", "rem"];
    return units.some((unit) => width.endsWith(unit))
      ? width
      : parseFloat(width) + "px";
  }
  const found =
    modalSizes.find((item) => item.size === props.size) ||
    modalSizes.find((item) => item.default);
  return found.value;
});

const { height } = useWindowSize();

const modalHeight = computed(() => `${height.value * 0.5}px`);
const modalBodyHeight = computed(
  () => `${parseInt(modalHeight.value) - 120}px`
);

const modalClass = computed(
  () => `${props.scrollable ? "modal-scroll" : ""} ${props.customClass}`
);

function show() {
  showModal.value = true;
}

function hide(evt = "") {
  showModal.value = false;
  emit("reset");
  if (evt) emit(evt);
}

defineExpose({ show, hide });
</script>

<style lang="less">
@import "./index.less";
</style>
