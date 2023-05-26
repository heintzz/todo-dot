import React, { useContext } from 'react';
import WarningDelete from '../assets/svgs/warning_delete.svg';
import Image from 'next/image';
import Button from './Button';
import { ModalContext } from './context/ModalContext';
import { Activity } from '@/pages';

interface ModalType {
  type: string;
  deleteActivity: (id: number | undefined) => void;
  activity: Activity | null;
}

const Modal: React.FC<ModalType> = ({ type, deleteActivity, activity }) => {
  const inActivity = type === 'activity';
  const modalContext = useContext(ModalContext);
  const { closeModal } = modalContext!;

  const deleteCorrespondingActivity = () => {
    closeModal();
    deleteActivity(activity?.id);
  };

  const deleteCorrespondingItem = () => {
    closeModal();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full grid place-content-center p-5 bg-gray-500/75" onClick={closeModal}>
      <div className="flex flex-col items-center gap-y-5 max-w-[490px] min-h-[255px] p-10 bg-white rounded-xl" onClick={(e) => e.stopPropagation()}>
        <Image src={WarningDelete} alt="warning delete icon" />
        <p className="max-w-[373px] text-center">
          Apakah anda yakin menghapus {inActivity ? 'activity' : 'list item'} <b>“{activity?.title}”?</b>
        </p>
        <div className="flex gap-x-5 mt-2">
          <Button cls="text-[#4A4A4A] bg-[#F4F4F4]" clickHandler={closeModal}>
            <span>Batal</span>
          </Button>
          <Button cls="text-white bg-[#ED4C5C]" clickHandler={inActivity ? deleteCorrespondingActivity : deleteCorrespondingItem}>
            <span>Hapus</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
