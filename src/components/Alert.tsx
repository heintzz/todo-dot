import React from 'react';
import Image from 'next/image';
import InfoIcon from '@/assets/svgs/modal_info.svg';

const Alert: React.FC<{ msg: string }> = ({ msg }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full grid place-content-center bg-gray-500/75" onClick={() => setShowAlert(false)}>
      <div className="flex gap-x-2 px-5 py-2 w-[490px] rounded-xl bg-white " onClick={(e) => e.stopPropagation()}>
        <Image src={InfoIcon} alt="information icon" />
        <p>{msg}</p>
      </div>
    </div>
  );
};

export default Alert;
