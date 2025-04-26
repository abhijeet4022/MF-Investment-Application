import React, { useState, useEffect } from 'react';
import { AssetAllocation } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

interface AllocationFormProps {
  allocation: AssetAllocation;
  onUpdateAllocation: (allocation: AssetAllocation) => void;
  onCancel: () => void;
}

const AllocationForm: React.FC<AllocationFormProps> = ({
  allocation,
  onUpdateAllocation,
  onCancel
}) => {
  const [values, setValues] = useState<AssetAllocation>({ ...allocation });
  const [error, setError] = useState('');
  
  const handleChange = (category: keyof AssetAllocation, value: number) => {
    setValues(prev => ({
      ...prev,
      [category]: value
    }));
  };
  
  // Validate total allocation equals 100%
  useEffect(() => {
    const total = Object.values(values).reduce((sum, value) => sum + value, 0);
    if (total !== 100) {
      setError(`Total allocation must equal 100%. Current total: ${total}%`);
    } else {
      setError('');
    }
  }, [values]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const total = Object.values(values).reduce((sum, value) => sum + value, 0);
    if (total !== 100) {
      setError(`Total allocation must equal 100%. Current total: ${total}%`);
      return;
    }
    
    onUpdateAllocation(values);
  };
  
  return (
    <Card title="Customize Asset Allocation">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Gold (%)"
            type="number"
            min="0"
            max="100"
            value={values.Gold.toString()}
            onChange={(e) => handleChange('Gold', parseInt(e.target.value) || 0)}
            required
          />
          
          <Input
            label="Nifty 50 (%)"
            type="number"
            min="0"
            max="100"
            value={values.Nifty50.toString()}
            onChange={(e) => handleChange('Nifty50', parseInt(e.target.value) || 0)}
            required
          />
          
          <Input
            label="Flexi Cap (%)"
            type="number"
            min="0"
            max="100"
            value={values.FlexiCap.toString()}
            onChange={(e) => handleChange('FlexiCap', parseInt(e.target.value) || 0)}
            required
          />
          
          <Input
            label="Mid Cap (%)"
            type="number"
            min="0"
            max="100"
            value={values.MidCap.toString()}
            onChange={(e) => handleChange('MidCap', parseInt(e.target.value) || 0)}
            required
          />
          
          <Input
            label="Debt/Hybrid (%)"
            type="number"
            min="0"
            max="100"
            value={values.DebtHybrid.toString()}
            onChange={(e) => handleChange('DebtHybrid', parseInt(e.target.value) || 0)}
            required
          />
          
          <Input
            label="Conservative Fund (%)"
            type="number"
            min="0"
            max="100"
            value={values.Conservative.toString()}
            onChange={(e) => handleChange('Conservative', parseInt(e.target.value) || 0)}
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!!error}>
            Update Allocation
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AllocationForm;