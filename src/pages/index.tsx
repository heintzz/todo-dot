import React, { useContext, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { ModalContext } from '@/components/context/ModalContext';
import AddActivity from '@/assets/svgs/add_activity.svg';
import DeleteActivity from '@/assets/svgs/delete_activity.svg';
import EmptyActivity from '@/assets/svgs/empty_activity.svg';
import getDate from '@/helpers/getDate';
import Alert from '@/components/Alert';

export interface Activity {
  id: number;
  title: string;
  itemList: Item[];
  createdDate: Date;
}

interface Item {
  id: number;
  title: string;
  is_active: isActiveType;
}

type isActiveType = true | false;

const Home: React.FC = () => {
  const modalContext = useContext(ModalContext);
  const { isModalOpen, openModal } = modalContext!;
  const [showAlert, setShowAlert] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);

  const addActivity = () => {
    const newActivity: Activity = {
      id: Date.now(),
      title: 'Daftar Belanja',
      itemList: [],
      createdDate: new Date(),
    };

    setActivities((prev: Activity[]) => [...prev, newActivity]);
  };

  const deleteActivity = (id: number | undefined): void => {
    if (id) {
      const filteredActivities = activities.filter((activity) => activity.id !== id);
      setActivities(filteredActivities);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const deleteActivityConfirmation = (act: Activity) => {
    openModal();
    setActiveActivity(act);
  };

  return (
    <div className="flex justify-center px-8">
      <div className="w-[1000px]">
        <div className="flex justify-between items-center my-10">
          <h1 className="font-bold text-[1.5rem] md:text-[2.25rem]">Activity</h1>
          <Button cls="bg-[#16ABF8] text-white" clickHandler={addActivity}>
            <Image src={AddActivity} alt="add activity icon" />
            <span>Tambah</span>
          </Button>
        </div>
        {activities.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-8">
            {activities.map((activity) => {
              const { id, title, createdDate } = activity;
              return (
                <div key={id} className="flex flex-col justify-between w-[100%] md:min-w-[230px] min-h-[235px] rounded-xl bg-white p-6">
                  <p className="font-bold text-[1.125rem]">{title}</p>
                  <div className="flex justify-between">
                    <span className="font-light text-[#888888] text-[.875rem]">{getDate(createdDate)}</span>
                    <Image src={DeleteActivity} alt="delete activity icon" onClick={() => deleteActivityConfirmation(activity)} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Image src={EmptyActivity} alt="no activity" onClick={addActivity} />
        )}
        {showAlert && <Alert msg="Activity berhasil dihapus" />}
        {isModalOpen && <Modal type="activity" deleteActivity={deleteActivity} activity={activeActivity} />}
      </div>
    </div>
  );
};

export default Home;
