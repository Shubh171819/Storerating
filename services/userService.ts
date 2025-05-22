
import { UserRole } from '../types.js';
import { MOCK_API_DELAY } from '../constants.js';

// This function would typically fetch from an endpoint.
// Here, we're assuming users are managed in AuthContext state or a similar global store.
// For this example, we'll access the MOCK_USERS array directly for listing purposes.
// This is a simplification; in a real app, AuthContext would provide a method to get all users if needed, or use a separate user store.

// Simulate fetching all users (e.g., for an admin).
// In a real app, this might come from a dedicated user management API.
// For this mock, let's use a static list available to this service, separate from AuthContext's internal MOCK_USERS to avoid circular dependencies
// or direct access to AuthContext's state which is an anti-pattern for services.
// Let's assume this is a fresh fetch from "backend".

let allUsers: any[] = [ // This is a simplified representation for service layer.
    { id: 'admin1', name: 'Alice Administrator LongNameExample', email: 'admin@example.com', address: '123 Admin St, System City', role: UserRole.ADMIN, passwordHash: 'AdminPass1!' },
    { id: 'user1', name: 'Bob User Example VeryLongName', email: 'user@example.com', address: '456 User Ave, Normal Town', role: UserRole.USER, passwordHash: 'UserPass1!' },
    { id: 'storeowner1', name: 'Charlie Owner StoreNameExample', email: 'owner@store.com', address: '789 Store Rd, Shopsville', role: UserRole.STORE_OWNER, passwordHash: 'OwnerPass1!', storeId: 'store1' },
    { id: 'user2', name: 'Diana Another User ExampleName', email: 'diana@example.com', address: '111 Test Blvd, UserVille', role: UserRole.USER, passwordHash: 'DianaPass1!' },
];


// Fix: Specify return type as Promise<any[]>
export const fetchAllUsers = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, sensitive data like passwordHash wouldn't be sent to the client.
      // This is a mock.
      resolve(JSON.parse(JSON.stringify(allUsers))); // Return a copy
    }, MOCK_API_DELAY);
  });
};

// Function to add a user to our mock 'allUsers' list, simulating admin action.
// This is separate from AuthContext's signup/addUserByAdmin which manage the "live" users array for auth.
// This service function is more about maintaining the "database" view.
export const adminAddUserToList = (newUser: any) => {
    if (!allUsers.find(u => u.id === newUser.id)) {
        allUsers.push(newUser);
    }
};

// Fix: Specify userId type and return type as Promise<any | null>
export const fetchUserById = async (userId: string): Promise<any | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = allUsers.find(u => u.id === userId);
            resolve(user ? JSON.parse(JSON.stringify(user)) : null);
        }, MOCK_API_DELAY);
    });
};