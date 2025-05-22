
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { fetchStoresWithDetails, submitOrUpdateRating } from '../../services/storeService.js';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StoreCard from '../../components/user/StoreCard.jsx';
import Input from '../../components/common/Input.jsx';
import RateStoreModal from '../../components/user/RateStoreModal.jsx';

const SearchIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const UserStoreListPage = () => {
  const { currentUser } = useAuth();
  // Fix: Type stores state as any[] since fetchStoresWithDetails returns Promise<any[]>
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [selectedStoreForRating, setSelectedStoreForRating] = useState<any | null>(null);

  const loadStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchStoresWithDetails(currentUser);
      // Fix: result is now any[], so setStores(result) is type-correct.
      setStores(result);
    } catch (err) {
      setError("Failed to load stores.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]); // currentUser is dependency for user-specific ratings

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const filteredStores = useMemo(() => {
    if (!searchTerm) return stores;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return stores.filter(store =>
      store.name.toLowerCase().includes(lowerSearchTerm) ||
      store.address.toLowerCase().includes(lowerSearchTerm)
    );
  }, [stores, searchTerm]);

  const handleOpenRateModal = (store: any) => {
    setSelectedStoreForRating(store);
    setIsRateModalOpen(true);
  };

  const handleCloseRateModal = () => {
    setSelectedStoreForRating(null);
    setIsRateModalOpen(false);
  };

  const handleSubmitRating = async (storeId: string, ratingValue: number) => {
    if (!currentUser) {
      setError("You must be logged in to rate a store.");
      return null;
    }
    try {
      const updatedRating = await submitOrUpdateRating(storeId, currentUser.id, ratingValue);
      // Refresh store list to show updated rating
      await loadStores(); 
      return updatedRating;
    } catch (err) {
      console.error("Error submitting rating in page:", err);
      // Error handling can be more specific if needed
      return null; 
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 text-center">Explore Stores</h1>
      
      <div className="max-w-xl mx-auto">
        <Input
          label="Search Stores by Name or Address"
          id="storeSearch"
          type="text"
          placeholder="e.g., 'Coffee Shop' or 'Main Street'"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          containerClassName="mb-0"
          icon={SearchIcon}
          // Fix: error and inputClassName are optional and handled by Input component's defaults.
        />
      </div>

      {filteredStores.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10">No stores found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStores.map(store => (
            <StoreCard key={store.id} store={store} onRateStore={handleOpenRateModal} />
          ))}
        </div>
      )}

      {selectedStoreForRating && (
        <RateStoreModal
          isOpen={isRateModalOpen}
          onClose={handleCloseRateModal}
          store={selectedStoreForRating}
          onSubmitRating={handleSubmitRating}
        />
      )}
    </div>
  );
};

export default UserStoreListPage;