import { Avatar, AvatarGroup, Box, Button, Card, CardContent, Grid, Typography, TextField, MenuItem } from '@mui/material';
import Header from 'components/Header';

import GroupSkeleton from 'components/cards/Skeleton/GroupSkeleton';
import OptionsMenu from 'components/option-menu';
import GroupDeleteDialog from 'features/user-management/groups-page/components/GroupDeleteDialog';
import { selectLoading as selectGroupLoading, selectGroups } from 'features/user-management/groups-page/redux/groupSelectors';
import { setGroups } from 'features/user-management/groups-page/redux/groupSlice';
import { getAllGroups } from 'features/user-management/groups-page/redux/groupThunks';
import { deleteGroup, searchGroups } from 'features/user-management/groups-page/services/groupService';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const GroupManagement = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeleteGroupId, setSelectedDeleteGroupId] = useState('');
  const [statusValue, setStatusValue] = useState('');

  const dispatch = useDispatch();
  const groups = useSelector(selectGroups);
  const groupLoading = useSelector(selectGroupLoading);
  const selectedBranchId = useSelector((state) => state.auth.selectedBranchId);

  console.log(groups);
  useEffect(() => {
    dispatch(getAllGroups(selectedBranchId));
  }, [dispatch, selectedBranchId]);

  const AddRoleAvatar = require('assets/images/avatar/add-role.png');
  console.log(selectedDeleteGroupId);
  const handleDeleteGroup = async () => {
    try {
      const result = await deleteGroup(selectedDeleteGroupId);

      if (result.success) {
        toast.success(result.message);
        dispatch(getAllGroups());
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusValue = (event) => {
    setStatusValue(event.target.value);
    setDeleteDialogOpen(true);
    setSelectedDeleteGroupId(item?.role?.id);
  };

  const handleSearch = async (value) => {
    try {
      setSearchQuery(value);
      const result = await searchGroups(value);

      if (result.success) {
        console.log('Search results:', result.data);
        dispatch(setGroups(result.data));
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderCards = () => {
    return groups?.map((item, index) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <Card sx={{ minHeight: 160 }}>
          <CardContent>
            <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: 'text.secondary' }}>{`Total ${item.users?.length} users`}</Typography>
              <AvatarGroup
                max={4}
                className="pull-up"
                sx={{
                  '& .MuiAvatar-root': { width: 32, height: 32, fontSize: (theme) => theme.typography.body2.fontSize }
                }}
              >
                {item?.users?.map((user, index) => (
                  <Avatar key={index} alt={item?.name} src={`${process.env.REACT_APP_PUBLIC_API_URL}/public/${user?.name}`} />
                ))}
              </AvatarGroup>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {item?.role?.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <TextField
                size="small"
                select
                width={100}
                label="Status"
                SelectProps={{ value: statusValue, onChange: (e) => handleStatusValue(e) }}
              >
                <MenuItem value="1">Active</MenuItem>
                <MenuItem value="0">Inactive</MenuItem>
              </TextField>

              <OptionsMenu
                menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
                iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                options={[
                  {
                    text: 'View',
                    menuItemProps: {
                      component: Link,
                      to: 'view'
                    }
                  },
                  {
                    text: 'Delete',

                    menuItemProps: {
                      onClick: () => {
                        setSelectedDeleteGroupId(item?.role?.id);
                        setDeleteDialogOpen(true);
                      }
                    }
                  },
                  {
                    text: 'Edit',
                    menuItemProps: {
                      component: Link,
                      to: `edit/${item.role.id}`
                    }
                  }
                ]}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  return (
    <>
      {groupLoading ? (
        <GroupSkeleton />
      ) : (
        <Grid>
          <Header title="Groups" handleSearch={handleSearch} searchQuery={searchQuery} />

          <Grid container spacing={2} className="match-height" sx={{ marginTop: 0 }}>
            <Grid item xs={12} sm={6} lg={4}>
              <Card sx={{ cursor: 'pointer' }}>
                <Grid container sx={{ height: '100%' }}>
                  <Grid item xs={5}>
                    <Box
                      sx={{
                        height: '100%',
                        minHeight: 160,
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center'
                      }}
                    >
                      <img height={122} alt="add-role" src={AddRoleAvatar} />
                    </Box>
                  </Grid>
                  <Grid item xs={7}>
                    <CardContent sx={{ pl: 0, height: '100%' }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Button variant="contained" component={Link} to={'add'} sx={{ mb: 3, whiteSpace: 'nowrap' }}>
                          Add New Group
                        </Button>
                        <Typography sx={{ color: 'text.secondary' }}>Add group, if it doesnt exist.</Typography>
                      </Box>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            {renderCards()}
          </Grid>
          <GroupDeleteDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen} handleDeleteGroup={handleDeleteGroup} />
        </Grid>
      )}
    </>
  );
};
export default GroupManagement;
