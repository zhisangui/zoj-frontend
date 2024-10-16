<template>
  <Editor
    :value="props.value"
    :mode="props.mode"
    :plugins="plugins"
    @change="props.handleChange"
  />
</template>

<script setup lang="ts">
import { Editor } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { defineProps, withDefaults } from "vue";

interface Props {
  value: string;
  mode?: string;
  handleChange: (v: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  mode: () => "split",
  handleChange: (v: string) => {
    console.log(v);
  },
});

const plugins = [
  gfm(),
  highlight(),
  // Add more plugins here
];
</script>
<style scoped>
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}
</style>
