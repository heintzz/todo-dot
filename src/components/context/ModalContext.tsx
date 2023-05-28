import React, { useState } from 'react';

interface ModalContextType {
  showDeleteModal: boolean;
  showAddModal: boolean;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  openAddModal: () => void;
  closeAddModal: () => void;
}

const ModalContext = React.createContext<ModalContextType | null>(null);

const ModalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showDeleteModal, setIsModalOpen] = useState(false);
  const [showAddModal, setIsAddModalOpen] = useState(false);

  const openDeleteModal = () => {
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const contextValue: ModalContextType = {
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    showAddModal,
    openAddModal,
    closeAddModal,
  };

  return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>;
};

export { ModalContext, ModalContextProvider };
