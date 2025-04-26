import { v4 as uuidv4 } from 'uuid';
import { Fund, Portfolio, User } from "../types";
import { getAgeBracket, getAllocationByAge } from "./allocationUtils";

// In a real application, this would use a secure backend
// This is a simplified in-memory implementation for demo purposes
let portfolios: Portfolio[] = [];

// Create a new portfolio for a user
export const createPortfolio = (user: User): Portfolio => {
  const ageBracket = getAgeBracket(user.dateOfBirth);
  const allocation = getAllocationByAge(ageBracket);
  
  const portfolio: Portfolio = {
    userId: user.id,
    lastRebalanced: new Date().toISOString(),
    salary: 0,
    investmentPercentage: 20,
    customAllocation: false,
    allocation,
    funds: []
  };
  
  portfolios.push(portfolio);
  return portfolio;
};

// Get portfolio by user ID
export const getPortfolioByUserId = (userId: string): Portfolio | undefined => {
  return portfolios.find(p => p.userId === userId);
};

// Update portfolio
export const updatePortfolio = (portfolio: Portfolio): Portfolio => {
  const index = portfolios.findIndex(p => p.userId === portfolio.userId);
  if (index === -1) {
    throw new Error('Portfolio not found');
  }
  
  portfolios[index] = portfolio;
  return portfolio;
};

// Add a fund to portfolio
export const addFund = (userId: string, fund: Omit<Fund, 'id'>): Fund => {
  const portfolio = getPortfolioByUserId(userId);
  if (!portfolio) {
    throw new Error('Portfolio not found');
  }
  
  const newFund: Fund = {
    ...fund,
    id: uuidv4()
  };
  
  portfolio.funds.push(newFund);
  updatePortfolio(portfolio);
  
  return newFund;
};

// Update a fund
export const updateFund = (userId: string, fund: Fund): Fund => {
  const portfolio = getPortfolioByUserId(userId);
  if (!portfolio) {
    throw new Error('Portfolio not found');
  }
  
  const index = portfolio.funds.findIndex(f => f.id === fund.id);
  if (index === -1) {
    throw new Error('Fund not found');
  }
  
  portfolio.funds[index] = fund;
  updatePortfolio(portfolio);
  
  return fund;
};

// Remove a fund
export const removeFund = (userId: string, fundId: string): void => {
  const portfolio = getPortfolioByUserId(userId);
  if (!portfolio) {
    throw new Error('Portfolio not found');
  }
  
  portfolio.funds = portfolio.funds.filter(f => f.id !== fundId);
  updatePortfolio(portfolio);
};

// Update portfolio last rebalanced date
export const updateLastRebalanced = (userId: string): void => {
  const portfolio = getPortfolioByUserId(userId);
  if (!portfolio) {
    throw new Error('Portfolio not found');
  }
  
  portfolio.lastRebalanced = new Date().toISOString();
  updatePortfolio(portfolio);
};

// For demo purposes, add a sample portfolio
export const initializePortfolios = (): void => {
  if (portfolios.length === 0) {
    portfolios.push({
      userId: '1',
      lastRebalanced: '2023-01-01T00:00:00Z',
      salary: 100000,
      investmentPercentage: 20,
      customAllocation: false,
      allocation: {
        Gold: 20,
        Nifty50: 30,
        FlexiCap: 25,
        MidCap: 25,
        DebtHybrid: 0,
        Conservative: 0
      },
      funds: [
        {
          id: '1',
          name: 'SBI Gold Fund',
          category: 'Gold',
          currentValue: 20000,
          investedAmount: 18000
        },
        {
          id: '2',
          name: 'HDFC Nifty 50 Index Fund',
          category: 'Nifty50',
          currentValue: 30000,
          investedAmount: 27000
        },
        {
          id: '3',
          name: 'ICICI Prudential Flexicap Fund',
          category: 'FlexiCap',
          currentValue: 25000,
          investedAmount: 22000
        },
        {
          id: '4',
          name: 'Kotak Midcap Fund',
          category: 'MidCap',
          currentValue: 25000,
          investedAmount: 23000
        }
      ]
    });
  }
};