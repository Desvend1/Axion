
export interface Product {
  id: string;
  name: string;
  category: string;
  cost: number;
  currentPrice: number;
  monthlySales: number;
  description: string;
}

export interface SimulationResult {
  price: number;
  predictedVolume: number;
  revenue: number;
  profit: number;
  changePercent: number;
}

export interface DemandPrediction {
  analysis: string;
  simulations: SimulationResult[];
}
