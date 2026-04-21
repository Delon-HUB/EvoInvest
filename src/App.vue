<template>
  <MainLayout>
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
  </MainLayout>
</template>

<script setup lang="ts">
import type { IAsset, IGeneration, IPortfolio } from './interfaces/types'
import { crossover, evaluate, generatePopulation, getPareto, mutate } from './utils'
import Scatter from './components/scatter.vue'
import { computed, ref } from 'vue'
import { cloneDeep } from 'lodash'
import MainLayout from './layout/MainLayout.vue'
import TopList from './components/TopList.vue'

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

const generationLabo = (populationSize: number, maxGeneration: number): IGeneration[] => {
  const generations: IGeneration[] = []

  for (let i = 0; i < maxGeneration; i++) {
    const currentGen: IGeneration = {
      generation: i,
      population: [],
      pareto: [],
    }

    if (i === 0) {
      currentGen.population = generatePopulation(populationSize, assets)
    } else {
      currentGen.population = [...cloneDeep(generations[i - 1]!.pareto)]
      const totalChildren = populationSize - generations[i - 1]!.pareto.length

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
        const mutatedChild = mutate(cloneDeep(child))
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

generations.value = generationLabo(10, 100)
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
</script>
