import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { updateUser } from '../../utils/authUtils';

interface ProfileFormProps {
  user: User;
  onUpdate: (user: User) => void;
  onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onUpdate, onCancel }) => {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    setName(user.name);
    setDateOfBirth(user.dateOfBirth);
    setPassword('');
  }, [user]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const updatedUser: User = {
        ...user,
        name,
        dateOfBirth,
        ...(password ? { password } : {})
      };
      
      const result = updateUser(updatedUser);
      onUpdate(result);
    } catch (err) {
      setError((err as Error).message);
    }
  };
  
  return (
    <Card title="Edit Profile">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
        
        <Input
          label="Email Address"
          type="email"
          value={user.email}
          disabled
          fullWidth
          className="bg-gray-100"
        />
        
        <Input
          label="Date of Birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
          fullWidth
        />
        
        <Input
          label="New Password (leave blank to keep current)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        
        <div className="flex justify-end space-x-3 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Update Profile
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileForm;