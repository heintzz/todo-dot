import React, { useContext, useEffect, useState } from 'react';
import { ModalContext } from '@/components/context/ModalContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllActivities, removeActivity, sendNewActivity } from '@/api/activity';
import getDate from '@/helpers/getDate';

import Image from 'next/image';
import Button from '@/components/Button';
import DeleteModal from '@/components/modal/Delete';
import AddActivity from '@/assets/svgs/add_activity.svg';
import DeleteActivity from '@/assets/svgs/delete_activity.svg';
import EmptyActivity from '@/assets/svgs/empty_activity.svg';
import Alert from '@/components/Alert';
import { useRouter } from 'next/router';

export interface Activity {
  id: number;
  title: string;
  created_at: Date;
}

interface HomeProps {
  activities: Activity[];
}

export const getServerSideProps = async () => {
  let activities = await getAllActivities();
  return { props: { activities } };
};

const Home: React.FC<HomeProps> = ({ activities }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const modalContext = useContext(ModalContext);
  const { showDeleteModal, openDeleteModal } = modalContext!;
  const [showAlert, setShowAlert] = useState(false);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);

  const query = useQuery({
    queryKey: ['activities'],
    queryFn: getAllActivities,
    initialData: activities,
  });

  activities = query.data;

  const createActivityMutation = useMutation({
    mutationFn: sendNewActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });

  const deleteActivity = async (id: number) => {
    try {
      const res = await removeActivity(id);
      queryClient.setQueryData<Activity[]>(['activities'], (prev) => (prev ? prev.filter((activity) => activity.id !== id) : prev));
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteActivityConfirmation = (e: React.MouseEvent, activity: Activity) => {
    e.stopPropagation();
    openDeleteModal();
    setActiveActivity(activity);
  };

  return (
    <div className="flex justify-center px-4 sm:px-8">
      <div className="w-[1000px]">
        <div className="flex justify-between items-center my-10">
          <h1 className="font-bold text-[1.5rem] md:text-[2.25rem]">Activity</h1>
          <Button clickHandler={createActivityMutation.mutate}>
            <Image src={AddActivity} alt="add activity icon" />
            <span>Tambah</span>
          </Button>
        </div>
        {activities.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-8">
            {activities.map((activity: Activity) => {
              const { id, title, created_at } = activity;
              return (
                <div
                  key={id}
                  className="flex flex-col justify-between w-[100%] min-w-[200px] md:min-w-[230px] min-h-[235px] rounded-xl bg-white p-6 shadow-[0_6px_10px_0px_rgba(0,0,0,0.1)] hover:cursor-pointer"
                  onClick={() => router.push(`/detail/${id}`)}
                >
                  <p className="font-bold text-[1.125rem] break-words">{title}</p>
                  <div className="flex justify-between">
                    <span className="font-light text-[#888888] text-[.875rem] hover:cursor-text">{getDate(created_at)}</span>
                    <Image
                      src={DeleteActivity}
                      alt="delete activity icon"
                      className="hover:cursor-pointer"
                      onClick={(e) => deleteActivityConfirmation(e, activity)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Image src={EmptyActivity} alt="no activity" className="hover:cursor-pointer" onClick={() => createActivityMutation.mutate()} />
        )}
        {showAlert && <Alert message="Activity berhasil dihapus" setShowAlert={() => setShowAlert(false)} />}
        {showDeleteModal && <DeleteModal type="activity" deleteFn={deleteActivity} item={activeActivity} />}
      </div>
    </div>
  );
};

export default Home;
