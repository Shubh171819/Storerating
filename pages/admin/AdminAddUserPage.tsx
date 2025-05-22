
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { adminAddUserToList } from '../../services/userService.js';
import Input from '../../components/common/Input.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import Button from '../../components/common/Button.jsx';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validation.js';
import { UserRole } from '../../types.js';

const AdminAddUserPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState(UserRole.USER);
  
  // Fix: Type the errors state for proper property access (e.g., errors.api).
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const { addUserByAdmin, isLoading } = useAuth(); // Using addUserByAdmin from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({});

    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const addressError = validateAddress(address);

    if (nameError || emailError || passwordError || addressError) {
      setErrors({ name: nameError, email: emailError, password: passwordError, address: addressError });
      return;
    }
    
    const newUser = await addUserByAdmin({ name, email, password, address, role });

    if (newUser) {
      adminAddUserToList(newUser); // Also update the list in userService mock for consistency if needed elsewhere
      setSuccessMessage(`User ${newUser.name} added successfully as ${newUser.role}.`);
      setName('');
      setEmail('');
      setPassword('');
      setAddress('');
      setRole(UserRole.USER);
      setTimeout(() => navigate('/admin/users'), 2000);
    } else {
      // AuthContext's addUserByAdmin will set its own error, which can be displayed if needed
      // For this form, we can also set a generic API error
      // Fix: errors.api is now a valid key.
      setErrors(prev => ({ ...prev, api: "Failed to add user. Email might already exist." }));
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New User</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fix: errors.api is now correctly accessed. */}
        {errors.api && <p className="text-center text-sm text-red-600 bg-red-100 p-3 rounded-md">{errors.api}</p>}
        {successMessage && <p className="text-center text-sm text-green-600 bg-green-100 p-3 rounded-md">{successMessage}</p>}
        
        <Input
          id="name-admin-add"
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          // Fix: errors.name is correctly accessed. Optional props for Input are handled by its definition.
          error={errors.name}
          required
        />
        <Input
          id="email-admin-add"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // Fix: errors.email is correctly accessed. Optional props for Input are handled by its definition.
          error={errors.email}
          required
        />
        <Input
          id="password-admin-add"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // Fix: errors.password is correctly accessed. Optional props for Input are handled by its definition.
          error={errors.password}
          required
        />
        <Textarea
          id="address-admin-add"
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          // Fix: errors.address is correctly accessed. Optional props for Textarea are handled by its definition.
          error={errors.address}
          required
        />
        <div>
          <label htmlFor="role-admin-add" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            id="role-admin-add"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            required
          >
            {Object.values(UserRole).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        {/* Fix: Optional props for Button are handled by its definition. */}
        <Button type="submit" isLoading={isLoading} fullWidth>
          Add User
        </Button>
      </form>
    </div>
  );
};

export default AdminAddUserPage;