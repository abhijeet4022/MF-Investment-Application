import React, { useState } from 'react';
import { User } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { loginUser, resetPassword } from '../../utils/authUtils';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const user = loginUser(email, password);
      onLogin(user);
    } catch (err) {
      setError((err as Error).message);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await resetPassword(resetEmail);
      setResetSuccess(true);
      setTimeout(() => {
        setShowResetForm(false);
        setResetSuccess(false);
      }, 3000);
    } catch (err) {
      setError((err as Error).message);
    }
  };
  
  if (showResetForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full space-y-8 p-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset Password
            </h2>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {resetSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-sm text-green-700">
                Password reset instructions sent to your email!
              </p>
            </div>
          )}
          
          <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              fullWidth
            />
            
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => setShowResetForm(false)}
              >
                Back to Login
              </Button>
              <Button type="submit" fullWidth>
                Reset Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
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
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
          
          <div>
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <div className="text-right mt-1">
              <button
                type="button"
                onClick={() => setShowResetForm(true)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </button>
            </div>
          </div>
          
          <div>
            <Button type="submit" fullWidth>
              Sign in
            </Button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={onSwitchToRegister}
            >
              Register
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;