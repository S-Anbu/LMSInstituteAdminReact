// groupThunks.js
import { getAllTeachingStaffAttendances as fetchAllTeachingStaffAttendances } from '../services/teachingStaffAttendanceServices'; // Replace with your service file
import { setTeachingStaffAttendances, setLoading } from './teachingStaffAttendanceSlice';

export const getAllTeachingStaffAttendances = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fetchAllTeachingStaffAttendances(); // Implement this function in your services
    dispatch(setTeachingStaffAttendances(response?.data));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};
