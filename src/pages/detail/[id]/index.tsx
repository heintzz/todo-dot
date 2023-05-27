import React, { useContext, useState } from 'react';
import Image from 'next/image';
import { getAnActivity } from '@/api/activity';
import { GetServerSidePropsContext, NextPage } from 'next';
import Button from '@/components/Button';
import AddList from '@/assets/svgs/add_activity.svg';
import EditTitle from '@/assets/svgs/edit_title.svg';
import BackButton from '@/assets/svgs/back_button.svg';
import EmptyTodo from '@/assets/svgs/empty_todo.svg';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ModalContext } from '@/components/context/ModalContext';
import Modal from '@/components/Modal';
import { useQuery } from '@tanstack/react-query';

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

const colorPalette: { [key: string]: string } = {
  'very-high': 'bg-[#ED4C5C]',
  high: 'bg-[#FFCE31]',
  medium: 'bg-[#00A790]',
  low: 'bg-[#00A790]',
  'very-low': 'bg-[#00A790]',
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const query = context.params as queryType;
  const id = parseInt(query.id);
  const activity = await getAnActivity(id);

  return { props: { activity } };
};

const Detail: NextPage<DetailProps> = ({ activity }) => {
  const router = useRouter();
  const modalContext = useContext(ModalContext);
  const { isModalOpen, openModal, closeModal } = modalContext!;
  const { title, id, todo_items } = activity;
  const [isEdit, setIsEdit] = useState(false);
  const [input, setInput] = useState(title);
  const [activeTodo, setActiveTodo] = useState<TodoItem | null>(null);

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
    const newInput = input;
    const saveNewTitle = async () => {
      try {
        const res = await axios.patch(process.env.ACTIVITY_ENDPOINT + `/${id}`, {
          title: newInput,
        });
      } catch (error) {
        console.log(error);
      }
    };
    setInput(newInput);
    setIsEdit(false);
    saveNewTitle();
  };

  const deleteTodo = async (id: number) => {};

  const deleteTodoConfirmation = (e: React.MouseEvent, todo: TodoItem) => {
    e.stopPropagation();
    openModal();
    setActiveTodo(todo);
  };

  return (
    <div className="flex justify-center px-4 sm:px-8" onClick={deactivateInputField}>
      <div className="w-[1000px]">
        <div className="flex justify-between items-center my-10">
          <div className="flex items-center sm:gap-x-2">
            <Image src={BackButton} alt="back button button" className="hover:cursor-pointer" onClick={() => router.push('/')} />
            <div className="font-bold sm:text-[1.5rem] md:text-[2.25rem] pr-1 sm:pr-2" onClick={activateInputField}>
              {isEdit ? (
                <input
                  type="text"
                  className="bg-transparent max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] focus:ring-0 focus:outline-none w-fit border-b-2 border-black/70"
                  value={input}
                  onChange={handleChange}
                />
              ) : (
                <h1>{input}</h1>
              )}
            </div>
            <Image src={EditTitle} alt="edit title button" onClick={activateInputField} />
          </div>
          <Button cls="bg-[#16ABF8] text-white" clickHandler={function () {}}>
            <Image src={AddList} alt="add activity icon" />
            <span>Tambah</span>
          </Button>
        </div>
        <div className="flex flex-col gap-y-3">
          {todo_items.length > 0 ? (
            todo_items.map((todo) => {
              const { id, title, priority, is_active } = todo;
              return (
                <div key={id} className="flex items-center gap-x-3 w-full p-7 bg-white rounded-xl shadow-md">
                  <input type="checkbox" className="appearance-none cursor-pointer outline outline-1 outline-[#C7C7C7] w-4 h-4" />
                  <div className={`w-[9px] h-[9px] rounded-full ${colorPalette[priority]}`}></div>
                  <p>{title}</p>
                  <button onClick={(e) => deleteTodoConfirmation(e, todo)}>hi</button>
                </div>
              );
            })
          ) : (
            <Image src={EmptyTodo} alt="empty todo icon" className="mx-auto hover:cursor-pointer" />
          )}
        </div>
      </div>
      {isModalOpen && <Modal type="list" deleteFn={deleteTodo} item={activeTodo} />}
    </div>
  );
};

export default Detail;
