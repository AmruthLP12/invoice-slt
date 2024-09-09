import React from "react";
import { Button } from "./ui/button";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children?: React.ReactNode;
  cancelColor?: string;
  confirmColor?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  children,
  cancelColor = "bg-gray-300 text-black hover:bg-gray-400",
  confirmColor = "bg-red-500 text-white hover:bg-red-600",
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
        {children}
        <div className="mt-4 flex justify-end gap-4">
          <Button onClick={onClose} className={`px-4 py-2 rounded ${cancelColor}`}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className={`px-4 py-2 rounded ${confirmColor}`}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
