// ** React Imports
import { useEffect, useState } from 'react';
// ** MUI Imports
import { Button, Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import axios from 'axios';
// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
// ** Icon Imports
import { TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Icon from 'components/icon';
import toast from 'react-hot-toast';
import { updateCourseModule } from '../services/moduleServices';

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return '';
  }
};

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}));

const schema = yup.object().shape({
  description: yup.string().required(),
  course: yup.string().required(),
  title: yup
    .string()
    .min(3, (obj) => showErrors('Title', obj.value.length, obj.min))
    .required(),
  Videourl: yup.string().required()
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder'
];

const defaultValues = {
  description: '',
  title: '',
  branch: '',
  course: '',
  Videourl: ''
};

const ModuleEdit = (props) => {
  // ** Props
  const { open, toggle } = props;

  // ** State
  const [selectedBranches, setSelectedBranches] = useState([]);

  const [groups, setGroups] = useState([]);

  const handleBranchChange = (event) => {
    setSelectedBranches(event.target.value);
  };

  useEffect(() => {
    getAllGroups();
  }, []);

  const getAllGroups = async () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_PUBLIC_API_URL}/api/platform/admin/user-management/course/get-all`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };

    await axios
      .request(config)
      .then((response) => {
        console.log('Groups : ', response.data);
        setGroups(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(groups);

  // ** Hooks
  const {
    reset,
    control,
    setValue,
    // setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: props.initialValues || defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });
  useEffect(() => {
    if (open) {
      reset(props.initialValues || defaultValues);
    }
  }, [open, reset, props.initialValues]);

  const onSubmit = async (data) => {
    console.log(data);
    const dummyData = {
      branch: data.branch,
      course: data.course,
      title: data.title,
      description: data.description,
      videourl: data.Videourl
    };
    const result = await updateCourseModule(dummyData);

    if (result.success) {
      toast.success(result.message);
    } else {
      let errorMessage = '';
      Object.values(result.message).forEach((errors) => {
        errors.forEach((error) => {
          errorMessage += `${error}\n`; // Concatenate errors with newline
        });
      });
      toast.error(errorMessage.trim());
      // toast.error(result.message);
    }
  };

  const handleClose = () => {
    setValue('contact', Number(''));
    toggle();
    reset();
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 380 } } }}
    >
      <Header>
        <Typography variant="h5">Add Module</Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: (theme) => `rgba(${theme.palette.secondary.main}, 0.16)`
            }
          }}
        >
          <Icon icon="tabler:x" fontSize="1.125rem" />
        </IconButton>
      </Header>
      <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12} sm={12}>
            <TextField
              sx={{ mb: 4 }}
              select
              fullWidth
              label="Branch"
              id="select-multiple-checkbox"
              SelectProps={{
                MenuProps,
                multiple: true,
                value: selectedBranches,
                onChange: (e) => handleBranchChange(e),
                renderValue: (selected) => selected.join(', ')
              }}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={selectedBranches.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Controller
            name="course"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                select
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label="Select Course"
                onChange={onChange}
                SelectProps={{ value: value, onChange: onChange }}
                error={Boolean(errors.course)}
                {...(errors.course && { helperText: errors.course.message })}
              >
                <MenuItem value={'Web Development'}>Web Development</MenuItem>
                <MenuItem value={'Android Development'}>Android Development</MenuItem>
              </TextField>
            )}
          />

          <Controller
            name="title"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label="Title"
                onChange={onChange}
                placeholder="John Doe"
                error={Boolean(errors.title)}
                {...(errors.title && { helperText: errors.title.message })}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label="description"
                onChange={onChange}
                placeholder="Business Development Executive"
                error={Boolean(errors.description)}
                {...(errors.description && { helperText: errors.description.message })}
              />
            )}
          />

          <Controller
            name="title"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label="Video URL"
                onChange={onChange}
                placeholder="Video URL"
                error={Boolean(errors.Videourl)}
                {...(errors.Videourl && { helperText: errors.Videourl.message })}
              />
            )}
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type="submit" variant="contained" sx={{ mr: 3 }}>
              Submit
            </Button>
            <Button variant="tonal" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default ModuleEdit;