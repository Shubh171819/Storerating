
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Input from '../components/common/Input.jsx';
import Textarea from '../components/common/Textarea.jsx';
import Button from '../components/common/Button.jsx';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validation.js';
import { APP_NAME } from '../constants.js';
import { UserRole } from '../types.js';


const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  
  // Fix: Type the errors state for proper property access.
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const { signup, isLoading, error: authError, currentUser } = useAuth();
  const navigate = useNavigate();

 useEffect(() => {
    if (currentUser) {
      navigate('/'); // Redirect if already logged in
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const addressError = validateAddress(address);
    let confirmPasswordError;
    if (password !== confirmPassword) {
      confirmPasswordError = "Passwords do not match.";
    }

    if (nameError || emailError || passwordError || confirmPasswordError || addressError) {
      setErrors({ name: nameError, email: emailError, password: passwordError, confirmPassword: confirmPasswordError, address: addressError });
      return;
    }
    setErrors({});

    const user = await signup({ name, email, password, address }); // Role defaults to USER in signup function
    if (user) {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your {APP_NAME} account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {authError && <p className="text-center text-sm text-red-600 bg-red-100 p-3 rounded-md">{authError}</p>}
          <Input
            id="name"
            label="Full Name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            // Fix: errors.name is now correctly accessed. Optional props for Input are handled by its definition.
            error={errors.name}
          />
          <Input
            id="email-signup"
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
            id="password-signup"
            label="Password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // Fix: errors.password is now correctly accessed. Optional props for Input are handled by its definition.
            error={errors.password}
          />
          <Input
            id="confirm-password"
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            // Fix: errors.confirmPassword is now correctly accessed. Optional props for Input are handled by its definition.
            error={errors.confirmPassword}
          />
          <Textarea
            id="address"
            label="Address"
            autoComplete="street-address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            // Fix: errors.address is now correctly accessed. Optional props for Textarea are handled by its definition.
            error={errors.address}
          />
          <div>
            {/* Fix: Optional props for Button are handled by its definition. */}
            <Button type="submit" isLoading={isLoading} fullWidth>
              Sign up
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;