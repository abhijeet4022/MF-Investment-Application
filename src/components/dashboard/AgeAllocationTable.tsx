import React, { useState } from 'react';
import { defaultAllocations } from '../../utils/allocationUtils';
import { AgeRangeConfig, AssetAllocation } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface AgeAllocationTableProps {
  onUpdateAgeRange: (index: number, range: AgeRangeConfig) => void;
  onUpdateAllocation: (range: AgeRangeConfig, allocation: AssetAllocation) => void;
}

const AgeAllocationTable: React.FC<AgeAllocationTableProps> = ({
  onUpdateAgeRange,
  onUpdateAllocation
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingAllocation, setEditingAllocation] = useState<AssetAllocation | null>(null);
  const [editingRange, setEditingRange] = useState<AgeRangeConfig | null>(null);
  
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingAllocation({ ...defaultAllocations[index].allocation });
    setEditingRange({ ...defaultAllocations[index].ageRange });
  };
  
  const handleSave = () => {
    if (editingIndex !== null && editingRange && editingAllocation) {
      onUpdateAgeRange(editingIndex, editingRange);
      onUpdateAllocation(editingRange, editingAllocation);
      setEditingIndex(null);
      setEditingAllocation(null);
      setEditingRange(null);
    }
  };
  
  const handleCancel = () => {
    setEditingIndex(null);
    setEditingAllocation(null);
    setEditingRange(null);
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Age Range
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gold
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nifty 50
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Flexi Cap
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mid Cap
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Debt/Hybrid
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conservative
            
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {defaultAllocations.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingIndex === index ? (
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={editingRange?.start}
                      onChange={(e) => setEditingRange(prev => prev ? {
                        ...prev,
                        start: parseInt(e.target.value)
                      } : null)}
                      className="w-20"
                    />
                    <span className="self-center">-</span>
                    <Input
                      type="number"
                      value={editingRange?.end}
                      onChange={(e) => setEditingRange(prev => prev ? {
                        ...prev,
                        end: parseInt(e.target.value)
                      } : null)}
                      className="w-20"
                    />
                  </div>
                ) : (
                  `${item.ageRange.start}-${item.ageRange.end}`
                )}
              </td>
              {Object.entries(item.allocation).map(([key, value]) => (
                <td key={key} className="px-6 py-4 whitespace-nowrap">
                  {editingIndex === index ? (
                    <Input
                      type="number"
                      value={editingAllocation?.[key as keyof AssetAllocation] || 0}
                      onChange={(e) => setEditingAllocation(prev => prev ? {
                        ...prev,
                        [key]: parseInt(e.target.value)
                      } : null)}
                      className="w-20"
                    />
                  ) : (
                    `${value}%`
                  )}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap">
                {editingIndex === index ? (
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSave}>Save</Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => handleEdit(index)}>
                    Edit
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgeAllocationTable;