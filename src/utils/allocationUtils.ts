import { AgeRangeConfig, AllocationByAge, AssetAllocation, Fund, FundCategory, Portfolio } from "../types";

// Default allocations by age bracket
export const defaultAllocations: AllocationByAge[] = [
  {
    ageRange: { start: 25, end: 30 },
    allocation: {
      Gold: 20,
      Nifty50: 30,
      FlexiCap: 25,
      MidCap: 25,
      DebtHybrid: 0,
      Conservative: 0
    }
  },
  {
    ageRange: { start: 30, end: 35 },
    allocation: {
      Gold: 20,
      Nifty50: 35,
      FlexiCap: 25,
      MidCap: 20,
      DebtHybrid: 0,
      Conservative: 0
    }
  },
  {
    ageRange: { start: 35, end: 40 },
    allocation: {
      Gold: 25,
      Nifty50: 40,
      FlexiCap: 25,
      MidCap: 10,
      DebtHybrid: 0,
      Conservative: 0
    }
  },
  {
    ageRange: { start: 40, end: 45 },
    allocation: {
      Gold: 30,
      Nifty50: 45,
      FlexiCap: 20,
      MidCap: 5,
      DebtHybrid: 0,
      Conservative: 0
    }
  },
  {
    ageRange: { start: 45, end: 50 },
    allocation: {
      Gold: 30,
      Nifty50: 45,
      FlexiCap: 15,
      MidCap: 0,
      DebtHybrid: 10,
      Conservative: 0
    }
  },
  {
    ageRange: { start: 50, end: 55 },
    allocation: {
      Gold: 35,
      Nifty50: 40,
      FlexiCap: 10,
      MidCap: 0,
      DebtHybrid: 15,
      Conservative: 0
    }
  },
  {
    ageRange: { start: 55, end: 60 },
    allocation: {
      Gold: 40,
      Nifty50: 35,
      FlexiCap: 5,
      MidCap: 0,
      DebtHybrid: 20,
      Conservative: 0
    }
  },
  {
    ageRange: { start: 60, end: 100 },
    allocation: {
      Gold: 45,
      Nifty50: 25,
      FlexiCap: 0,
      MidCap: 0,
      DebtHybrid: 25,
      Conservative: 5
    }
  }
];

// Get age bracket from date of birth
export const getAgeBracket = (dateOfBirth: string): AgeRangeConfig => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  const age = today.getFullYear() - birthDate.getFullYear();
  
  const bracket = defaultAllocations.find(item => 
    age >= item.ageRange.start && age < item.ageRange.end
  );
  
  return bracket ? bracket.ageRange : defaultAllocations[0].ageRange;
};

// Get allocation by age bracket
export const getAllocationByAge = (ageRange: AgeRangeConfig): AssetAllocation => {
  const allocationData = defaultAllocations.find(item => 
    item.ageRange.start === ageRange.start && item.ageRange.end === ageRange.end
  );
  return allocationData ? allocationData.allocation : defaultAllocations[0].allocation;
};

// Calculate investment amount by category based on salary and allocation
export const calculateInvestmentBySalary = (
  salary: number, 
  allocation: AssetAllocation,
  percentage: number = 20
): Record<FundCategory, number> => {
  const investmentAmount = salary * (percentage / 100);
  
  return {
    Gold: investmentAmount * (allocation.Gold / 100),
    Nifty50: investmentAmount * (allocation.Nifty50 / 100),
    FlexiCap: investmentAmount * (allocation.FlexiCap / 100),
    MidCap: investmentAmount * (allocation.MidCap / 100),
    DebtHybrid: investmentAmount * (allocation.DebtHybrid / 100),
    Conservative: investmentAmount * (allocation.Conservative / 100)
  };
};

// Group funds by category
export const groupFundsByCategory = (funds: Fund[]): Record<FundCategory, Fund[]> => {
  const result: Record<FundCategory, Fund[]> = {
    Gold: [],
    Nifty50: [],
    FlexiCap: [],
    MidCap: [],
    DebtHybrid: [],
    Conservative: []
  };
  
  funds.forEach(fund => {
    result[fund.category].push(fund);
  });
  
  return result;
};

// Calculate current allocation based on fund values
export const calculateCurrentAllocation = (funds: Fund[]): AssetAllocation => {
  const totalValue = funds.reduce((sum, fund) => sum + fund.currentValue, 0);
  if (totalValue === 0) return defaultAllocations[0].allocation;
  
  const categoryTotals: Record<FundCategory, number> = {
    Gold: 0,
    Nifty50: 0,
    FlexiCap: 0,
    MidCap: 0,
    DebtHybrid: 0,
    Conservative: 0
  };
  
  funds.forEach(fund => {
    categoryTotals[fund.category] += fund.currentValue;
  });
  
  return {
    Gold: Math.round((categoryTotals.Gold / totalValue) * 100),
    Nifty50: Math.round((categoryTotals.Nifty50 / totalValue) * 100),
    FlexiCap: Math.round((categoryTotals.FlexiCap / totalValue) * 100),
    MidCap: Math.round((categoryTotals.MidCap / totalValue) * 100),
    DebtHybrid: Math.round((categoryTotals.DebtHybrid / totalValue) * 100),
    Conservative: Math.round((categoryTotals.Conservative / totalValue) * 100)
  };
};

// Check if rebalancing is needed
export const isRebalancingNeeded = (portfolio: Portfolio): boolean => {
  const lastRebalancedDate = new Date(portfolio.lastRebalanced);
  const today = new Date();
  
  // Check if 2.5 years have passed
  const yearDiff = (today.getTime() - lastRebalancedDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  if (yearDiff >= 2.5) return true;
  
  // Check if any allocation is off by 10% or more
  const currentAllocation = calculateCurrentAllocation(portfolio.funds);
  const targetAllocation = portfolio.allocation;
  
  return Object.keys(targetAllocation).some(category => {
    const cat = category as keyof AssetAllocation;
    const diff = Math.abs(currentAllocation[cat] - targetAllocation[cat]);
    return diff >= 10;
  });
};

// Calculate rebalancing recommendations
export const calculateRebalancing = (portfolio: Portfolio): Record<FundCategory, number> => {
  const currentValue = portfolio.funds.reduce((sum, fund) => sum + fund.currentValue, 0);
  const currentAllocation = calculateCurrentAllocation(portfolio.funds);
  const targetAllocation = portfolio.allocation;
  
  const recommendations: Record<FundCategory, number> = {
    Gold: 0,
    Nifty50: 0,
    FlexiCap: 0,
    MidCap: 0,
    DebtHybrid: 0,
    Conservative: 0
  };
  
  Object.keys(targetAllocation).forEach(category => {
    const cat = category as keyof AssetAllocation;
    const targetAmount = (targetAllocation[cat] / 100) * currentValue;
    const currentAmount = (currentAllocation[cat] / 100) * currentValue;
    recommendations[cat] = targetAmount - currentAmount;
  });
  
  return recommendations;
};

// Update age bracket configuration
export const updateAgeRangeConfig = (
  index: number, 
  newRange: AgeRangeConfig
): void => {
  if (index >= 0 && index < defaultAllocations.length) {
    defaultAllocations[index].ageRange = newRange;
  }
};

// Update allocation for age bracket
export const updateAllocationForAgeBracket = (
  ageRange: AgeRangeConfig,
  newAllocation: AssetAllocation
): void => {
  const index = defaultAllocations.findIndex(item => 
    item.ageRange.start === ageRange.start && item.ageRange.end === ageRange.end
  );
  
  if (index !== -1) {
    defaultAllocations[index].allocation = newAllocation;
  }
};