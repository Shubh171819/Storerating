
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStore } from '../../services/storeService.js';
import { fetchAllUsers } from '../../services/userService.js'; // To assign an owner
import Input from '../../components/common/Input.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import Button from '../../components/common/Button.jsx';
import { UserRole } from '../../types.js';

// Basic validation for store name, email, address
const validateStoreName = (name: string) => !name ? "Store name is required." : name.length < 3 ? "Store name too short." : undefined;
const validateStoreEmail = (email: string) => !email ? "Store email is required." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Invalid email." : undefined;
const validateStoreAddress = (address: string) => !address ? "Store address is required." : address.length > 400 ? "Address too long." : undefined;


const AdminAddStorePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ownerId, setOwnerId] = useState<string | undefined>(undefined); // Optional owner
  // Fix: Type storeOwners as any[] as fetchAllUsers returns Promise<any[]>
  const [storeOwners, setStoreOwners] = useState<any[]>([]);
  
  // Fix: Type the errors state for proper property access (e.g., errors.api).
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadPotentialOwners = async () => {
        try {
            const allUsers = await fetchAllUsers();
            // Filter for users who could be store owners (or allow any user to be assigned)
            // For simplicity, let's allow any user to be an owner, or specifically STORE_OWNER role if desired.
            // Fix: allUsers is now any[], so .filter is valid.
            setStoreOwners(allUsers.filter(u => u.role === UserRole.STORE_OWNER || u.role === UserRole.USER)); 
        } catch (error) {
            console.error("Failed to load users for owner selection:", error);
            setErrors(prev => ({...prev, api: "Could not load potential owners."}));
        }
    };
    loadPotentialOwners();
  }, []);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({});
    setIsLoading(true);

    const nameError = validateStoreName(name);
    const emailError = validateStoreEmail(email);
    const addressError = validateStoreAddress(address);

    if (nameError || emailError || addressError) {
      setErrors({ name: nameError, email: emailError, address: addressError });
      setIsLoading(false);
      return;
    }
    
    try {
      const newStore = await addStore({ name, email, address, ownerId });
      // Fix: newStore is now 'any', so .name can be accessed.
      setSuccessMessage(`Store "${newStore.name}" added successfully.`);
      setName('');
      setEmail('');
      setAddress('');
      setOwnerId(undefined);
      setTimeout(() => navigate('/admin/stores'), 2000);
    } catch (error) {
      console.error("Failed to add store:", error);
      // Fix: errors.api is now a valid key.
      setErrors(prev => ({ ...prev, api: "Failed to add store. Please try again." }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Store</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fix: errors.api is now correctly accessed. */}
        {errors.api && <p className="text-center text-sm text-red-600 bg-red-100 p-3 rounded-md">{errors.api}</p>}
        {successMessage && <p className="text-center text-sm text-green-600 bg-green-100 p-3 rounded-md">{successMessage}</p>}
        
        <Input
          id="storeName-admin-add"
          label="Store Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          // Fix: errors.name is correctly accessed. Optional props for Input are handled by its definition.
          error={errors.name}
          required
        />
        <Input
          id="storeEmail-admin-add"
          label="Store Contact Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // Fix: errors.email is correctly accessed. Optional props for Input are handled by its definition.
          error={errors.email}
          required
        />
        <Textarea
          id="storeAddress-admin-add"
          label="Store Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          // Fix: errors.address is correctly accessed. Optional props for Textarea are handled by its definition.
          error={errors.address}
          required
        />
        <div>
          <label htmlFor="storeOwner-admin-add" className="block text-sm font-medium text-gray-700 mb-1">Assign Owner (Optional)</label>
          <select
            id="storeOwner-admin-add"
            value={ownerId || ''}
            onChange={(e) => setOwnerId(e.target.value || undefined)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">No Owner / Unassigned</option>
            {storeOwners.map(user => (
              <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
            ))}
          </select>
        </div>
        {/* Fix: Optional props for Button are handled by its definition. */}
        <Button type="submit" isLoading={isLoading} fullWidth>
          Add Store
        </Button>
      </form>
    </div>
  );
};

export default AdminAddStorePage;