
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserRole } from '../../types.js';
import { fetchUserById } from '../../services/userService.js';
import { fetchStoreById } from '../../services/storeService.js'; // Assuming you might need store details if user is owner
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { mockRatings } from '../../services/mockDb.js'; // For store owner rating display

const AdminUserDetailsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  // Fix: Type user state as any | null since fetchUserById returns Promise<any | null>
  const [user, setUser] = useState<any | null>(null);
  // Fix: Type userStore state as any | null since fetchStoreById returns Promise<any | null>
  const [userStore, setUserStore] = useState<any | null>(null);
  const [storeRating, setStoreRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing.");
      setIsLoading(false);
      return;
    }

    const loadUserDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedUser = await fetchUserById(userId);
        if (!fetchedUser) {
          setError("User not found.");
          setIsLoading(false);
          return;
        }
        setUser(fetchedUser);

        // Fix: fetchedUser is now 'any', so .role and .storeId can be accessed.
        if (fetchedUser.role === UserRole.STORE_OWNER && fetchedUser.storeId) {
          const store = await fetchStoreById(fetchedUser.storeId);
          setUserStore(store);
          if (store) {
            // Fix: store is now 'any', so .id can be accessed.
            const ratingsForStore = mockRatings.filter(r => r.storeId === store.id);
            if (ratingsForStore.length > 0) {
              const avgRating = ratingsForStore.reduce((sum, r) => sum + r.ratingValue, 0) / ratingsForStore.length;
              setStoreRating(avgRating);
            } else {
              setStoreRating(0);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load user details:", err);
        setError("Failed to load user details.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserDetails();
  }, [userId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center p-4">{error}</p>;
  if (!user) return <p className="text-center p-4">User data not available.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Details</h1>
        <Link to="/admin/users" className="text-primary-600 hover:text-primary-800">&larr; Back to User List</Link>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Name</p>
          <p className="text-lg text-gray-900">{user.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-lg text-gray-900">{user.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Address</p>
          <p className="text-lg text-gray-900">{user.address}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Role</p>
          <p className="text-lg text-gray-900">{user.role}</p>
        </div>
        
        {user.role === UserRole.STORE_OWNER && (
          <>
            <hr className="my-4" />
            <h2 className="text-xl font-semibold text-gray-700">Store Owner Details</h2>
            {userStore ? (
              <div>
                <p className="text-sm font-medium text-gray-500">Owned Store</p>
                <p className="text-lg text-gray-900">{userStore.name}</p>
                <p className="text-sm font-medium text-gray-500 mt-2">Store Address</p>
                <p className="text-lg text-gray-900">{userStore.address}</p>
                <p className="text-sm font-medium text-gray-500 mt-2">Store Average Rating</p>
                <p className="text-lg text-gray-900">{storeRating !== null ? storeRating.toFixed(1) + ' / 5' : 'N/A'}</p>
              </div>
            ) : (
              <p className="text-gray-500">Store details not found or not assigned.</p>
            )}
          </>
        )}
      </div>
       {/* Add edit/delete functionality here if needed */}
    </div>
  );
};

export default AdminUserDetailsPage;