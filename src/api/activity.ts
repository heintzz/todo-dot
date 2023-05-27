import axios from 'axios';

const activityEndpoint = process.env.ACTIVITY_ENDPOINT!;

export const getAllActivities = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(activityEndpoint);
      resolve(res.data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const sendNewActivity = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post(activityEndpoint, {
        title: 'New Activity',
        email: 'uhuy@gmail.com',
      });
      resolve(res.data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const removeActivity = (id: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.delete(activityEndpoint + `/${id}`);
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};
