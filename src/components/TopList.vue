<template>
  <q-card flat class="q-mb-md">
    <q-list class="text-caption">
      <q-toolbar>
        <q-toolbar-title
          ><q-icon name="settings" size="24px" class="q-mr-md" />Portfeuilles
          optimisés</q-toolbar-title
        >
      </q-toolbar>
      <q-item
        v-for="(p, i) in data"
        clickable
        @click="() => (portfolioForExplication = { ...p, name: `P${i + 1}` })"
      >
        <q-item-section avatar>
          <q-avatar class="text-bold" color="dark" text-color="white">P{{ i + 1 }}</q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>Rendement: {{ p.y }}%</q-item-label
          ><q-item-label>Risque: {{ p.x }}%</q-item-label>
          <q-item-label
            >Poids: [ <span v-for="w in p.weights">{{ w }}% ; </span> ]</q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>

  <q-card flat v-if="portfolioForExplication">
    <q-toolbar>
      <q-toolbar-title>Traduction</q-toolbar-title>
    </q-toolbar>
    <q-card-section class="q-py-none">
      <span class="text-h6">Pour {{ portfolioForExplication.name }}</span> <br />
      En investissant
      <span v-for="(w, i) in portfolioForExplication.weights"> {{ `${w}% sur A${i + 1},` }}</span>
      on obtiendra {{ portfolioForExplication.y + '%' }} avec
      {{ portfolioForExplication.x + '%' }} de variation. Cette variation du rendement est entre [
      {{
        (portfolioForExplication.y - portfolioForExplication.x).toFixed(2) +
        '% ; ' +
        (portfolioForExplication.y + portfolioForExplication.x).toFixed(2) +
        '%'
      }}] qui se traduit par [rendement - risque ; rendement + risque]
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { IPoint } from '@/interfaces/types'
import { ref } from 'vue'

const props = defineProps<{ data: IPoint[] }>()
const emits = defineEmits(['portfolioClicked'])

const portfolioForExplication = ref<IPoint & { name: string }>()

if (props.data.length > 0) {
  portfolioForExplication.value = { ...props.data[0]!, name: `P1` }
}
</script>

<style scoped lang="css">
.list {
  border-radius: 24px;
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: white;
}
</style>
