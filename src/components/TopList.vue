<template>
  <q-card flat>
    <q-list separator>
      <q-item-label header class="text-h6 text-bold text-grey"
        ><q-icon name="bolt" size="sm" color="green" />Portefeuilles optimals
      </q-item-label>
      <q-separator />
      <q-scroll-area style="height: 100vh">
        <q-item
          v-for="(p, i) in data"
          clickable
          @click="() => emits('portfolioClicked', { ...p, name: `P${i + 1}` })"
        >
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
      </q-scroll-area>
    </q-list>
  </q-card>
</template>

<script setup lang="ts">
import type { IPoint } from '@/interfaces/types'

const props = defineProps<{ data: IPoint[] }>()
const emits = defineEmits(['portfolioClicked'])
</script>
