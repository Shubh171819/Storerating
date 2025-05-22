
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllUsers } from '../../services/userService.js';
import { UserRole } from '../../types.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const SearchIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const AdminUserListPage = () => {
  // Fix: Type users state as any[] since fetchAllUsers returns Promise<any[]>
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string; } | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const result = await fetchAllUsers();
        // Fix: result is now any[], so setUsers(result) is type-correct.
        setUsers(result);
      } catch (err) {
        setError("Failed to load users.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredAndSortedUsers = useMemo(() => {
    let SUsers = [...users];

    if (filterRole) {
      SUsers = SUsers.filter(user => user.role === filterRole);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      SUsers = SUsers.filter(user =>
        user.name.toLowerCase().includes(lowerSearchTerm) ||
        user.email.toLowerCase().includes(lowerSearchTerm) ||
        user.address.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    if (sortConfig !== null) {
      SUsers.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (typeof valA === 'string' && typeof valB === 'string') {
            if (valA.toLowerCase() < valB.toLowerCase()) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (valA.toLowerCase() > valB.toLowerCase()) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        } else {
             if (valA < valB) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (valA > valB) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        }
        return 0;
      });
    }


    return SUsers;
  }, [users, searchTerm, filterRole, sortConfig]);

  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <Link to="/admin/users/add">
          {/* Fix: Optional props for Button are handled by its definition. */}
          <Button variant="primary">Add New User</Button>
        </Link>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Search Users (Name, Email, Address)"
            id="searchTerm"
            type="text"
            placeholder="Enter search term..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            containerClassName="mb-0"
            icon={SearchIcon}
            // Fix: error and inputClassName are optional and handled by Input component's defaults.
          />
          <div>
            <label htmlFor="filterRole" className="block text-sm font-medium text-gray-700 mb-1">Filter by Role</label>
            <select
              id="filterRole"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">All Roles</option>
              {Object.values(UserRole).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {([
                {displayName: 'Name', key: 'name'}, 
                {displayName: 'Email', key: 'email'}, 
                {displayName: 'Address', key: 'address'}, 
                {displayName: 'Role', key: 'role'}
              ]).map(header => (
                <th
                    key={header.key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort(header.key)}
                >
                    {header.displayName}
                    {getSortIndicator(header.key)}
                </th>
              ))}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedUsers.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No users found.</td></tr>
            )}
            {filteredAndSortedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={user.address}>{user.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/admin/users/${user.id}`} className="text-primary-600 hover:text-primary-800">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserListPage;