// courseNoteThunks.js
import { getAllCourseNotes as fetchAllCourseNotes } from '../services/noteServices'; // Replace with your service file
import { setCourseNotes, setLoading } from './noteSlice';

export const getAllCourseNotes = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fetchAllCourseNotes(); // Implement this function in your services
    dispatch(setCourseNotes(response?.data));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};
