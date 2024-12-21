<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题号" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '320px' }"
          placeholder="选择编程语言"
        >
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
          <a-option>html</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
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
      @page-change="onPageChange"
    >
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #judgeRes="{ record }">
        <span v-if="record.judgeInfo?.message === 'AC'"
          ><a-tag color="green">{{ record.judgeInfo?.message }}</a-tag></span
        ><span v-else-if="record.judgeInfo?.message !== 'AC'"
          ><a-tag color="red">{{ record.judgeInfo?.message }}</a-tag></span
        >
      </template>
      <template #username="{ record }">
        {{ record.user?.userName }}
      </template>
      <template #time="{ record }">
        {{ record.judgeInfo?.time == 0 ? "--" : record.judgeInfo?.time }}
      </template>
      <template #memory="{ record }">
        {{ record.judgeInfo?.memory == 0 ? "--" : record.judgeInfo?.memory }}
      </template>
      <template #status="{ record }">
        <span v-if="record.status === 0"
          ><a-tag color="gray">等待中</a-tag></span
        >
        <span v-else-if="record.status === 1"
          ><a-tag color="pinkpurple">判题中</a-tag></span
        >
        <span v-else-if="record.status === 2"
          ><a-tag color="green">判题完成</a-tag></span
        >
        <span v-else-if="record.status === 3"
          ><a-tag color="red">判题异常</a-tag></span
        >
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import { useStore } from "vuex";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});
const store = useStore();

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost({
    ...searchParams.value,
    sortField: "createTime",
    sortOrder: "descend",
  });
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    router.push({
      path: "/user/login",
      replace: true,
    });
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "题号",
    dataIndex: "questionId",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题结果",
    slotName: "judgeRes",
  },
  {
    title: "时间消耗(ms)",
    slotName: "time",
  },
  {
    title: "内存占用(kb)",
    slotName: "memory",
  },
  {
    title: "判题状态",
    slotName: "status",
  },
  {
    title: "提交者",
    slotName: "username",
  },
  {
    title: "提交时间",
    slotName: "createTime",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
