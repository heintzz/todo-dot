import React, { useContext } from 'react';
import WarningDelete from '@/assets/svgs/warning_delete.svg';
import Image from 'next/image';
import Button from '../Button';
import { ModalContext } from '../context/ModalContext';
import { Activity } from '@/pages';
import { TodoItem } from '@/pages/detail/[id]';

interface IModalType {
  type: 'activity' | 'list';
  deleteFn: (id: number) => void;
}

interface ActivityType extends IModalType {
  item: Activity | null;
}

interface TodoType extends IModalType {
  item: TodoItem | null;
}

type ModalProps = ActivityType | TodoType;

const DeleteModal: React.FC<ModalProps> = ({ type, deleteFn, item }) => {
  const inActivity = type === 'activity';
  const modalContext = useContext(ModalContext);
  const { closeDeleteModal } = modalContext!;

  const deleteCorrespondingActivity = () => {
    closeDeleteModal();
    deleteFn(item?.id || 0);
  };

  const deleteCorrespondingTodo = () => {
    closeDeleteModal();
    deleteFn(item?.id || 0);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full grid place-content-center p-5 bg-gray-500/75" onClick={closeDeleteModal}>
      <div className="flex flex-col items-center gap-y-5 max-w-[490px] min-h-[255px] p-10 bg-white rounded-xl" onClick={(e) => e.stopPropagation()}>
        <Image src={WarningDelete} alt="warning delete icon" />
        <p className="max-w-[373px] text-center">
          Apakah anda yakin menghapus {type}
          <br></br>
          <b className="break-words">“{item?.title}”?</b>
        </p>
        <div className="flex gap-x-5 mt-2">
          <Button variant="cancel" clickHandler={closeDeleteModal}>
            <span>Batal</span>
          </Button>
          <Button variant="delete" clickHandler={inActivity ? deleteCorrespondingActivity : deleteCorrespondingTodo}>
            <span>Hapus</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
