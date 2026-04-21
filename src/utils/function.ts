import type { IAsset, IPortfolio } from '@/interfaces/types'
import { cloneDeep } from 'lodash'

export const generate = (name: string, assets: IAsset[]): IPortfolio => {
  const weights: number[] = assets.map(() => Math.random())
  const totalWeight: number = weights.reduce((sum, w) => sum + w, 0)
  const normalizedWeights: number[] = weights.map((w) => parseFloat(w / totalWeight + ''))

  return {
    name,
    weights: normalizedWeights,
    return: 0,
    risk: 0,
  }
}

export const evaluate = (portfolio: IPortfolio, assets: IAsset[]): IPortfolio => {
  const copiePortfolio = cloneDeep(portfolio)
  const _return: number = copiePortfolio.weights.reduce(
    (sum, w, i) => sum + w * assets[i]!.return,
    0,
  )

  const variance: number = copiePortfolio.weights.reduce(
    (sum, w, i) => sum + Math.pow(w * assets[i]!.risk, 2),
    0,
  )
  const risk: number = Math.sqrt(variance)

  const updatedPortfolio: IPortfolio = {
    ...copiePortfolio,
    return: parseFloat(_return + ''),
    risk: parseFloat(risk + ''),
  }

  return updatedPortfolio
}

export const dominates = (p1: IPortfolio, p2: IPortfolio) => {
  return (
    p1.return >= p2.return && p1.risk <= p2.risk && (p1.return > p2.return || p1.risk < p2.risk)
  )
}

export const getPareto = (population: IPortfolio[]): IPortfolio[] => {
  const pareto = population.filter(
    (currentP) => !population.some((compareP) => dominates(compareP, currentP)),
  )

  return pareto.length > 0 ? pareto : population
}

export const mutate = (portfolio: IPortfolio): IPortfolio => {
  const copiePortfolio = cloneDeep(portfolio)
  const mutatedWeights: number[] = copiePortfolio.weights.map((w) => {
    w += Math.sqrt(Math.pow(Math.random() - 0.5 * 0.15, 2))
    return w
  })

  const totalWeight: number = mutatedWeights.reduce((sum, w) => sum + w, 0)
  const normalizedWeights: number[] = mutatedWeights.map((w) => parseFloat(w / totalWeight + ''))

  const mutatedPortfolio: IPortfolio = {
    ...copiePortfolio,
    weights: normalizedWeights,
  }

  return mutatedPortfolio
}

export const crossover = (parent1: IPortfolio, parent2: IPortfolio): IPortfolio => {
  const copieP1 = cloneDeep(parent1)
  const copieP2 = cloneDeep(parent2)
  const childWeights: number[] = copieP1.weights.map((w, i) =>
    Math.random() < 0.5 ? w : copieP2.weights[i]!,
  )

  const totalWeight: number = childWeights.reduce((sum, w) => sum + w, 0)
  const normalizedWeights: number[] = childWeights.map((w) => parseFloat(w / totalWeight + ''))

  return {
    name: `a`,
    weights: normalizedWeights,
    return: 0,
    risk: 0,
  }
}

export const generatePopulation = (size: number, assets: IAsset[]): IPortfolio[] => {
  const population: IPortfolio[] = []
  for (let i = 0; i < size; i++) {
    const portfolio = generate(`p-${i + 1}`, assets)
    population.push(portfolio)
  }
  return population
}
