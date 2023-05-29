import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { changeActivityName, getActivityDetail } from '@/api/activity';

// SVGs
import Button from '@/components/Button';
import AddList from '@/assets/svgs/add_activity.svg';
import EditTitle from '@/assets/svgs/edit_title.svg';
import BackButton from '@/assets/svgs/back_button.svg';
import EmptyTodo from '@/assets/svgs/empty_todo.svg';
import DeleteTodo from '@/assets/svgs/delete_activity.svg';
import SortTodo from '@/assets/svgs/sort_button.svg';
import SortLatest from '@/assets/svgs/sort_latest.svg';
import SortOldest from '@/assets/svgs/sort_oldest.svg';
import SortUnfinished from '@/assets/svgs/unfinished.svg';
import AlphaAsc from '@/assets/svgs/alpha_asc.svg';
import AlphaDesc from '@/assets/svgs/alpha_desc.svg';
import Checked from '@/assets/svgs/checked.svg';

import { ModalContext } from '@/components/context/ModalContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AddTodoModal from '@/components/modal/AddTodo';
import DeleteModal from '@/components/modal/Delete';
import { editCompletionStatus, removeTodo } from '@/api/todo';

interface ActivityListType {
  id: number;
  title: string;
  created_at: number;
  todo_items: TodoItem[];
  priority: string;
}

export interface TodoItem {
  id: number;
  title: string;
  activity_group_id: number;
  is_active: number;
  priority: string;
}

interface DetailProps {
  activity: ActivityListType;
}

type queryType = { id: string };

export const colorPalette: { [key: string]: string } = {
  'very-high': 'bg-[#ED4C5C]',
  high: 'bg-[#FFCE31]',
  normal: 'bg-[#00A790]',
  medium: 'bg-[#00A790]',
  low: 'bg-[#428BC1]',
  'very-low': 'bg-[#8942C1]',
};

const sortSVG = [SortLatest, SortOldest, AlphaDesc, AlphaAsc, SortUnfinished];

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const query = context.params as queryType;
  const id = parseInt(query.id);
  const activity = await getActivityDetail(id);

  return { props: { activity } };
};

const Detail: NextPage<DetailProps> = ({ activity }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const activityId = parseInt(router.query.id as string);
  const modalContext = useContext(ModalContext);
  const { showDeleteModal, openDeleteModal, closeDeleteModal, openAddModal, showAddModal } = modalContext!;

  const [isEdit, setIsEdit] = useState(false);
  const [input, setInput] = useState(activity.title);
  const [activeTodo, setActiveTodo] = useState<TodoItem | null>(null);
  const [filter, setFilter] = useState({ onShow: false, variant: 'Terbaru' });

  const query = useQuery({
    queryKey: ['todos', activityId],
    queryFn: () => getActivityDetail(activityId),
    initialData: activity,
  });

  const { todo_items } = query.data;

  const editTitleMutation = useMutation({
    mutationFn: changeActivityName,
  });

  const deleteTodoMutation = useMutation({
    mutationFn: removeTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', activityId]);
      closeDeleteModal();
    },
  });

  const editCompleteMutation = useMutation({
    mutationFn: editCompletionStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', activityId]);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.value;
    setInput(value);
  };

  const activateInputField = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEdit(true);
  };

  const deactivateInputField = (e: React.MouseEvent) => {
    const newTitle = input;
    setInput(newTitle);
    setIsEdit(false);
    editTitleMutation.mutate({ id: activityId, newTitle });
  };

  const deleteTodo = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  const deleteTodoConfirmation = (e: React.MouseEvent, todo: TodoItem) => {
    e.stopPropagation();
    openDeleteModal();
    setActiveTodo(todo);
  };

  const addTodoPopup = (todo?: TodoItem) => {
    openAddModal();
    if (todo?.id) setActiveTodo(todo);
    else setActiveTodo(null);
  };

  const changeCompleteStatus = (e: React.ChangeEvent<HTMLInputElement>, id: number, title: string) => {
    const is_active = e.target.checked;
    const body = {
      id,
      title,
      is_active,
    };
    editCompleteMutation.mutate(body);
  };

  const handleFilterChange = (filter?: string) => {
    if (!filter) {
      setFilter((prev) => {
        return { ...prev, onShow: !prev.onShow };
      });
    } else {
      setFilter((prev) => {
        return { ...prev, onShow: !prev.onShow, variant: filter };
      });
    }
  };

  return (
    <div className="flex justify-center px-4 sm:px-8 pb-8" onClick={deactivateInputField}>
      <div className="w-[1000px]">
        <div className="flex justify-between items-center my-10">
          <div className="flex items-center sm:gap-x-2">
            <Image src={BackButton} alt="back button button" className="hover:cursor-pointer" onClick={() => router.push('/')} />
            <div className="font-bold text-[1.25rem] sm:text-[1.5rem] md:text-[2.25rem] pr-1 sm:pr-2" onClick={activateInputField}>
              {isEdit ? (
                <input
                  type="text"
                  className="bg-transparent max-w-[100px] sm:max-w-[400px] lg:max-w-[500px] focus:ring-0 focus:outline-none w-fit border-b-2 border-black/70"
                  value={input}
                  onChange={handleChange}
                />
              ) : (
                <h1>{input}</h1>
              )}
            </div>
            <Image src={EditTitle} alt="edit title button" onClick={activateInputField} />
          </div>

          <div className="flex relative items-center gap-x-1">
            <Image src={SortTodo} alt="sort todo button" role="button" onClick={() => handleFilterChange()} />
            <Button variant="primary" clickHandler={() => addTodoPopup()}>
              <Image src={AddList} alt="add activity icon" />
              <span>Tambah</span>
            </Button>
            {filter.onShow && (
              <div className="w-full absolute -bottom-[250px] bg-white rounded-md" role="button">
                {['Terbaru', 'Terlama', 'A-Z', 'Z-A', 'Belum Selesai'].map((n, i) => (
                  <div
                    key={i}
                    className={`px-4 py-3 flex gap-x-4 border border-bcGray ${i === 0 ? 'rounded-t-md' : i === 4 && 'rounded-b-md'}`}
                    onClick={() => handleFilterChange()}
                  >
                    <Image src={sortSVG[i]} alt={n} className="w-[15px]" />
                    <p>{n}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-y-3">
          {todo_items.length > 0 ? (
            todo_items.map((todo: any) => {
              const { id, title, priority, is_active } = todo;
              const isActive = is_active === 1 ? true : false;
              return (
                <div key={id} className="flex items-center jutify-between w-full p-7 bg-white rounded-xl shadow-md">
                  <div className="flex gap-x-3 items-center">
                    <label htmlFor={`ceklis-${id}`} className="relative cursor-pointer w-4 h-4 z-40">
                      <input
                        type="checkbox"
                        id={`ceklis-${id}`}
                        className="appearance-none cursor-pointer outline outline-1 outline-[#C7C7C7] w-4 h-4"
                        checked={isActive}
                        onChange={(e) => changeCompleteStatus(e, id, title)}
                      />
                      {!is_active ? (
                        <Image
                          src={Checked}
                          alt="checked icon"
                          className="absolute outline outline-1 outline-primary bg-primary w-4 h-[17px] top-[1px]"
                        />
                      ) : (
                        ''
                      )}
                    </label>
                    <div className={`w-[9px] h-[9px] rounded-full ${colorPalette[priority]}`}></div>
                    <p className={`${!isActive && 'line-through'}`}>{title}</p>
                    <Image src={EditTitle} alt="edit title button" className="hover:cursor-pointer" onClick={() => addTodoPopup(todo)} />
                  </div>
                  <Image
                    src={DeleteTodo}
                    alt="delete todo button"
                    className="hover:cursor-pointer ml-auto"
                    onClick={(e) => deleteTodoConfirmation(e, todo)}
                  />
                </div>
              );
            })
          ) : (
            <Image src={EmptyTodo} alt="empty todo icon" className="mx-auto hover:cursor-pointer" onClick={() => addTodoPopup()} />
          )}
        </div>
      </div>
      {showDeleteModal && <DeleteModal type="list" deleteFn={deleteTodo} item={activeTodo} />}
      {showAddModal && <AddTodoModal todo={activeTodo} />}
    </div>
  );
};

export default Detail;
