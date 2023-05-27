import React, { useContext, useEffect, useState } from 'react';
import { ModalContext } from '@/components/context/ModalContext';
import Image from 'next/image';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import AddActivity from '@/assets/svgs/add_activity.svg';
import DeleteActivity from '@/assets/svgs/delete_activity.svg';
import EmptyActivity from '@/assets/svgs/empty_activity.svg';
import getDate from '@/helpers/getDate';
import Alert from '@/components/Alert';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllActivities, removeActivity } from '@/api/activity';
import axios from 'axios';

export interface Activity {
  id: number;
  title: string;
  created_at: Date;
}

interface HomeProps {
  activities: Activity[];
}

export const getStaticProps = async () => {
  const activities = await getAllActivities();
  return { props: { activities }, revalidate: 60 };
};

const Home: React.FC<HomeProps> = (props) => {
  const queryClient = useQueryClient();
  const modalContext = useContext(ModalContext);
  const { isModalOpen, openModal } = modalContext!;
  const [showAlert, setShowAlert] = useState(false);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);

  const { data: activities } = useQuery({
    queryKey: ['activities'],
    queryFn: getAllActivities,
    initialData: props.activities,
  });

  const addActivity = async () => {
    const newActivity = {
      title: 'New Activity',
      email: 'mantapgan@gmail.com',
    };

    try {
      await axios.post('https://todo.api.devcode.gethired.id/activity-groups', newActivity);
      queryClient.refetchQueries(['activities']);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteActivity = async (id: number) => {
    try {
      await removeActivity(id);

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      queryClient.setQueryData<Activity[]>(['activities'], (prevActivities = []) => prevActivities?.filter((activity) => activity.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteActivityConfirmation = (activity: Activity) => {
    openModal();
    setActiveActivity(activity);
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
              const { id, title, created_at } = activity;
              return (
                <div key={id} className="flex flex-col justify-between w-[100%] md:min-w-[230px] min-h-[235px] rounded-xl bg-white p-6">
                  <p className="font-bold text-[1.125rem] break-words">{title}</p>
                  <div className="flex justify-between">
                    <span className="font-light text-[#888888] text-[.875rem]">{getDate(created_at)}</span>
                    <Image src={DeleteActivity} alt="delete activity icon" onClick={() => deleteActivityConfirmation(activity)} className="hover:cursor-pointer" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Image src={EmptyActivity} alt="no activity" onClick={addActivity} />
        )}
        {showAlert && <Alert message="Activity berhasil dihapus" setShowAlert={() => setShowAlert(false)} />}
        {isModalOpen && <Modal type="activity" deleteActivity={deleteActivity} activity={activeActivity} />}
      </div>
    </div>
  );
};

export default Home;
