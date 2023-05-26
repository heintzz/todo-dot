import React, { useState } from 'react';

interface ModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = React.createContext<ModalContextType | null>(null);

const ModalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const contextValue: ModalContextType = {
    isModalOpen,
    openModal,
    closeModal,
  };

  return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>;
};

export { ModalContext, ModalContextProvider };
