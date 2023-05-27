import React from 'react';
import Image from 'next/image';
import InfoIcon from '@/assets/svgs/modal_info.svg';

interface AlertProps {
  message: string;
  setShowAlert: () => void;
}

const Alert: React.FC<AlertProps> = ({ message: alertMessage, setShowAlert }) => {
  const preventBubbling = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full grid place-content-center bg-gray-500/75" onClick={setShowAlert}>
      <div className="flex gap-x-2 px-5 py-3 w-[100%] sm:w-[490px] rounded-xl bg-white " onClick={preventBubbling}>
        <Image src={InfoIcon} alt="information icon" />
        <p>{alertMessage}</p>
      </div>
    </div>
  );
};

export default Alert;
