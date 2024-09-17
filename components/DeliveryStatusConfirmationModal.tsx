import React from "react";
import CustomModal from "./CustomModal";

interface DeliveryStatusConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deliveryStatus: boolean | null;
  cardNumber: string | null;
}

const DeliveryStatusConfirmationModal: React.FC<DeliveryStatusConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  deliveryStatus,
  cardNumber,
}) => {

  const statusStyle = deliveryStatus
  ? "text-blue-500 font-bold" 
  : "text-green-500 font-bold";

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmColor={
        deliveryStatus
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-green-500 text-white hover:bg-green-600"
      }
    >
      <h2 className="text-lg font-semibold mb-4 text-center">
        Are you sure you want to mark the invoice with card number{" "}
        <span className={`${statusStyle}`}>{cardNumber}</span> as{" "}
        {deliveryStatus ? "Delivered" : "Undelivered"}?
      </h2>
      <p className="mb-6 text-center">Please confirm your action.</p>
    </CustomModal>
  );
};

export default DeliveryStatusConfirmationModal;
