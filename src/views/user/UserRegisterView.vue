<template>
  <div id="userLoginView">
    <h2 style="margin-bottom: 16px">用户注册</h2>
    <a-form
      style="max-width: 480px; margin: 0 auto"
      label-align="left"
      auto-label-width
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="账号" tooltip="账号不得少于4 位">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item field="userPassword" tooltip="密码不少于 8 位" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item
        field="checkPassword"
        tooltip="两次密码需要一致"
        label="二次密码"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请再次输入密码"
        />
      </a-form-item>
      <a-form-item>
        <div style="display: flex; gap: 120%">
          <a-button type="secondary" @click="toLogin" style="width: 120px">
            登录
          </a-button>
          <a-button type="primary" html-type="submit" style="width: 120px">
            注册
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

/**
 * 表单信息
 */
const form = reactive({
  checkPassword: "",
  userAccount: "",
  userPassword: "",
} as UserRegisterRequest);

const router = useRouter();

/**
 * 提交表单
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userRegisterUsingPost(form);
  // 注册成功，跳转到登录页
  if (res.code === 0) {
    message.success("注册成功，为您跳转到登录页面");
    toLogin();
  } else {
    message.error("注册失败，" + res.message);
  }
};

const toLogin = () => {
  router.push({
    path: "/user/login",
    replace: true,
  });
};
</script>
