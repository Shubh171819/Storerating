
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import StarRatingInput from '../common/StarRatingInput.jsx';
import { validateRating } from '../../utils/validation.js';

const RateStoreModal = ({ isOpen, onClose, store, onSubmitRating }: { isOpen: boolean, onClose: () => void, store: any, onSubmitRating: (storeId: string, rating: number) => Promise<any>}) => {
  const [currentRating, setCurrentRating] = useState(0);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (store) {
      setCurrentRating(store.userSubmittedRating || 0);
    } else {
      setCurrentRating(0);
    }
    setError(undefined); // Reset error when modal opens or store changes
  }, [store, isOpen]);

  if (!store) return null;

  const handleRatingChange = (rating: number) => {
    setCurrentRating(rating);
    setError(validateRating(rating));
  };

  const handleSubmit = async () => {
    const validationError = validateRating(currentRating);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (currentRating === 0) { // Ensure a rating is selected
        setError("Please select a rating from 1 to 5 stars.");
        return;
    }

    setIsLoading(true);
    setError(undefined);
    try {
      const result = await onSubmitRating(store.id, currentRating);
      if (result) {
        onClose(); // Close modal on successful submission
      } else {
        setError("Failed to submit rating. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fix: Modal component's `footer` prop is optional. Buttons are passed as children or part of main content.
  // For this structure, buttons are part of the children.
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Rate ${store.name}`}>
      <>
        <div className="space-y-4">
          <p className="text-gray-700">Select your rating for {store.name}:</p>
          <div className="flex justify-center">
              <StarRatingInput currentRating={currentRating} onRatingChange={handleRatingChange} />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          {/* Fix: Optional props for Button are handled by its definition. */}
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
          {/* Fix: Optional props for Button are handled by its definition. */}
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading} disabled={currentRating === 0 || !!error}>
            Submit Rating
          </Button>
        </div>
      </>
    </Modal>
  );
};

export default RateStoreModal;