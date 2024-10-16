<template>
  <div id="QuestionsView">
    <a-form :model="searchParams" layout="inline" @submit="loadData">
      <a-form-item field="title" label="题目" style="min-width: 240px">
        <a-input
          v-model="searchParams.title"
          allow-clear
          placeholder="请输入题目"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 240px">
        <a-input-tag
          v-model="searchParams.tags"
          allow-clear
          placeholder="请输入标签"
        />
      </a-form-item>
      <a-form-item>
        <a-button html-type="submit" type="primary" @click="doSearch"
          >搜索
        </a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @pageChange="onPageChange"
    >
      <template #tags="{ record }">
        <a-space>
          <a-tag v-for="(tag, item) of record.tags" color="blue" :key="item">
            {{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptRate="{ record }">
        {{
          `${
            record.submitNum
              ? ((record.acceptNum / record.submitNum) * 100).toFixed(2)
              : "0"
          }% (${record.acceptNum}/${record.submitNum})`
        }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>

      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="viewQuestion(record)">
            开始做题
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const show = ref(true);
const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  pageSize: 10,
  current: 1,
  title: "",
  tags: [],
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost1(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

watchEffect(() => {
  loadData();
});

/**
 * 分页数据变化时
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const columns = [
  {
    title: "题号",
    dataIndex: "id",
  },
  {
    title: "题目",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptRate",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "做题",
    slotName: "optional",
  },
];

const router = useRouter();

const doSearch = async () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};

const viewQuestion = (record: any) => {
  router.push({
    path: `/view/question/${record.id}`,
  });
};
</script>

<style scoped>
#QuestionsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
