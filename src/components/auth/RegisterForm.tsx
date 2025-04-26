import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { registerUser } from '../../utils/authUtils';
import { createPortfolio } from '../../utils/portfolioUtils';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Create new user
      const newUser: User = {
        id: uuidv4(),
        name,
        email,
        dateOfBirth,
        password
      };
      
      const user = registerUser(newUser);
      
      // Create initial portfolio for the user
      createPortfolio(user);
      
      setSuccess(true);
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      setError((err as Error).message);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-6 p-8">
        <div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Registration successful! Redirecting to login...
                </p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          
          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          
          <Input
            label="Date of Birth"
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            required
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            fullWidth
          />
          
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          
          <div className="pt-2">
            <Button type="submit" fullWidth disabled={success}>
              Register
            </Button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={onSwitchToLogin}
            >
              Sign in
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegisterForm;