
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { validatePassword } from '../utils/validation.js';

const UpdatePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  // Fix: Type the errors state for proper property access (e.g., errors.api, errors.oldPassword).
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const { updatePassword, isLoading, error: authError, currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login'); // Should be handled by ProtectedRoute, but good failsafe
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({});

    const oldPasswordError = !oldPassword ? "Old password is required." : undefined;
    const newPasswordError = validatePassword(newPassword);
    let confirmNewPasswordError;
    if (newPassword !== confirmNewPassword) {
      confirmNewPasswordError = "New passwords do not match.";
    }
    if (newPassword === oldPassword && oldPassword !== '') { // Check if oldPassword is not empty to avoid error on initial empty state
      if (!newPasswordError) { // only add this error if newPassword itself is valid but same as old
         setErrors(prev => ({...prev, newPassword: "New password cannot be the same as the old password."}));
         return;
      }
    }

    if (oldPasswordError || newPasswordError || confirmNewPasswordError) {
      setErrors({ oldPassword: oldPasswordError, newPassword: newPasswordError, confirmNewPassword: confirmNewPasswordError });
      return;
    }
    
    const success = await updatePassword(oldPassword, newPassword);
    if (success) {
      setSuccessMessage('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      // Optionally navigate away or show message for a few seconds
      setTimeout(() => navigate('/'), 2000);
    } else {
      // Fix: errors.api is now a valid key due to Record<string, string | undefined>
      setErrors(prev => ({ ...prev, api: authError || "Failed to update password." }));
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Your Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fix: errors.api is now correctly accessed. */}
        {errors.api && <p className="text-center text-sm text-red-600 bg-red-100 p-3 rounded-md">{errors.api}</p>}
        {successMessage && <p className="text-center text-sm text-green-600 bg-green-100 p-3 rounded-md">{successMessage}</p>}
        
        <Input
          id="oldPassword"
          label="Old Password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          // Fix: errors.oldPassword is now correctly accessed. Optional props for Input are handled by its definition.
          error={errors.oldPassword}
          required
        />
        <Input
          id="newPassword"
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          // Fix: errors.newPassword is now correctly accessed. Optional props for Input are handled by its definition.
          error={errors.newPassword}
          required
        />
        <Input
          id="confirmNewPassword"
          label="Confirm New Password"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          // Fix: errors.confirmNewPassword is now correctly accessed. Optional props for Input are handled by its definition.
          error={errors.confirmNewPassword}
          required
        />
        {/* Fix: Optional props for Button are handled by its definition. */}
        <Button type="submit" isLoading={isLoading} fullWidth>
          Update Password
        </Button>
      </form>
    </div>
  );
};

export default UpdatePasswordPage;