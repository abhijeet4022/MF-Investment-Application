import { User } from "../types";

// In a real application, this would use a secure backend
// This is a simplified in-memory implementation for demo purposes
let users: User[] = [];

// Register a new user
export const registerUser = (user: User): User => {
  const existingUser = users.find(u => u.email === user.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  users.push(user);
  return user;
};

// Login user
export const loginUser = (email: string, password: string): User => {
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  return user;
};

// Get user by ID
export const getUserById = (id: string): User | undefined => {
  return users.find(u => u.id === id);
};

// Update user
export const updateUser = (user: User): User => {
  const index = users.findIndex(u => u.id === user.id);
  if (index === -1) {
    throw new Error('User not found');
  }
  
  // Don't allow email updates
  const existingUser = users[index];
  users[index] = {
    ...user,
    email: existingUser.email // Preserve original email
  };
  
  return users[index];
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error('No account found with this email address');
  }
  
  // In a real application, this would send an email
  // For demo purposes, we'll just simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
};

// For demo purposes, add a sample user
export const initializeUsers = (): void => {
  if (users.length === 0) {
    users.push({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      dateOfBirth: '1990-01-01',
      password: 'password'
    });
  }
};