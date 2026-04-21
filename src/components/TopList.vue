<template>
  <q-card flat>
    <q-list separator>
      <q-item-label header class="text-center">Solution optimal</q-item-label>
      <q-separator />
      <q-item v-for="(p, i) in data">
        <q-item-section avatar>
          <q-icon text-color="white"> P{{ i + 1 }} </q-icon>
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
</template>

<script setup lang="ts">
import type { IPoint } from '@/interfaces/types'

const props = defineProps<{ data: IPoint[] }>()
</script>
