
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminDashboardData } from '../../services/adminService.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

// Fix: Define StatCardProps and make linkTo optional.
interface StatCardProps {
  title: string;
  value: string | number;
  linkTo?: string; // Make linkTo optional
  bgColorClass?: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, linkTo, bgColorClass = "bg-primary-500", icon }: StatCardProps) => (
  <div className={`${bgColorClass} text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300`}>
    {icon && <div className="mb-2">{icon}</div>}
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-3xl font-bold my-2">{value}</p>
    {linkTo && <Link to={linkTo} className="text-sm hover:underline">View Details &rarr;</Link>}
  </div>
);

const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372m-10.5-.372a9.369 9.369 0 013.443-2.118c1.546-.825 3.309-1.097 5.004-.738a10.028 10.028 0 012.287.209M2.25 12.162a9.381 9.381 0 011.595-4.542L4.5 7.5l2.625 2.625A9.348 9.348 0 0112 6.75c2.902 0 5.51.995 7.562 2.625L21.75 7.5l-1.652-.12C19.326 7.26 18.501 7 17.625 7c-.799 0-1.57.194-2.278.547M4.5 7.5L3 9m0 0l1.5 1.5M3 9h1.5m9-3v3m0 0V6m0 3H9.75M12 6H6.002M12 6a2.25 2.25 0 012.25 2.25m-2.25-2.25a2.25 2.25 0 00-2.25 2.25M15 9.75a2.25 2.25 0 012.25 2.25M15 9.75a2.25 2.25 0 00-2.25 2.25M15 9.75V12m2.25 2.25H15m2.25 0A2.25 2.25 0 0115 12m2.25 0V9.75M9.75 12a2.25 2.25 0 012.25-2.25M9.75 12a2.25 2.25 0 00-2.25-2.25M9.75 12H12m-2.25-2.25A2.25 2.25 0 0012 12m-2.25-2.25V9.75" /></svg>;
const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H6.75A2.25 2.25 0 004.5 13.5V21M6.75 21v-7.5A2.25 2.25 0 019 11.25h2.25M6.75 21h7.5m0-13.5h.008v.008h-.008v-.008zm0 0H2.25m11.25 0h3.75A2.25 2.25 0 0119.5 9.75v7.5A2.25 2.25 0 0117.25 19.5h-3.75m0-13.5V2.25A2.25 2.25 0 0013.5 0H6.75A2.25 2.25 0 004.5 2.25v5.25m10.5 0v3M15 7.5H9V3.75" /></svg>;
const RatingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345h5.518a.562.562 0 01.329.959l-4.455 3.242a.563.563 0 00-.182.633l2.125 5.11a.563.563 0 01-.812.622l-4.455-3.242a.563.563 0 00-.652 0l-4.455 3.242a.562.562 0 01-.812-.622l2.125-5.111a.563.563 0 00-.182-.633L2.844 9.91a.562.562 0 01.329-.959h5.518a.562.562 0 00.475-.345L11.48 3.5z" /></svg>;


const AdminDashboardPage = () => {
  // Fix: Type data state according to fetchAdminDashboardData return type.
  const [data, setData] = useState<{ totalUsers: number; totalStores: number; totalRatings: number; } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchAdminDashboardData();
        setData(result);
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!data) return <p className="text-center">No data available.</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Administrator Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={data.totalUsers} linkTo="/admin/users" icon={<UsersIcon />} bgColorClass="bg-blue-500" />
        <StatCard title="Total Stores" value={data.totalStores} linkTo="/admin/stores" icon={<StoreIcon />} bgColorClass="bg-green-500" />
        {/* Fix: linkTo is now optional for StatCard, so this is valid. */}
        <StatCard title="Total Ratings Submitted" value={data.totalRatings} icon={<RatingIcon />} bgColorClass="bg-yellow-500" />
      </div>

      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/users/add" className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150">
            Add New User
          </Link>
          <Link to="/admin/stores/add" className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150">
            Add New Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;