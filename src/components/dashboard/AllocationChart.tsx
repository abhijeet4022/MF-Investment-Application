import React from 'react';
import { AssetAllocation } from '../../types';

interface AllocationChartProps {
  allocation: AssetAllocation;
  title?: string;
}

const AllocationChart: React.FC<AllocationChartProps> = ({ allocation, title }) => {
  const colors = {
    Gold: 'bg-yellow-500',
    Nifty50: 'bg-blue-500',
    FlexiCap: 'bg-green-500',
    MidCap: 'bg-purple-500',
    DebtHybrid: 'bg-gray-500',
    Conservative: 'bg-teal-500'
  };
  
  const total = Object.values(allocation).reduce((sum, value) => sum + value, 0);
  const normalizedAllocation = { ...allocation };
  
  // Ensure the total is 100%
  if (total !== 100) {
    Object.keys(normalizedAllocation).forEach(key => {
      normalizedAllocation[key as keyof AssetAllocation] = Math.round((normalizedAllocation[key as keyof AssetAllocation] / total) * 100);
    });
  }
  
  return (
    <div className="p-4">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      
      <div className="flex w-full h-8 rounded-lg overflow-hidden mb-4">
        {Object.entries(normalizedAllocation).map(([category, percentage]) => {
          if (percentage === 0) return null;
          return (
            <div
              key={category}
              className={`${colors[category as keyof typeof colors]} transition-all duration-500 ease-in-out`}
              style={{ width: `${percentage}%` }}
              title={`${category}: ${percentage}%`}
            />
          );
        })}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Object.entries(normalizedAllocation).map(([category, percentage]) => {
          if (percentage === 0) return null;
          return (
            <div key={category} className="flex items-center">
              <div className={`w-4 h-4 rounded ${colors[category as keyof typeof colors]} mr-2`} />
              <span className="text-sm">
                {category}: {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllocationChart;