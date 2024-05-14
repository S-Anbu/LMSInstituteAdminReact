// groupService.js
import axios from 'axios';

const COURSE_END_POINT = `${process.env.REACT_APP_PUBLIC_API_URL}/api/institutes/admin/course-management/institute-courses`;
import { HTTP_END_POINTS } from 'api/urls';
import client from 'api/client';

export const getAllCoursesByBranch = async (data) => {
  try {
    const response = await axios.get(`${HTTP_END_POINTS.course.get}${data.id}/courses`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${localStorage.getItem('token')}`
      },
    });
    console.log('getAllCourses', response);
    // Check if the response status is successful
    if (response.data.status) {
      return response;
    } else {
      // If the response status is not successful, throw an error
      throw new Error(`Failed to fetch Courses. Status: ${response.status}`);
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in getAllCourseCategories:', error);

    // Throw the error again to propagate it to the calling function/component
    throw error;
  }
};
export const updateCourseStatus = async (data) => {
  try {
    const response = await axios.put(`${HTTP_END_POINTS.course.update}${data.category}/courses/${data.id}`, {is_active:data.is_active}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${localStorage.getItem('token')}`
      }
    });

    console.log(response);
    if (response.data.status) {
      return { success: true, message: 'Course updated successfully' };
    } else {
      return { success: false, message: 'Failed to update Course' };
    }
  } catch (error) {
    console.error('Error in updateCourse:', error);
    throw error;
  }
};
export const getCourseDetails = async (data) => {
  try {
    console.log(data,"data")
    const response = await axios.get(`${HTTP_END_POINTS.course.update}${data.category}/courses/${data.id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${localStorage.getItem('token')}`
      },
    });
    console.log(response);
    // Check if the response status is successful
    if (response.data.status) {
      return response;
    } else {
      // If the response status is not successful, throw an error
      throw new Error(`Failed to fetch Courses. Status: ${response.status}`);
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in getAllCourseCategories:', error);

    // Throw the error again to propagate it to the calling function/component
    throw error;
  }
};
export const getAllCourses = async (data) => {
  try {
    console.log(process.env.REACT_APP_PUBLIC_API_URL)
    const response = await axios.get(`${process.env.REACT_APP_PUBLIC_API_URL}api/institutes/1450d694-350b-4d78-90e9-ae2bc21f8677/branches/ca7cb92c-7a64-4178-9694-27a3150c12ba/courses`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer Token ${localStorage.getItem('token')}`
      },
      params: data
    });
    console.log(response);
    // Check if the response status is successful
    if (response.data.status) {
      return { data: response.data.data };
    } else {
      // If the response status is not successful, throw an error
      throw new Error(`Failed to fetch ActiveCourses. Status: ${response.status}`);
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in getAllActu=iveCourse:', error);

    // Throw the error again to propagate it to the calling function/component
    throw error;
  }
};
export const addCourse = async (data) => {
  try {
    // const response = await axios.post(`${COURSE_END_POINT}/create`, data, {
    //   headers: {
    //     // 'Content-Type': 'application/json',
    //     Authorization: `Bearer ${localStorage.getItem('token')}`
    //   }
    // });
    const response = await client.course.create(data)
    console.log(response);

    if (response.status) {
      return { success: true, message: 'Course created successfully' };
    } else {
      return { success: false, message: 'Failed to create Course' };
    }
  } catch (error) {
    console.error('Error in addCourse:', error);
    throw error;
  }
};
export const getStudentByCourse = async (data) => {
  try {
    console.log(data,"data")
    const response = await client.users.getStudentsWithCourse(data)

    console.log(response);

    if (response.status) {
      return response;
    } else {
      return { success: false, message: 'Failed to Fetch Active student' };
    }
  } catch (error) {
    console.error('Error in Fetch Active student:', error);
    throw error;
  }
};
export const deleteCourse = async (data) => {
  try {
    const response = await client.course.delete(data)
    console.log(response);
    return { success: true, message: 'Course deleted successfully' }; 
  } catch (error) {
    return { success: false, message: 'Failed to delete Course' };
  }
};
export const updateCourse = async (data) => {
  try {
    const response = await client.course.update(data)

    console.log(response);
   
    return { success: true, message: 'Course updated successfully' };
  } catch (error) {
    console.error('Error in updateCourse:', error);
    return { success: false, message: 'Failed to update Course' };
  }
};
