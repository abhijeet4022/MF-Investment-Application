import React, { useState, useEffect } from 'react';
import { User, Portfolio, Fund, AssetAllocation, DashboardTab } from '../types';
import ProfileCard from '../components/dashboard/ProfileCard';
import FundCard from '../components/dashboard/FundCard';
import FundForm from '../components/dashboard/FundForm';
import AllocationChart from '../components/dashboard/AllocationChart';
import SalaryCalculator from '../components/dashboard/SalaryCalculator';
import RebalancingCard from '../components/dashboard/RebalancingCard';
import AllocationForm from '../components/dashboard/AllocationForm';
import ProfileForm from '../components/dashboard/ProfileForm';
import TabNavigation from '../components/dashboard/TabNavigation';
import AgeAllocationTable from '../components/dashboard/AgeAllocationTable';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { getPortfolioByUserId, updatePortfolio, addFund, updateFund, removeFund } from '../utils/portfolioUtils';
import { calculateCurrentAllocation, updateAgeRangeConfig, updateAllocationForAgeBracket } from '../utils/allocationUtils';
import { PlusCircle, ArrowLeft } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [editingFund, setEditingFund] = useState<Fund | null>(null);
  const [isAddingFund, setIsAddingFund] = useState(false);
  const [isEditingAllocation, setIsEditingAllocation] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentAllocation, setCurrentAllocation] = useState<AssetAllocation | null>(null);
  
  useEffect(() => {
    loadPortfolio();
  }, [user]);
  
  const loadPortfolio = () => {
    const userPortfolio = getPortfolioByUserId(user.id);
    if (userPortfolio) {
      setPortfolio(userPortfolio);
      setCurrentAllocation(calculateCurrentAllocation(userPortfolio.funds));
    }
  };
  
  const handleEditFund = (fund: Fund) => {
    setEditingFund(fund);
    setIsAddingFund(false);
  };
  
  const handleAddFund = () => {
    setEditingFund(null);
    setIsAddingFund(true);
  };
  
  const handleFundSubmit = (fundData: Omit<Fund, 'id'>) => {
    if (!portfolio) return;
    
    if (editingFund) {
      updateFund(user.id, { ...fundData, id: editingFund.id });
    } else {
      addFund(user.id, fundData);
    }
    
    setEditingFund(null);
    setIsAddingFund(false);
    loadPortfolio();
  };
  
  const handleDeleteFund = (fundId: string) => {
    if (!portfolio) return;
    
    if (confirm('Are you sure you want to delete this fund?')) {
      removeFund(user.id, fundId);
      loadPortfolio();
    }
  };
  
  const handleUpdateSalary = (salary: number, percentage: number) => {
    if (!portfolio) return;
    
    const updatedPortfolio = {
      ...portfolio,
      salary,
      investmentPercentage: percentage
    };
    
    updatePortfolio(updatedPortfolio);
    setPortfolio(updatedPortfolio);
  };
  
  const handleUpdateAllocation = (allocation: AssetAllocation) => {
    if (!portfolio) return;
    
    const updatedPortfolio = {
      ...portfolio,
      customAllocation: true,
      allocation
    };
    
    updatePortfolio(updatedPortfolio);
    setPortfolio(updatedPortfolio);
    setIsEditingAllocation(false);
  };
  
  const handleUpdateAgeRange = (index: number, range: { start: number; end: number }) => {
    updateAgeRangeConfig(index, range);
    loadPortfolio(); // Refresh to get updated allocations
  };
  
  const handleUpdateAgeAllocation = (range: { start: number; end: number }, allocation: AssetAllocation) => {
    updateAllocationForAgeBracket(range, allocation);
    loadPortfolio(); // Refresh to get updated allocations
  };
  
  if (!portfolio) {
    return <div className="p-8">Loading...</div>;
  }
  
  const calculateTotalReturns = () => {
    const totalInvested = portfolio.funds.reduce((sum, fund) => sum + fund.investedAmount, 0);
    const totalCurrent = portfolio.funds.reduce((sum, fund) => sum + fund.currentValue, 0);
    const totalReturn = totalCurrent - totalInvested;
    const returnPercentage = ((totalCurrent / totalInvested) - 1) * 100;
    
    return {
      totalInvested,
      totalCurrent,
      totalReturn,
      returnPercentage
    };
  };
  
  const renderOverviewTab = () => {
    const returns = calculateTotalReturns();
    
    return (
      <div className="space-y-6">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Portfolio Value</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                ₹{returns.totalCurrent.toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Invested</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                ₹{returns.totalInvested.toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Returns</h3>
              <p className={`mt-1 text-2xl font-semibold ${returns.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {returns.totalReturn >= 0 ? '+' : ''}₹{returns.totalReturn.toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Return Percentage</h3>
              <p className={`mt-1 text-2xl font-semibold ${returns.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {returns.returnPercentage >= 0 ? '+' : ''}{returns.returnPercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Current vs Target Allocation</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <AllocationChart
                  allocation={portfolio.allocation}
                  title="Target Allocation"
                />
              </div>
              {currentAllocation && portfolio.funds.length > 0 && (
                <div>
                  <AllocationChart
                    allocation={currentAllocation}
                    title="Current Allocation"
                  />
                </div>
              )}
            </div>
          </Card>
          
          <RebalancingCard
            portfolio={portfolio}
            onPortfolioUpdated={loadPortfolio}
          />
        </div>
      </div>
    );
  };
  
  const renderProfileTab = () => {
    return isEditingProfile ? (
      <ProfileForm
        user={user}
        onUpdate={onUserUpdate}
        onCancel={() => setIsEditingProfile(false)}
      />
    ) : (
      <ProfileCard
        user={user}
        onEditProfile={() => setIsEditingProfile(true)}
        onLogout={onLogout}
      />
    );
  };
  
  const renderFundsTab = () => {
    if (editingFund || isAddingFund) {
      return (
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="mb-4"
            onClick={() => {
              setEditingFund(null);
              setIsAddingFund(false);
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Funds
          </Button>
          <FundForm
            fund={editingFund}
            onSubmit={handleFundSubmit}
            onCancel={() => {
              setEditingFund(null);
              setIsAddingFund(false);
            }}
            isModal={true}
          />
        </div>
      );
    }
    
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Mutual Funds</h2>
          <Button onClick={handleAddFund} size="sm">
            <PlusCircle className="w-4 h-4 mr-1" />
            Add Fund
          </Button>
        </div>
        
        {portfolio.funds.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You don't have any mutual funds yet</p>
              <Button onClick={handleAddFund}>Add Your First Fund</Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.funds.map(fund => (
              <FundCard
                key={fund.id}
                fund={fund}
                onEdit={handleEditFund}
                onDelete={handleDeleteFund}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  const renderAllocationTab = () => {
    return isEditingAllocation ? (
      <div>
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => setIsEditingAllocation(false)}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Allocation
        </Button>
        <AllocationForm
          allocation={portfolio.allocation}
          onUpdateAllocation={handleUpdateAllocation}
          onCancel={() => setIsEditingAllocation(false)}
        />
      </div>
    ) : (
      <div className="space-y-6">
        <Card>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">Your Asset Allocation</h2>
              <p className="text-sm text-gray-500">
                Based on your age bracket: {portfolio.customAllocation ? 'Custom' : `${user.dateOfBirth}`}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingAllocation(true)}
            >
              Customize
            </Button>
          </div>
          <AllocationChart allocation={portfolio.allocation} />
        </Card>
        
        <Card title="Age-based Allocation Presets">
          <AgeAllocationTable
            onUpdateAgeRange={handleUpdateAgeRange}
            onUpdateAllocation={handleUpdateAgeAllocation}
          />
        </Card>
      </div>
    );
  };
  
  const renderCalculatorTab = () => {
    return (
      <SalaryCalculator
        allocation={portfolio.allocation}
        onUpdateSalary={handleUpdateSalary}
        initialSalary={portfolio.salary}
        initialPercentage={portfolio.investmentPercentage}
      />
    );
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'profile':
        return renderProfileTab();
      case 'funds':
        return renderFundsTab();
      case 'allocation':
        return renderAllocationTab();
      case 'calculator':
        return renderCalculatorTab();
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Investment Portfolio Manager</h1>
          </div>
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;