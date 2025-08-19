<script setup lang="ts">
import AuthenticatedLayout from "@/layout/AuthenticatedLayout.vue";

import {useI18n} from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <AuthenticatedLayout>
    {{ t('hello_world') }}
  </AuthenticatedLayout>
</template>

