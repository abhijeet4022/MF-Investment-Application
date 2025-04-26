import React, { useState, useEffect } from 'react';
import { Fund, FundCategory } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface FundFormProps {
  fund?: Fund;
  onSubmit: (fund: Omit<Fund, 'id'>) => void;
  onCancel: () => void;
  isModal?: boolean;
}

const FundForm: React.FC<FundFormProps> = ({ fund, onSubmit, onCancel, isModal = false }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FundCategory>('Nifty50');
  const [currentValue, setCurrentValue] = useState(0);
  const [investedAmount, setInvestedAmount] = useState(0);
  
  useEffect(() => {
    if (fund) {
      setName(fund.name);
      setCategory(fund.category);
      setCurrentValue(fund.currentValue);
      setInvestedAmount(fund.investedAmount);
    }
  }, [fund]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      name,
      category,
      currentValue,
      investedAmount
    });
  };
  
  const categoryOptions = [
    { value: 'Gold', label: 'Gold' },
    { value: 'Nifty50', label: 'Nifty 50' },
    { value: 'FlexiCap', label: 'Flexi Cap' },
    { value: 'MidCap', label: 'Mid Cap' },
    { value: 'DebtHybrid', label: 'Debt/Hybrid' },
    { value: 'Conservative', label: 'Conservative Fund' }
  ];
  
  const content = (
    <form onSubmit={handleSubmit}>
      <Input
        label="Fund Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
      />
      
      <Select
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value as FundCategory)}
        options={categoryOptions}
        required
        fullWidth
      />
      
      <Input
        label="Current Value"
        type="number"
        min="0"
        step="0.01"
        value={currentValue.toString()}
        onChange={(e) => setCurrentValue(parseFloat(e.target.value))}
        required
        fullWidth
      />
      
      <Input
        label="Invested Amount"
        type="number"
        min="0"
        step="0.01"
        value={investedAmount.toString()}
        onChange={(e) => setInvestedAmount(parseFloat(e.target.value))}
        required
        fullWidth
      />
      
      <div className="flex justify-end space-x-3 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {fund ? 'Update' : 'Add'} Fund
        </Button>
      </div>
    </form>
  );
  
  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{fund ? 'Edit Fund' : 'Add New Fund'}</h2>
            {content}
          </div>
        </div>
      </div>
    );
  }
  
  return <Card title={fund ? 'Edit Fund' : 'Add New Fund'}>{content}</Card>;
};

export default FundForm;