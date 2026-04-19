<template>
  <p>Hello world</p>
</template>

<script setup lang="ts">
import type { IAsset, IPortfolio } from './interfaces/types'
import { crossover, evaluate, generate, getPareto, mutate } from './utils'

const assets: IAsset[] = [
  {
    name: 'A',
    return: 0.1,
    risk: 0.2,
  },
  {
    name: 'B',
    return: 0.2,
    risk: 0.3,
  },
  {
    name: 'C',
    return: 0.3,
    risk: 0.4,
  },
]

let maxGenerations = 10
const populationSize = 10

let generationCount = 0
while (generationCount < maxGenerations) {
  console.log(`----------------------- Generation ${generationCount + 1} -----------------------`)

  const population: IPortfolio[] = []
  for (let i = 0; i < populationSize; i++) {
    const portfolio = generate(`p-${i + 1}`, assets)
    const updatedPortfolio = evaluate(portfolio, assets)
    population.push(updatedPortfolio)
  }

  const paretoFolios: IPortfolio[] = getPareto(population)
  const totalChildren = populationSize - paretoFolios.length

  const newPopulation: IPortfolio[] = [...paretoFolios]
  for (let i = 0; i < totalChildren; i++) {
    const parent1 = paretoFolios[Math.floor(Math.random() * paretoFolios.length)]!
    const parent2 = paretoFolios[Math.floor(Math.random() * paretoFolios.length)]!

    const child = crossover(parent1, parent2)
    const mutatedChild = mutate(child)
    const evaluatedChild = evaluate(mutatedChild, assets)
    newPopulation.push(evaluatedChild)
  }

  console.log('Front de Pareto:')
  console.log(paretoFolios)

  generationCount++
}
</script>
