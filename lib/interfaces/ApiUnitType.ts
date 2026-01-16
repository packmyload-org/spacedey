export interface ApiUnitType {
  id: string;
  name: string;
  dimensions: {
    width: number;
    depth: number;
    unit: string; // e.g., 'ft' or 'm'
  };
  price: {
    amount: number;
    currency: string;
    originalAmount?: number; // For promos
  };
  description?: string;
  availableCount: number;
}
