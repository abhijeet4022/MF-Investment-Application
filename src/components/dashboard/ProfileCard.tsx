import React from 'react';
import { User } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { getAgeBracket } from '../../utils/allocationUtils';

interface ProfileCardProps {
  user: User;
  onEditProfile: () => void;
  onLogout: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onEditProfile, onLogout }) => {
  const ageBracket = getAgeBracket(user.dateOfBirth);
  
  // Calculate age
  const birthDate = new Date(user.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return (
    <Card>
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-blue-600">
            {user.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold mb-1">{user.name}</h3>
        <p className="text-gray-600 mb-4">{user.email}</p>
        
        <div className="w-full space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Age</span>
            <span className="font-medium">{age} years</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Age Bracket</span>
            <span className="font-medium">{`${ageBracket.start} - ${ageBracket.end}`}</span>
          </div>
        </div>
        
        <div className="flex space-x-3 w-full">
          <Button variant="outline" fullWidth onClick={onEditProfile}>
            Edit Profile
          </Button>
          <Button variant="outline" fullWidth onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;