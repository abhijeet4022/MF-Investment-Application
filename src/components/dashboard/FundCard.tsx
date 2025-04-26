import React from 'react';
import { Fund } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface FundCardProps {
  fund: Fund;
  onEdit: (fund: Fund) => void;
  onDelete: (fundId: string) => void;
}

const FundCard: React.FC<FundCardProps> = ({ fund, onEdit, onDelete }) => {
  const growth = fund.currentValue - fund.investedAmount;
  const growthPercentage = ((fund.currentValue / fund.investedAmount) - 1) * 100;
  const isPositive = growth >= 0;
  
  return (
    <Card className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{fund.name}</h3>
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{fund.category}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Current Value</p>
            <p className="text-lg font-medium">₹{fund.currentValue.toLocaleString()}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Invested</p>
            <p className="text-lg font-medium">₹{fund.investedAmount.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-gray-500">Growth</p>
          <p className={`text-lg font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}₹{growth.toLocaleString()} ({isPositive ? '+' : ''}{growthPercentage.toFixed(2)}%)
          </p>
        </div>
        
        <div className="flex justify-between mt-auto pt-4 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(fund)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(fund.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FundCard;