import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { updateUser } from 'features/user-management/users-page/services/userServices';
import { getAllGroups } from 'features/user-management/groups-page/services/groupService';
import { useInstitute } from 'utils/get-institute-details';
import { getImageUrl } from 'utils/imageUtils';
import { profilePlaceholder } from 'utils/placeholders';
import { useSpinner } from 'context/spinnerContext';
import client from 'api/client';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '1.8rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '50%',
  objectFit: 'cover',
  marginBottom: theme.spacing(2),
}));

const schema = yup.object().shape({
  full_name: yup.string().min(3, 'Full name must be at least 3 characters').required('Full name is required'),
  user_name: yup.string().min(3, 'User name must be at least 3 characters').required('User name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  contact: yup
    .string()
    .matches(/^\d{10}$/, 'Contact number must be exactly 10 digits')
    .required('Contact number is required'),
  designation: yup.string().required('Designation is required'),
  role: yup.string().required('Role is required'),
});

const UserEditDialog = ({ openEdit, handleEditClose, userData, setRefetch }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgSrc, setImgSrc] = useState(profilePlaceholder);
  const [groups, setGroups] = useState([]);
  const { show, hide } = useSpinner();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: '',
      user_name: '',
      email: '',
      contact: '',
      designation: '',
      role: '',
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (userData) {
      setValue('full_name', userData.name || '');
      setValue('user_name', userData.username || '');
      setValue('email', userData.email || '');
      setValue('contact', userData.phone_number || '');
      setValue('designation', userData.designation || '');
      setValue('role', userData.role?.id || '');
      setImgSrc(userData.image ? getImageUrl(userData.image) : profilePlaceholder);
    }
  }, [userData, setValue]);

  const getGroups = async () => {
    try {
      const result = await getAllGroups({ institute_id: useInstitute().getInstituteId() });
      if (result.success) setGroups(result.data);
      else toast.error(result.message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImgSrc(reader.result);
      reader.readAsDataURL(file);
      setSelectedImage(file);
    }
  };

  const onSubmit = async (data) => {
    show();
    const formData = new FormData();
    formData.append('name', data.full_name);
    formData.append('user_name', data.user_name);
    formData.append('email', data.email);
    formData.append('mobile', data.contact);
    formData.append('designation', data.designation);
    formData.append('role_id', data.role);
    if (selectedImage) formData.append('image', selectedImage);
    formData.append('id', userData.id);

    try {
      const result = await updateUser(formData);
      if (result.success) {
        toast.success(result.message);
        setRefetch((prev) => !prev);
        handleEditClose();
      } else toast.error(result.message);
    } catch (error) {
      console.error(error);
    } finally {
      hide();
    }
  };

  return (
    <Dialog open={openEdit} onClose={handleEditClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledDialogTitle>Edit User Information</StyledDialogTitle>
        <StyledDialogContent>
          <Box textAlign="center">
            <ImgStyled src={imgSrc} alt="Profile Picture" />
            <Button component="label" variant="contained" sx={{ mt: 2 }}>
              Upload Image
              <input type="file" hidden onChange={handleImageChange} accept="image/*" />
            </Button>
          </Box>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[
              { name: 'full_name', label: 'Full Name', placeholder: 'John Doe' },
              { name: 'user_name', label: 'User Name', placeholder: 'johndoe' },
              { name: 'email', label: 'Email', placeholder: 'johndoe@example.com', type: 'email' },
              { name: 'contact', label: 'Contact', placeholder: '1234567890', type: 'tel' },
              { name: 'designation', label: 'Designation', placeholder: 'Manager' },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      label={field.label}
                      value={value}
                      onChange={onChange}
                      placeholder={field.placeholder}
                      error={!!errors[field.name]}
                      helperText={errors[field.name]?.message}
                      type={field.type || 'text'}
                    />
                  )}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Controller
                name="role"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    select
                    fullWidth
                    label="Role"
                    value={value}
                    onChange={onChange}
                    error={!!errors.role}
                    helperText={errors.role?.message}
                  >
                    {groups.map((group) => (
                      <MenuItem key={group.role.id} value={group.role.id}>
                        {group.role.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleEditClose}>
            Cancel
          </Button>
        </StyledDialogActions>
      </form>
    </Dialog>
  );
};

export default UserEditDialog;
