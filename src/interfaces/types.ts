export interface IAsset {
  name: string
  return: number
  risk: number
}

export interface IPortfolio {
  name: string
  weights: number[]
  return: number
  risk: number
}

export interface IGeneration {
  generation: number
  population: IPortfolio[]
  pareto: IPortfolio[]
}
