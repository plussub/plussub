<template>
  <a class="knopf flat pill sharp buttonOnPrimary" @click="backFn ? backFn() : toHome() ">
    <i class="fa fa-chevron-left fa-lg"></i>
  </a>
</template>

<script setup="props" lang="ts">
export {toHome} from "@/navigation/state/actions";

declare const props: {
  backFn?: () => void;
};

</script>
