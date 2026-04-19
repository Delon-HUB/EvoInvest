import type { IAsset, IPortfolio } from '@/interfaces/types'

export const generate = (name: string, assets: IAsset[]): IPortfolio => {
  const weights: number[] = assets.map(() => Math.random())
  const totalWeight: number = weights.reduce((sum, w) => sum + w, 0)
  const normalizedWeights: number[] = weights.map((w) => parseFloat((w / totalWeight).toFixed(2)))

  return {
    name,
    weights: normalizedWeights,
    return: 0,
    risk: 0,
  }
}

export const evaluate = (portfolio: IPortfolio, assets: IAsset[]): IPortfolio => {
  const _return: number = portfolio.weights.reduce((sum, w, i) => sum + w * assets[i]!.return, 0)

  const variance: number = portfolio.weights.reduce(
    (sum, w, i) => sum + Math.pow(w * assets[i]!.risk, 2),
    0,
  )
  const risk: number = Math.sqrt(variance)

  const updatedPortfolio: IPortfolio = {
    ...portfolio,
    return: parseFloat(_return.toFixed(2)),
    risk: parseFloat(risk.toFixed(2)),
  }
  return updatedPortfolio
}

export const dominates = (p1: IPortfolio, p2: IPortfolio) => {
  return (
    p1.return >= p2.return && p1.risk <= p2.risk && (p1.return > p2.return || p1.risk < p2.risk)
  )
}

export const getPareto = (population: IPortfolio[]): IPortfolio[] => {
  return population.filter(
    (currentP) => !population.some((compareP) => dominates(currentP, compareP)),
  )
}

export const mutate = (portfolio: IPortfolio): IPortfolio => {
  const mutatedWeights: number[] = portfolio.weights.map((w) => {
    w += (Math.random() - 0.5) * 0.1
    return w
  })

  const totalWeight: number = mutatedWeights.reduce((sum, w) => sum + w, 0)
  const normalizedWeights: number[] = mutatedWeights.map((w) =>
    parseFloat((w / totalWeight).toFixed(2)),
  )

  return {
    ...portfolio,
    weights: normalizedWeights,
  }
}

export const crossover = (parent1: IPortfolio, parent2: IPortfolio): IPortfolio => {
  const childWeights: number[] = parent1.weights.map((w, i) =>
    Math.random() < 0.5 ? w : parent2.weights[i]!,
  )

  const totalWeight: number = childWeights.reduce((sum, w) => sum + w, 0)
  const normalizedWeights: number[] = childWeights.map((w) =>
    parseFloat((w / totalWeight).toFixed(2)),
  )

  return {
    name: `${parent1.name}-${parent2.name}`,
    weights: normalizedWeights,
    return: 0,
    risk: 0,
  }
}
