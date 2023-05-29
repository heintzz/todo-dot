import { TodoItem } from '@/pages/detail/[id]';
import axios from 'axios';

const todoEndpoint = process.env.TODO_ENDPOINT!;

interface newTodoType {
  title: string;
  priority: string;
  activity_group_id: number;
}

interface editedTodoType {
  id: number;
  title: string;
  priority: string;
}

interface payloadCompletion {
  id: number;
  title: string;
  is_active: boolean;
}

export const addNewTodo = async (newTodo: newTodoType) => {
  try {
    const res = await axios.post(todoEndpoint, newTodo);
    return res;
  } catch (error) {
    return error;
  }
};

export const modifyTodo = async (editedTodo: editedTodoType) => {
  const { id, title, priority } = editedTodo;
  try {
    const res = await axios.patch(todoEndpoint + `/${id}`, { title, priority });
    return res;
  } catch (error) {
    return error;
  }
};

export const removeTodo = async (id: number) => {
  try {
    const res = await axios.delete(todoEndpoint + `/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};

export const editCompletionStatus = async (payload: payloadCompletion) => {
  const { id, title, is_active } = payload;
  try {
    const res = await axios.patch(todoEndpoint + `/${id}`, { title, is_active });
    return res;
  } catch (error) {
    return error;
  }
};
