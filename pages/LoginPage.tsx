
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { validateEmail, validatePassword } from '../utils/validation.js';
import { APP_NAME } from '../constants.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Fix: Type the errors state for proper property access.
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const { login, isLoading, error: authError, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/'); // Redirect if already logged in
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password); // Using basic password validation for login form

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError ? "Password is required." : undefined });
      return;
    }
    setErrors({});
    
    const user = await login(email, password);
    if (user) {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to {APP_NAME}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {authError && <p className="text-center text-sm text-red-600 bg-red-100 p-3 rounded-md">{authError}</p>}
          <Input
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // Fix: errors.email is now correctly accessed. Optional props for Input are handled by its definition.
            error={errors.email}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // Fix: errors.password is now correctly accessed. Optional props for Input are handled by its definition.
            error={errors.password}
          />
          <div>
            {/* Fix: Optional props for Button are handled by its definition. */}
            <Button type="submit" isLoading={isLoading} fullWidth>
              Sign in
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;