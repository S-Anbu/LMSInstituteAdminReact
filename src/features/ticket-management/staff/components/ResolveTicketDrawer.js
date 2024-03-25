// ** React Imports
// import { useEffect, useState } from 'react';
// ** MUI Imports
import { Avatar, Button, Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
// ** Icon Imports
import { TextField } from '@mui/material';

import Icon from 'components/icon';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
// import { addCourseModule } from 'features/content-management/course-contents/course-modules-page/services/moduleServices';

import { updateStaffTicket } from '../services/staffTicketService';

const TicketResolveDrawer = (props) => {
  // ** Props
  const { open, toggle, ticket, setRefetch } = props;

  console.log(ticket);

  // ** State

  const selectedBranchId = useSelector((state) => state.auth.selectedBranchId);
  console.log(selectedBranchId);
  // console.log(selectedTicket);

  const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between'
  }));

  const schema = yup.object().shape({
    solution: yup.string().required()
  });

  const defaultValues = {
    solution: ''
    // solution: `Ticket ID: ${ticket?.ticket_id}\n\n`,
  };

  // ** Hooks
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    const inputData = {
      solution: data.solution,
      ticket_id: ticket.ticket_id
    };

    console.log(inputData);

    const result = await updateStaffTicket(inputData);

    if (result.success) {
      toast.success(result.message);
      reset();
      toggle();
      setRefetch();
    } else {
    }
  };

  const handleClose = () => {
    setValue('solution', '');
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
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
    >
      <Header>
        <Typography variant="h5">Resolve Ticket</Typography>
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={''} sx={{ mr: 2.5, height: 38, width: 38 }} />
                <Box>
                  <Typography variant="h5">{ticket?.staff?.staff_name}</Typography>
                  <Typography variant="body4" sx={{ color: 'text.secondary', fontSize: 12 }}>
                    {ticket?.staff?.email}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, color: 'primary.main' }}>{ticket?.ago}</Typography>
              </Box>
            </Box>

            <Typography variant="h5" sx={{ mt: 4, mb: 2, color: 'text.main' }}>
              Problem :
            </Typography>
            <Typography sx={{ mb: 4, color: 'text.secondary' }}>{ticket?.query}</Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name="solution"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={value}
                  sx={{ mb: 2 }}
                  label="Solution"
                  onChange={onChange}
                  placeholder="Business Development Executive"
                  error={Boolean(errors.solution)}
                  {...(errors.solution && { helperText: errors.solution.message })}
                />
              )}
            />
          </Grid>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
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

export default TicketResolveDrawer;
