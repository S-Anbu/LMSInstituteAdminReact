// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

// ** Custom Components
import UserEditDialog from '../UserEditDialog';
import { getImageUrl } from 'utils/imageUtils';
import { profilePlaceholder } from 'utils/placeholders';

const UserViewLeft = ({ userData, id, setRefetch }) => {
  const statusColors = {
    1: 'success',
    pending: 'warning',
    0: 'error'
  };

  // ** States
  const [openEdit, setOpenEdit] = useState(false);

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} >
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardContent
            sx={{
              pt: 4,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              backgroundColor: 'primary.light',
              color: 'primary.contrastText'
            }}
          >
            <Avatar
              src={userData?.image ? getImageUrl(userData.image) : profilePlaceholder}
              alt={userData?.name}
              sx={{ width: 120, height: 120, mb: 3, border: '4px solid', borderColor: 'primary.main' }}
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {`${userData?.first_name || ''} ${userData?.last_name || ''}`}
            </Typography>
            <Chip
              label={userData?.role?.identity || 'User'}
              color="warning"
              sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
            />
          </CardContent>

          <Divider />

          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3, textTransform: 'uppercase', fontWeight: 500 }}>
              User Details
            </Typography>
            <Box sx={{ display: 'grid', rowGap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.primary" fontWeight={500}>
                  Name:
                </Typography>
                <Typography>{`${userData?.first_name || ''} ${userData?.last_name || ''}`}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.primary" fontWeight={500}>
                  Email:
                </Typography>
                <Typography>{userData?.email || 'N/A'}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.primary" fontWeight={500}>
                  Status:
                </Typography>
                <Chip
                  label={userData?.is_active ? 'Active' : 'Inactive'}
                  color={statusColors[userData?.is_active] || 'default'}
                  size="small"
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.primary" fontWeight={500}>
                  Contact:
                </Typography>
                <Typography>{userData?.phone_number || 'N/A'}</Typography>
              </Box>
            </Box>
          </CardContent>

          <CardActions sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditClickOpen}
              sx={{ px: 4, py: 1, textTransform: 'none' ,borderRadius: '50px' }}
            >
              Edit Details
            </Button>
          </CardActions>
        </Card>
        <UserEditDialog id={id} userData={userData} openEdit={openEdit} handleEditClose={handleEditClose} setRefetch={setRefetch} />
      </Grid>
    </Grid>
  );
};

export default UserViewLeft;
