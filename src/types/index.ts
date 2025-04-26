export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  password: string;
}

export interface Fund {
  id: string;
  name: string;
  category: FundCategory;
  currentValue: number;
  investedAmount: number;
}

export type FundCategory = 'Gold' | 'Nifty50' | 'FlexiCap' | 'MidCap' | 'DebtHybrid' | 'Conservative';

export interface AssetAllocation {
  Gold: number;
  Nifty50: number;
  FlexiCap: number;
  MidCap: number;
  DebtHybrid: number;
  Conservative: number;
}

export interface Portfolio {
  userId: string;
  lastRebalanced: string;
  salary: number;
  investmentPercentage: number;
  customAllocation: boolean;
  allocation: AssetAllocation;
  funds: Fund[];
}

export interface AgeRangeConfig {
  start: number;
  end: number;
}

export interface AllocationByAge {
  ageRange: AgeRangeConfig;
  allocation: AssetAllocation;
}

export type DashboardTab = 'overview' | 'profile' | 'funds' | 'allocation' | 'calculator';