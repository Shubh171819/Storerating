
import { mockStores, mockRatings } from './mockDb.js';
import { MOCK_API_DELAY } from '../constants.js';

// Fix: Specify currentUser type and return type as Promise<any[]>
export const fetchStoresWithDetails = async (currentUser: any): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storesWithDetails = mockStores.map(store => {
        const storeRatings = mockRatings.filter(r => r.storeId === store.id);
        const overallRating = storeRatings.length > 0 
          ? storeRatings.reduce((acc, r) => acc + r.ratingValue, 0) / storeRatings.length
          : 0;
        
        let userSubmittedRating = undefined;
        if (currentUser) {
          const userRating = storeRatings.find(r => r.userId === currentUser.id);
          if (userRating) {
            userSubmittedRating = userRating.ratingValue;
          }
        }
        
        return { ...store, overallRating, userSubmittedRating };
      });
      resolve(storesWithDetails);
    }, MOCK_API_DELAY);
  });
};

// Fix: Specify storeId type and return type as Promise<any | null>
export const fetchStoreById = async (storeId: string): Promise<any | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const store = mockStores.find(s => s.id === storeId);
            resolve(store || null);
        }, MOCK_API_DELAY);
    });
};

// Fix: Specify storeData type and return type as Promise<any>
export const addStore = async (storeData: any): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newStore = {
        ...storeData,
        id: `store${Date.now()}`,
      };
      mockStores.push(newStore);
      resolve(newStore);
    }, MOCK_API_DELAY);
  });
};

// Fix: Specify parameter types and return type as Promise<any>
export const submitOrUpdateRating = async (storeId: string, userId: string, ratingValue: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingRatingIndex = mockRatings.findIndex(r => r.storeId === storeId && r.userId === userId);
      let newOrUpdatedRating;

      if (existingRatingIndex !== -1) {
        mockRatings[existingRatingIndex].ratingValue = ratingValue;
        mockRatings[existingRatingIndex].timestamp = Date.now();
        newOrUpdatedRating = mockRatings[existingRatingIndex];
      } else {
        newOrUpdatedRating = {
          id: `rating${Date.now()}`,
          storeId,
          userId,
          ratingValue,
          timestamp: Date.now(),
        };
        mockRatings.push(newOrUpdatedRating);
      }
      resolve(newOrUpdatedRating);
    }, MOCK_API_DELAY);
  });
};

// Fix: Specify storeId type and return type as Promise<any[]>
export const fetchRatingsForStore = async (storeId: string): Promise<any[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockRatings.filter(r => r.storeId === storeId));
        }, MOCK_API_DELAY);
    });
};