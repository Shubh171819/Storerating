
import { fetchAllUsers } from './userService.js';
import { mockStores, mockRatings } from './mockDb.js';
import { MOCK_API_DELAY } from '../constants.js';

// Fix: Specify return type for the dashboard data structure.
export const fetchAdminDashboardData = async (): Promise<{ totalUsers: number; totalStores: number; totalRatings: number; }> => {
  return new Promise(async (resolve) => {
    // Simulate fetching different pieces of data
    const users = await fetchAllUsers(); // users will be any[] due to fetchAllUsers returning Promise<any[]>
    
    setTimeout(() => {
      resolve({
        // Fix: users is now correctly typed as any[], so users.length is valid.
        totalUsers: users.length,
        totalStores: mockStores.length,
        totalRatings: mockRatings.length,
      });
    }, MOCK_API_DELAY);
  });
};