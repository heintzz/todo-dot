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
