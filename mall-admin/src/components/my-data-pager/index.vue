<template>
  <div class="my-data-pager" ref="pager" v-if="showPager">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      background
      :layout="layout"
      :hide-on-single-page="false"
      :total="totalCount"
      :current-page="pageIndex"
      :page-sizes="pageSizes"
      :page-size="pageSize"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, computed, watch } from "vue";
import emitter from "../../utils/eventBus";

const props = defineProps({
  pager: {
    type: Object,
    default: () => ({}),
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
  layout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper",
  },
});

const pageIndex = ref(props.pager.current || 1);
const pageSize = ref(props.pager.size || 20);

watch(pageIndex, (val) => {
  props.pager.current = val;
});
watch(pageSize, (val) => {
  props.pager.size = val;
});

const totalCount = computed(() => props.pager.total || 0);
const showPager = computed(() => totalCount.value > pageSize.value);
const changeEvent = computed(() => props.pager.event || "pager-change");

function handleSizeChange(val) {
  pageIndex.value = 1;
  pageSize.value = val;
  emitter.emit(changeEvent.value, {
    pageIndex: pageIndex.value,
    pageSize: val,
  });
}

function handlePageChange(val) {
  emitter.emit(changeEvent.value, {
    pageIndex: val,
    pageSize: pageSize.value,
  });
}
</script>

<style scoped lang="less">
.my-data-pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
