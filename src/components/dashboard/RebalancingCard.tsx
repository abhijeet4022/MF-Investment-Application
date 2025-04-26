import React from 'react';
import { Portfolio } from '../../types';
import { calculateRebalancing, isRebalancingNeeded } from '../../utils/allocationUtils';
import { updateLastRebalanced } from '../../utils/portfolioUtils';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface RebalancingCardProps {
  portfolio: Portfolio;
  onPortfolioUpdated: () => void;
}

const RebalancingCard: React.FC<RebalancingCardProps> = ({ portfolio, onPortfolioUpdated }) => {
  const needsRebalancing = isRebalancingNeeded(portfolio);
  const rebalancingRecommendations = calculateRebalancing(portfolio);
  
  const handleMarkRebalanced = () => {
    updateLastRebalanced(portfolio.userId);
    onPortfolioUpdated();
  };
  
  // Format date from ISO string
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  return (
    <Card title="Portfolio Rebalancing">
      <div className="mb-4">
        <p className="text-sm mb-1">Last rebalanced on: {formatDate(portfolio.lastRebalanced)}</p>
        {needsRebalancing ? (
          <p className="text-sm font-medium text-yellow-600">Rebalancing recommended</p>
        ) : (
          <p className="text-sm font-medium text-green-600">Your portfolio is well balanced</p>
        )}
      </div>
      
      {needsRebalancing && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h4 className="text-md font-medium mb-2">Recommended Actions</h4>
          <div className="space-y-3">
            {Object.entries(rebalancingRecommendations).map(([category, amount]) => {
              if (Math.abs(amount) < 1) return null;
              const isPositive = amount > 0;
              return (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-gray-700">{category}</span>
                  <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}₹{amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p className="mb-2">
              Positive values mean you should buy more of this fund category.
              Negative values mean you should reduce your holdings.
            </p>
          </div>
          
          <div className="mt-4">
            <Button onClick={handleMarkRebalanced} fullWidth>
              Mark as Rebalanced
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default RebalancingCard;