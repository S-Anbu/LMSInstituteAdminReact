// groupService.js
import axios from 'axios';

const GROUP_API_ENDPOINT = `${process.env.REACT_APP_PUBLIC_API_URL}/api/platform/admin/user-management/role`;
const PERMISSION_API_ENDPOINT = `${process.env.REACT_APP_PUBLIC_API_URL}/api/platform/admin/user-management/permission`;
// const SEARCH_API_ENDPOINT = `${process.env.REACT_APP_PUBLIC_API_URL}/api/platform/admin/user-management/user/role-search`;

export const getAllGroups = async () => {
  try {
    const response = await axios.get('/data_storage/user-management/groups/AllGroups.json', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    // Check if the response status is successful
    if (response.status === 200) {
      return response;
    } else {
      // If the response status is not successful, throw an error
      throw new Error(`Failed to fetch groups. Status: ${response.status}`);
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in getAllGroups:', error);

    // Throw the error again to propagate it to the calling function/component
    throw error;
  }
};

export const searchGroups = async (searchQuery) => {
  try {
    const response = await axios.get('/data_storage/user-management/groups/AllGroups.json', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      params: { search: searchQuery }
    });

    if (response.data) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: 'Failed to fetch search results' };
    }
  } catch (error) {
    console.error('Error in searchGroups:', error);
    throw error;
  }
};

export const addGroup = async (groupName, selectedCheckbox) => {
  try {
    const data = {
      name: groupName,
      permissions: selectedCheckbox
    };

    const response = await axios.post(`${GROUP_API_ENDPOINT}/create`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.data.status) {
      return { success: true, message: 'Group created successfully' };
    } else {
      return { success: false, message: 'Failed to create group' };
    }
  } catch (error) {
    console.error('Error in addGroup:', error);
    throw error;
  }
};

export const deleteGroup = async (groupId) => {
  try {
    const response = await axios.delete(`${GROUP_API_ENDPOINT}/delete`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      params: { id: groupId }
    });

    if (response.data.status) {
      return { success: true, message: 'Group deleted successfully' };
    } else {
      return { success: false, message: 'Failed to delete group' };
    }
  } catch (error) {
    console.error('Error in deleteGroup:', error);
    throw error;
  }
};

export const updateGroup = async (groupId, groupName, selectedCheckbox) => {
  try {
    const data = {
      id: groupId,
      name: groupName,
      permission_id: selectedCheckbox
    };

    const response = await axios.put(`${GROUP_API_ENDPOINT}/update`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.data.status) {
      console.log(response);
      return { success: true, message: 'Group updated successfully' };
    } else {
      return { success: false, message: 'Failed to update group' };
    }
  } catch (error) {
    console.error('Error in updateGroup:', error);
    throw error;
  }
};

export const getAllPermissionsByRoleId = async (roleId) => {
  try {
    const response = await axios.get(`${PERMISSION_API_ENDPOINT}/permissions-by-role-id`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      params: { id: roleId }
    });

    if (response.data.data) {
      return { success: true, data: response.data.data };
    } else {
      return { success: false, message: 'Failed to fetch permissions' };
    }
  } catch (error) {
    console.error('Error in getAllPermissionsByRoleId:', error);
    throw error;
  }
};

export const getAllPermissions = async () => {
  try {
    const response = await axios.get(`/data_storage/user-management/permissions/AllPermissions.json`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.data) {
      return { success: true, data: response.data, permissionsCount: response.data?.length };
    } else {
      return { success: false, message: 'Failed to fetch permissions' };
    }
  } catch (error) {
    console.error('Error in getAllPermissions:', error);
    throw error;
  }
};

export const getPermissionsByRoleId = async (roleId) => {
  try {
    const response = await axios.get(`${PERMISSION_API_ENDPOINT}/permissions-by-role`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      params: { id: roleId }
    });

    if (response.data.data) {
      return { success: true, data: response.data.data };
    } else {
      return { success: false, message: 'Failed to fetch permissions by role ID' };
    }
  } catch (error) {
    console.error('Error in getPermissionsByRoleId:', error);
    throw error;
  }
};