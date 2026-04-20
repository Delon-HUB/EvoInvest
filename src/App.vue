<template>
  <Scatter
    :population="currentGeneration!.population.map((p) => ({ x: p.return * 100, y: p.risk * 100 }))"
    :pareto="currentGeneration!.pareto.map((p) => ({ x: p.return * 100, y: p.risk * 100 }))"
    :title="`Génération ${counterGen + 1}`"
  />
  <button @click="previousGeneration" style="margin-right: 24px; width: 100px">Precedent</button>
  <button @click="nextGeneration" style="width: 100px">Suivant</button>
</template>

<script setup lang="ts">
import type { IAsset, IGeneration, IPortfolio } from './interfaces/types'
import { crossover, evaluate, generatePopulation, getPareto, mutate } from './utils'
import Scatter from './components/scatter.vue'
import { computed, ref } from 'vue'
import { cloneDeep } from 'lodash'

const generations = ref<IGeneration[]>([])
const counterGen = ref(0)

const currentGeneration = computed(() => generations.value[counterGen.value])

const assets: IAsset[] = [
  {
    name: 'A',
    return: 0.4,
    risk: 0.2,
  },
  {
    name: 'B',
    return: 0.2,
    risk: 0.1,
  },
  {
    name: 'C',
    return: 0.3,
    risk: 0.1,
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
        const parent1 = cloneDeep(
          currentGen.population[Math.floor(Math.random() * currentGen.population.length)]!,
        )
        const parent2 = cloneDeep(
          currentGen.population[Math.floor(Math.random() * generations[i - 1]!.pareto.length)]!,
        )

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

generations.value = generationLabo(50, 10)

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
