
import React from 'react';

// Fix: Define ModalProps interface and make footer optional.
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode; // Make footer optional
}

const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:opacity-100"
            aria-label="Close modal"
          >
            <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
          </button>
        </div>
        <div className="relative p-6 flex-auto">{children}</div>
        {footer && (
          <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;