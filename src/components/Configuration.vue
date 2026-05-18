<template>
  <q-list bordered padding class="rounded-borders fit">
    <q-item class="q-pa-none q-ma-none">
      <q-item-label header class="text-bold text-gray text-h6">Actif à investir</q-item-label>
      <q-item-label class="bg-grey"
        ><q-btn icon="add" label="nouveau actif" color="primary" no-caps @click="addAsset" flat
      /></q-item-label>
    </q-item>

    <q-item v-ripple v-for="(asset, i) in assets">
      <q-item-section avatar>
        <q-avatar color="grey" text-color="white">A{{ i + 1 }}</q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>Rendement(%)</q-item-label>
        <q-item-label caption
          ><q-input color="green" type="number" outlined v-model="asset.return" min="0"
        /></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label>Risque(%)</q-item-label>
        <q-item-label caption
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

    <q-separator spaced />

    <q-item-label header>Paramètre de l'algorithme</q-item-label>
    <q-item v-ripple>
      <q-item-section>
        <q-item-label lines="1">Nombre de génération</q-item-label>
        <q-item-label>
          <q-input color="green" type="number" outlined v-model="generation" min="0" />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item v-ripple>
      <q-item-section>
        <q-item-label lines="1">Taille de la population</q-item-label>
        <q-item-label>
          <q-input color="green" type="number" outlined v-model="population" min="0" />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item v-ripple>
      <q-item-section>
        <q-item-label lines="1">Taux de mutation (%)</q-item-label>
        <q-item-label>
          <q-input color="green" type="number" outlined v-model="mutation" min="0" />
        </q-item-label>
      </q-item-section>
    </q-item>

    <div>
      <q-btn @click="applyConfiguration" label="Appliquer" color="primary" no-caps class="fit" />
    </div>
  </q-list>
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
