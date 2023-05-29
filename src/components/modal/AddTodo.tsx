import React, { useContext, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoItem, colorPalette } from '@/pages/detail/[id]';
import { ModalContext } from '../context/ModalContext';
import { addNewTodo, modifyTodo } from '@/api/todo';

import Button from '../Button';
import CloseButton from '@/assets/svgs/close_button.svg';
import Dropdown from '@/assets/svgs/dropdown.svg';

const titleCase = (text: string) => {
  if (!text) return;
  return text
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

const kebabCase = (text: string) => {
  return text
    .split(' ')
    .map((w) => w.charAt(0).toLowerCase() + w.slice(1))
    .join('-');
};

const AddTodoModal: React.FC<{ todo: TodoItem | null }> = ({ todo }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const modalContext = useContext(ModalContext);
  const activity_group_id = parseInt(router.query.id as string);
  const { closeAddModal } = modalContext!;
  const { title, priority, id } = todo || {};

  const [input, setInput] = useState(title || '');
  const [inputPriority, setInputPriority] = useState(priority || '');
  const [extend, setExtend] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.value;
    setInput(value);
  };

  const changePriority = (e: React.MouseEvent, p: string) => {
    e.stopPropagation();
    setInputPriority(kebabCase(p));
    setExtend(false);
  };

  const createTodoMutation = useMutation({
    mutationFn: addNewTodo,
    onSettled: () => {
      queryClient.invalidateQueries(['todos', activity_group_id]);
      closeAddModal();
    },
  });

  const editTodoMutation = useMutation({
    mutationFn: modifyTodo,
    onSettled: () => {
      queryClient.invalidateQueries(['todos', activity_group_id]);
      closeAddModal();
    },
  });

  const addTodo = () => {
    const newTodo = {
      activity_group_id,
      priority: inputPriority === 'medium' ? 'normal' : inputPriority,
      title: input,
    };

    createTodoMutation.mutate(newTodo);
  };

  const editTodo = () => {
    const editedTodo = {
      id: id as number,
      priority: inputPriority === 'medium' ? 'normal' : inputPriority,
      title: input,
    };

    editTodoMutation.mutate(editedTodo);
  };

  return (
    <div className="fixed top-0 grid place-content-center w-full h-full bg-gray-500/75" onClick={closeAddModal}>
      <div className="flex flex-col md:w-[800px] min-h-[400px] bg-white rounded-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between pt-6 pb-5 px-7">
          <p className="font-semibold text-[1.125rem]">Tambah List Item</p>
          <Image src={CloseButton} alt="close button" className="hover:cursor-pointer" onClick={closeAddModal} />
        </div>
        <hr />
        <div className="flex flex-col py-6 px-7">
          <label htmlFor="nama_list" className="text-[.75rem] font-semibold mb-2">
            NAMA LIST ITEM
          </label>
          <input
            type="text"
            id="nama_list"
            placeholder="Tambahkan nama list item"
            value={input}
            onChange={handleChange}
            autoFocus
            className="outline outline-1 outline-bcGray focus:outline-[#16ABF8] text-black placeholder:text-[#A4A4A4] rounded-md p-4"
          />
          <label htmlFor="nama_list" className="text-[.75rem] font-semibold mt-6 mb-2">
            PRIORITY
          </label>
          <div
            className={`relative flex items-center gap-x-3 w-[205px] p-4 outline outline-1 outline-bcGray  ${extend ? 'bg-cancelWhite rounded-t-md' : 'rounded-md'}`}
            role="button"
            onClick={() => setExtend((prev) => !prev)}
          >
            <div className={`w-[9px] h-[9px] rounded-full ${colorPalette[inputPriority]}`}></div>
            <span>{titleCase(inputPriority) || 'Pilih prioritas'}</span>
            <Image src={Dropdown} alt="dropdown button" className={`ml-auto ${extend && 'rotate-180'}`} />
            {extend && (
              <div className="absolute w-full h-fit bg-white left-0 -bottom-[500%] rounded-b-md">
                {['Very High', 'High', 'Medium', 'Low', 'Very Low'].map((priority, i) => (
                  <div key={i} className={`flex items-center gap-x-3 p-4 outline outline-1 outline-bcGray ${i === 4 && 'rounded-b-md'}`} onClick={(e) => changePriority(e, priority)}>
                    <div className={`w-[9px] h-[9px] rounded-full ${colorPalette[kebabCase(priority)]}`}></div>
                    <div id="priority">{priority}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <hr />
        <div className="flex justify-end py-6 px-7">
          <Button variant="primary" clickHandler={todo ? editTodo : addTodo} isDisable={input?.length === 0 || inputPriority?.length === 0}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddTodoModal;
