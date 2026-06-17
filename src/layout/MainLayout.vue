<template>
  <q-layout view="hHh LpR fFf" container style="height: 100vh">
    <q-header class="bg-secondary q-pa-xs">
      <q-toolbar>
        <q-toolbar-title class="text-bold">
          <q-item-label><q-icon size="32px" name="account_balance_wallet" />EvoInvest</q-item-label>
          <q-item-label caption class="text-white">Optimisation de portefeuille</q-item-label>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer class="bg-secondary">
      <div class="q-ma-xs flex justify-between">
        <q-btn
          flat
          rounded
          no-caps
          :icon="drawerLeft ? 'visibility_off' : 'visibility'"
          @click="() => (drawerLeft = !drawerLeft)"
          :label="drawerLeft ? 'Masquer les paramètres' : 'Voir les paramètre'"
          class="text-bold"
        />
        <q-btn
          flat
          rounded
          no-caps
          :icon="drawerRight ? 'visibility_off' : 'visibility'"
          @click="() => (drawerRight = !drawerRight)"
          :label="drawerRight ? 'Masquer la liste' : 'Portefeuilles optimaux'"
          class="text-bold"
        />
      </div>
    </q-footer>

    <q-drawer v-model="drawerLeft" show-if-above :width="450" :breakpoint="700">
      <q-card flat bordered class="fit bg-grey-1">
        <configuration
          @configurationChanged="
            (_parameters, _assets) => {
              parameters = _parameters
              assets = _assets
            }
          "
        />
      </q-card>
    </q-drawer>

    <q-drawer
      side="right"
      v-model="drawerRight"
      show-if-above
      bordered
      :width="450"
      :breakpoint="500"
      class="bg-white"
    >
      <q-card flat class="fit bg-grey-1 q-pa-md">
        <TopList
          :data="
            currentGeneration!.pareto
              .map((p) => ({
                x: parseFloat((p.risk * 100).toFixed(2)),
                y: parseFloat((p.return * 100).toFixed(2)),
                weights: p.weights.map((w) => parseFloat((w * 100).toFixed(2))),
              }))
              .sort((a, b) => b.x - a.x)
          "
        />
      </q-card>
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <q-card flat>
          <q-card-section class="col" align="right">
            <Scatter
              :population="
                currentGeneration!.population.map((p) => ({
                  x: parseFloat((p.risk * 100).toFixed(2)),
                  y: parseFloat((p.return * 100).toFixed(2)),
                  weights: p.weights.map((w) => parseFloat((w * 100).toFixed(2))),
                }))
              "
              :pareto="
                currentGeneration!.pareto.map((p) => ({
                  x: parseFloat((p.risk * 100).toFixed(2)),
                  y: parseFloat((p.return * 100).toFixed(2)),
                  weights: p.weights.map((w) => parseFloat((w * 100).toFixed(2))),
                }))
              "
              :title="`Génération ${counterGen + 1} / ${generations.length}`"
            />
            <q-card-actions class="flex justify-end">
              <div>
                <q-btn no-caps flat @click="previousGeneration" class="q-mr-md" icon="arrow_left">
                  Précedent
                </q-btn>
                <q-btn
                  icon-right="arrow_right"
                  no-caps
                  flat
                  color="secondary"
                  @click="nextGeneration"
                  >Suivant</q-btn
                >
              </div>
            </q-card-actions>
          </q-card-section>
        </q-card>

        <q-card flat class="q-pa-md">
          <q-card-section>
            <p class="text-h5">À propos</p>
            Cette application vous aide à trouver la meilleure façon de répartir votre argent entre
            plusieurs investissements. Elle compare différentes options en tenant compte du
            rendement et du risque, puis met en évidence les choix les plus intéressants. Vous
            pouvez ainsi voir facilement les compromis possibles et choisir celui qui vous convient
            le mieux.
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import Configuration from '@/components/Configuration.vue'
import { ref, computed, watch } from 'vue'

import type { IAsset, IGeneration, IParameters, IPoint, IPortfolio } from '../interfaces/types'
import { crossover, evaluate, generatePopulation, getPareto, mutate } from '../utils'
import Scatter from '../components/scatter.vue'
import { cloneDeep } from 'lodash'
import TopList from '../components/TopList.vue'

const drawerLeft = ref(false)
const drawerRight = ref(false)

const parameters = ref<IParameters>({
  generationSize: 10,
  populationSize: 10,
  mutationRate: 0.1,
})
const generations = ref<IGeneration[]>([])
const counterGen = ref(0)
const currentGeneration = computed(() => generations.value[counterGen.value])

const assets = ref<IAsset[]>([
  {
    name: 'A',
    return: 0.35,
    risk: 0.12,
  },
  {
    name: 'B',
    return: 0.2,
    risk: 0.17,
  },
  {
    name: 'C',
    return: 0.43,
    risk: 0.25,
  },
])

// ------------------------------------------------------------------------------------------------------------------------------

const generationLabo = (parameters: IParameters, assets: IAsset[]): IGeneration[] => {
  const generations: IGeneration[] = []

  for (let i = 0; i < parameters.generationSize; i++) {
    const currentGen: IGeneration = {
      generation: i,
      population: [],
      pareto: [],
    }

    if (i === 0) {
      currentGen.population = generatePopulation(parameters.populationSize, assets)
    } else {
      currentGen.population = [...cloneDeep(generations[i - 1]!.pareto)]
      const totalChildren = parameters.populationSize - generations[i - 1]!.pareto.length

      for (let j = 0; j < totalChildren; j++) {
        const index = Math.floor(Math.random() * generations[i - 1]!.pareto.length)
        const parent = cloneDeep(generations[i - 1]!.pareto[index]!)
        currentGen.population.push(cloneDeep(parent))
      }

      let population: IPortfolio[] = []
      for (let j = 0; j < currentGen.population.length; j++) {
        const index1 = Math.floor(Math.random() * currentGen.population.length)
        const index2 = Math.floor(Math.random() * currentGen.population.length)

        const parent1 = cloneDeep(currentGen.population[index1]!)
        const parent2 = cloneDeep(currentGen.population[index2]!)
        const child = crossover(cloneDeep(parent1), cloneDeep(parent2))
        const mutatedChild = mutate(cloneDeep(child), parameters.mutationRate)
        population.push(mutatedChild)
      }
      currentGen.population = cloneDeep(population)
    }
    currentGen.population = currentGen.population.map((folio) => evaluate(cloneDeep(folio), assets))
    currentGen.pareto = getPareto(currentGen.population)
    generations.push(cloneDeep(currentGen))
  }

  return generations
}

generations.value = generationLabo(parameters.value, assets.value)
counterGen.value = generations.value.length - 1

const nextGeneration = () => {
  if (counterGen.value < generations.value.length - 1) {
    counterGen.value++
  }
}

const previousGeneration = () => {
  if (counterGen.value > 0) {
    counterGen.value--
  }
}

watch(
  () => parameters.value || assets.value,
  () => {
    generations.value = generationLabo(parameters.value, assets.value)
    counterGen.value = generations.value.length - 1
  },
)
</script>
