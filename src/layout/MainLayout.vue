<template>
  <div>
    <q-layout view="hHh lpR fFf" container style="height: 100vh">
      <q-header>
        <q-toolbar>
          <q-avatar>
            <q-icon size="32px" name="account_balance_wallet" />
          </q-avatar>

          <q-toolbar-title class="text-bold">
            <q-item-label>EvoInvest</q-item-label>
            <q-item-label caption class="text-white">Optimisation de portefeuille</q-item-label>
          </q-toolbar-title>
          <q-btn
            icon="settings"
            flat
            @click="() => (drawer = !drawer)"
            :label="drawer ? 'Caher les paramètres' : 'Afficher paramètres'"
          />
        </q-toolbar>
      </q-header>
      <q-drawer show-if-above v-model="drawer" side="right" bordered>
        <q-card flat class="q-ma-md">
          <configuration @parameter_changed="(_parameters) => (parameters = _parameters)" />
        </q-card>
      </q-drawer>

      <q-page-container>
        <q-page class="q-pa-md">
          <q-card flat class="row">
            <q-card-section class="col-3">
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
            </q-card-section>

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
              <q-card-actions align="right">
                <q-btn
                  no-caps
                  color="grey"
                  style="width: 150px"
                  @click="previousGeneration"
                  class="q-mr-md"
                  icon="arrow_left"
                >
                  Précedent
                </q-btn>
                <q-btn
                  icon-right="arrow_right"
                  no-caps
                  color="positive"
                  style="width: 150px"
                  @click="nextGeneration"
                  >Suivant</q-btn
                >
              </q-card-actions>
            </q-card-section>
          </q-card>
        </q-page>
        <q-card flat dark style="border-radius: 0px">
          <q-page class="text-center">
            <q-item-section>
              <p class="text-h5">À propos</p>
              Cette application vous aide à trouver la meilleure façon de répartir votre argent
              entre plusieurs investissements. Elle compare différentes options en tenant compte du
              rendement et du risque, puis met en évidence les choix les plus intéressants. Vous
              pouvez ainsi voir facilement les compromis possibles et choisir celui qui vous
              convient le mieux.
            </q-item-section>
          </q-page>
        </q-card>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import Configuration from '@/components/Configuration.vue'
import { ref, computed, watch } from 'vue'

import type { IAsset, IGeneration, IParameters, IPortfolio } from '../interfaces/types'
import { crossover, evaluate, generatePopulation, getPareto, mutate } from '../utils'
import Scatter from '../components/scatter.vue'
import { cloneDeep } from 'lodash'
import TopList from '../components/TopList.vue'

const drawer = ref(true)

const parameters = ref<IParameters>({
  generationSize: 10,
  populationSize: 10,
  mutationRate: 0.1,
})
const generations = ref<IGeneration[]>([])
const counterGen = ref(0)
const currentGeneration = computed(() => generations.value[counterGen.value])

const assets: IAsset[] = [
  {
    name: 'A',
    return: 0.3,
    risk: 0.1,
  },
  {
    name: 'B',
    return: 0.4,
    risk: 0.2,
  },
  {
    name: 'C',
    return: 0.5,
    risk: 0.3,
  },
]

// ------------------------------------------------------------------------------------------------------------------------------

const generationLabo = (parameters: IParameters): IGeneration[] => {
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

generations.value = generationLabo(parameters.value)
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
  () => parameters.value,
  () => {
    generations.value = generationLabo(parameters.value)
    counterGen.value = generations.value.length - 1
  },
)
</script>
