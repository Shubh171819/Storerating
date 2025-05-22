
import React from 'react';
import StarRatingDisplay from '../common/StarRatingDisplay.jsx';
import Button from '../common/Button.jsx';

const StoreCard = ({ store, onRateStore }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <img className="w-full h-48 object-cover" src={`https://picsum.photos/seed/${store.id}/400/200`} alt={store.name} />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{store.name}</h3>
        <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Address:</span> {store.address}</p>
        <div className="my-3">
          <p className="text-sm text-gray-600 mb-1">Overall Rating:</p>
          <StarRatingDisplay rating={store.overallRating} />
        </div>
        
        {store.userSubmittedRating !== undefined && (
          <div className="my-3 p-2 bg-primary-50 rounded-md">
            <p className="text-sm text-primary-700 mb-1">Your Rating:</p>
            <StarRatingDisplay rating={store.userSubmittedRating} />
          </div>
        )}

        <Button 
          onClick={() => onRateStore(store)} 
          variant={store.userSubmittedRating !== undefined ? "outline" : "primary"}
          fullWidth
          className="mt-4"
        >
          {store.userSubmittedRating !== undefined ? 'Modify Your Rating' : 'Submit Rating'}
        </Button>
      </div>
    </div>
  );
};

export default StoreCard;