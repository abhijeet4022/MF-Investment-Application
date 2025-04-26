import React from 'react';
import { DashboardTab } from '../../types';

interface TabNavigationProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: DashboardTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'profile', label: 'Profile' },
    { id: 'funds', label: 'Mutual Funds' },
    { id: 'allocation', label: 'Asset Allocation' },
    { id: 'calculator', label: 'Calculator' }
  ];
  
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;