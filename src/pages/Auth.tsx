import React, { useState } from 'react';
import { User } from '../types';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  return isLogin ? (
    <LoginForm
      onLogin={onLogin}
      onSwitchToRegister={() => setIsLogin(false)}
    />
  ) : (
    <RegisterForm
      onRegister={onLogin}
      onSwitchToLogin={() => setIsLogin(true)}
    />
  );
};

export default Auth;