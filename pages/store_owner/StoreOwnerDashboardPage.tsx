
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { fetchStoreById, fetchRatingsForStore } from '../../services/storeService.js';
import { fetchUserById } from '../../services/userService.js'; // To get names of users who rated
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StarRatingDisplay from '../../components/common/StarRatingDisplay.jsx';

const StoreOwnerDashboardPage = () => {
  const { currentUser } = useAuth();
  // Fix: Type store state as any | null since fetchStoreById returns Promise<any | null>
  const [store, setStore] = useState<any | null>(null);
  // Fix: Type ratings state as any[] since fetchRatingsForStore returns Promise<any[]>
  const [ratings, setRatings] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'Store Owner' || !currentUser.storeId) {
      setError("Access denied or store not assigned.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const fetchedStore = await fetchStoreById(currentUser.storeId);
      if (!fetchedStore) {
        setError("Your store could not be found.");
        setIsLoading(false);
        return;
      }
      setStore(fetchedStore);

      const storeRatings = await fetchRatingsForStore(currentUser.storeId);
      
      // Fix: storeRatings is now any[], so .map is valid.
      const ratingsWithUserNames = await Promise.all(
        storeRatings.map(async (rating) => {
          const user = await fetchUserById(rating.userId);
          // Fix: user is now 'any | null', so user?.name is valid.
          return { ...rating, userName: user?.name || "Unknown User" };
        })
      );
      setRatings(ratingsWithUserNames);

      // Fix: storeRatings is now any[], so .length and .reduce are valid.
      if (storeRatings.length > 0) {
        const avg = storeRatings.reduce((sum, r) => sum + r.ratingValue, 0) / storeRatings.length;
        setAverageRating(avg);
      } else {
        setAverageRating(0);
      }

    } catch (err) {
      console.error("Failed to load store owner dashboard:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center p-4">{error}</p>;
  if (!store) return <p className="text-center p-4">No store data available.</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Welcome, {currentUser?.name}!</h1>
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-1">Your Store: {store.name}</h2>
        <p className="text-gray-600 mb-4">{store.address}</p>
        
        <div className="mb-6">
          <h3 className="text-xl font-medium text-gray-700">Average Rating</h3>
          {averageRating !== null ? (
            <div className="flex items-center mt-2">
              <StarRatingDisplay rating={averageRating} size="lg" />
              <span className="ml-3 text-2xl font-bold text-gray-800">{averageRating.toFixed(1)} / 5</span>
            </div>
          ) : (
            <p className="text-gray-500">No ratings yet.</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-medium text-gray-700 mb-3">Ratings Submitted by Users</h3>
          {ratings.length > 0 ? (
            <div className="overflow-x-auto border border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ratings.map(rating => (
                    <tr key={rating.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rating.userName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StarRatingDisplay rating={rating.ratingValue} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(rating.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No users have rated your store yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboardPage;