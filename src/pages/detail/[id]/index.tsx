import axios from 'axios';
import React, { useContext, useState } from 'react';
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

import { ModalContext } from '@/components/context/ModalContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AddTodoModal from '@/components/modal/AddTodo';
import DeleteModal from '@/components/modal/Delete';
import { removeTodo } from '@/api/todo';

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

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const query = context.params as queryType;
  const id = parseInt(query.id);
  const activity = await getActivityDetail(id);

  return { props: { activity } };
};

const Detail: NextPage<DetailProps> = ({ activity }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const modalContext = useContext(ModalContext);
  const { showDeleteModal, openDeleteModal, closeDeleteModal, openAddModal, showAddModal } = modalContext!;

  const { title, id, todo_items } = activity;
  const activityId = parseInt(router.query.id as string);

  const [isEdit, setIsEdit] = useState(false);
  const [input, setInput] = useState(title);
  const [activeTodo, setActiveTodo] = useState<TodoItem | null>(null);

  const query = useQuery({
    queryKey: ['todos', activityId],
    queryFn: () => getActivityDetail(activityId),
    initialData: activity,
  });

  activity = query.data;

  const editTitleMutation = useMutation({
    mutationFn: changeActivityName,
  });

  const deleteTodoMutation = useMutation({
    mutationFn: removeTodo,
    onMutate: () => {
      queryClient.invalidateQueries(['todos', activityId]);
      closeDeleteModal();
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
    editTitleMutation.mutate({ id, newTitle });
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
          <Button variant="primary" clickHandler={() => addTodoPopup()}>
            <Image src={AddList} alt="add activity icon" />
            <span>Tambah</span>
          </Button>
        </div>
        <div className="flex flex-col gap-y-3">
          {todo_items.length > 0 ? (
            todo_items.map((todo) => {
              const { id, title, priority, is_active } = todo;
              return (
                <div key={id} className="flex items-center jutify-between w-full p-7 bg-white rounded-xl shadow-md">
                  <div className="flex gap-x-3 items-center">
                    <input type="checkbox" className="appearance-none cursor-pointer outline outline-1 outline-[#C7C7C7] w-4 h-4" />
                    <div className={`w-[9px] h-[9px] rounded-full ${colorPalette[priority]}`}></div>
                    <p className={`${is_active !== 1 && 'line-through'}`}>{title}</p>
                    <Image src={EditTitle} alt="edit title button" className="hover:cursor-pointer" onClick={() => addTodoPopup(todo)} />
                  </div>
                  <Image src={DeleteTodo} alt="delete todo button" className="hover:cursor-pointer ml-auto" onClick={(e) => deleteTodoConfirmation(e, todo)} />
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
