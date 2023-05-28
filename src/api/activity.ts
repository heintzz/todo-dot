import axios from 'axios';

const activityEndpoint = process.env.ACTIVITY_ENDPOINT!;

interface changeTitleType {
  id: number;
  newTitle: string;
}

export const getAllActivities = async () => {
  try {
    const res = await axios.get(activityEndpoint);
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const getActivityDetail = async (id: number) => {
  try {
    const res = await axios.get(activityEndpoint + `/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const sendNewActivity = async () => {
  try {
    const res = await axios.post(activityEndpoint, {
      title: 'New Activity',
      email: 'uhuy@gmail.com',
    });
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const removeActivity = async (id: number) => {
  try {
    const res = await axios.delete(activityEndpoint + `/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};

export const changeActivityName = async (titleObj: changeTitleType) => {
  try {
    const res = await axios.patch(activityEndpoint + `/${titleObj.id}`, {
      title: titleObj.newTitle,
    });
    return res;
  } catch (error) {
    return error;
  }
};
