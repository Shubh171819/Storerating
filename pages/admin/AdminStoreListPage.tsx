
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchStoresWithDetails } from '../../services/storeService.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import StarRatingDisplay from '../../components/common/StarRatingDisplay.jsx';

const SearchIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const AdminStoreListPage = () => {
  // Fix: Type stores state as any[] since fetchStoresWithDetails returns Promise<any[]>
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string; } | null>(null);

  useEffect(() => {
    const loadStores = async () => {
      setIsLoading(true);
      try {
        // For admin, we don't need user-specific rating, so currentUser can be null
        const result = await fetchStoresWithDetails(null); 
        // Fix: result is now any[], so setStores(result) is type-correct.
        setStores(result);
      } catch (err) {
        setError("Failed to load stores.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadStores();
  }, []);

  const filteredAndSortedStores = useMemo(() => {
    let SStores = [...stores];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      SStores = SStores.filter(store =>
        store.name.toLowerCase().includes(lowerSearchTerm) ||
        store.email.toLowerCase().includes(lowerSearchTerm) ||
        store.address.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    if (sortConfig !== null) {
      SStores.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        
        if (sortConfig.key === 'overallRating') {
             if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
             if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        } else if (typeof valA === 'string' && typeof valB === 'string') {
            if (valA.toLowerCase() < valB.toLowerCase()) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA.toLowerCase() > valB.toLowerCase()) return sortConfig.direction === 'ascending' ? 1 : -1;
        } else {
             if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
             if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return SStores;
  }, [stores, searchTerm, sortConfig]);

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
        <h1 className="text-3xl font-bold text-gray-800">Store Management</h1>
        <Link to="/admin/stores/add">
          {/* Fix: Optional props for Button are handled by its definition. */}
          <Button variant="primary">Add New Store</Button>
        </Link>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <Input
          label="Search Stores (Name, Email, Address)"
          id="searchTermStores"
          type="text"
          placeholder="Enter search term..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          containerClassName="mb-0"
          icon={SearchIcon}
          // Fix: error and inputClassName are optional and handled by Input component's defaults.
        />
      </div>
      
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {([
                {displayName: 'Name', key: 'name'}, 
                {displayName: 'Email', key: 'email'}, 
                {displayName: 'Address', key: 'address'}, 
                {displayName: 'Rating', key: 'overallRating'}
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
              {/* Add Actions column if needed */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedStores.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No stores found.</td></tr>
            )}
            {filteredAndSortedStores.map((store) => (
              <tr key={store.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={store.address}>{store.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <StarRatingDisplay rating={store.overallRating} size="sm" />
                </td>
                {/* Add action buttons like Edit/Delete if needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStoreListPage;