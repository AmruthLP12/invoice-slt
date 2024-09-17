import React from "react";
import CustomModal from "./CustomModal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cardNumber: string | null;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  cardNumber,
}) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} onConfirm={onConfirm}>
      <h2 className="text-lg font-semibold mb-4 text-center">
        Are you sure you want to delete the invoice with card number{" "}
        <span className="font-bold text-red-600">{cardNumber}</span>?
      </h2>
      <p className="mb-6 text-center">This action cannot be undone.</p>
    </CustomModal>
  );
};

export default DeleteConfirmationModal;
