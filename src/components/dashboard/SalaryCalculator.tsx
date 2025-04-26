import React, { useState } from 'react';
import { AssetAllocation } from '../../types';
import { calculateInvestmentBySalary } from '../../utils/allocationUtils';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

interface SalaryCalculatorProps {
  allocation: AssetAllocation;
  onUpdateSalary: (salary: number, percentage: number) => void;
  initialSalary?: number;
  initialPercentage?: number;
}

const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({
  allocation,
  onUpdateSalary,
  initialSalary = 0,
  initialPercentage = 20
}) => {
  const [salary, setSalary] = useState(initialSalary);
  const [percentage, setPercentage] = useState(initialPercentage);
  const [showResults, setShowResults] = useState(false);
  
  const handleCalculate = () => {
    onUpdateSalary(salary, percentage);
    setShowResults(true);
  };
  
  const investments = calculateInvestmentBySalary(salary, allocation, percentage);
  const totalInvestment = Object.values(investments).reduce((sum, value) => sum + value, 0);
  
  return (
    <Card title="Investment Calculator">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Enter your monthly salary and investment percentage to calculate your allocation
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Monthly Salary"
            type="number"
            min="0"
            value={salary.toString()}
            onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
            fullWidth
          />
          
          <Input
            label="Investment Percentage"
            type="number"
            min="1"
            max="100"
            value={percentage.toString()}
            onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
            fullWidth
          />
        </div>
        
        <Button onClick={handleCalculate} fullWidth>Calculate</Button>
      </div>
      
      {showResults && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
          <div className="mb-4">
            <h4 className="text-lg font-medium mb-1">Monthly Investment</h4>
            <p className="text-2xl font-semibold text-blue-600">₹{totalInvestment.toLocaleString()}</p>
            <p className="text-sm text-gray-500">({percentage}% of your salary)</p>
          </div>
          
          <h4 className="text-md font-medium mb-2">Fund Allocation</h4>
          <div className="space-y-2">
            {Object.entries(investments).map(([category, amount]) => {
              if (amount <= 0) return null;
              return (
                <div key={category} className="flex justify-between">
                  <span className="text-gray-700">{category}</span>
                  <span className="font-medium">₹{amount.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};

export default SalaryCalculator;