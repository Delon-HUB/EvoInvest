<template>
  <div class="fit q-px-md">
    <q-toolbar>
      <q-toolbar-title
        ><q-icon name="settings" size="24px" class="q-mr-md" />Paramètre de
        l'algorithme</q-toolbar-title
      >
    </q-toolbar>
    <q-card flat>
      <q-list class="q-mb-md">
        <q-item class="q-ma-none q-pa-none">
          <q-item-label header caption>Actifs</q-item-label>
          <q-space />
          <q-item-label class="q-px-md"
            ><q-btn round flat icon="add_circle" no-caps @click="addAsset"
          /></q-item-label>
        </q-item>
        <q-item v-for="(asset, i) in assets">
          <q-item-section avatar>
            <q-avatar class="text-bold" color="dark" text-color="white">A{{ i + 1 }}</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Rendement(%)</q-item-label>
            <q-item-label
              ><q-input color="green" type="number" outlined v-model="asset.return" min="0"
            /></q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Risque(%)</q-item-label>
            <q-item-label
              ><q-input color="green" type="number" outlined v-model="asset.risk" min="0"
            /></q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn
              flat
              icon="delete"
              color="negative"
              @click="() => removeAsset(i)"
              v-if="assets.length > 2"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-card flat>
      <q-list>
        <q-item-label header caption>Évolution</q-item-label>
        <q-item>
          <q-item-section>
            <q-item-label lines="1" caption>Nombre de génération</q-item-label>
            <q-item-label>
              <q-input color="green" type="number" outlined v-model="generation" min="0" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label lines="1" caption>Taille de la population</q-item-label>
            <q-item-label>
              <q-input color="green" type="number" outlined v-model="population" min="0" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label lines="1" caption>Taux de mutation (%)</q-item-label>
            <q-item-label>
              <q-input color="green" type="number" outlined v-model="mutation" min="0" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <div class="q-my-lg">
      <q-btn
        rounded
        outline
        @click="applyConfiguration"
        label="Appliquer"
        no-caps
        class="fit text-white bg-secondary text-bold"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAsset } from '@/interfaces/types'
import { computed, ref } from 'vue'

const generation = ref('10')
const population = ref('5')
const mutation = ref('10')

const assets = ref<IAsset[]>([
  {
    name: '1',
    return: 30,
    risk: 10,
  },
  {
    name: '2',
    return: 40,
    risk: 20,
  },
  {
    name: '3',
    return: 50,
    risk: 30,
  },
])

const addAsset = () => {
  assets.value.push({
    name: 'C',
    return: 10,
    risk: 10,
  })
}

const removeAsset = (index: number) => {
  assets.value.splice(index, 1)
}

const parameters = computed(() => ({
  generationSize: Math.sqrt(Math.pow(parseFloat(generation.value), 2)) || 0,
  populationSize: Math.sqrt(Math.pow(parseFloat(population.value), 2)) || 0,
  mutationRate: Math.sqrt(Math.pow(parseFloat(mutation.value), 2)) / 100 || 0,
}))

const emits = defineEmits(['configurationChanged'])

const applyConfiguration = () => {
  emits(
    'configurationChanged',
    parameters.value,
    assets.value.map((asset) => ({
      name: asset.name,
      return: asset.return / 100,
      risk: asset.risk / 100,
    })),
  )
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
