import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import AddGroupSkeleton from 'components/cards/Skeleton/AddGroupSkeleton';
import { getAllGroups } from 'features/user-management/groups-page/redux/groupThunks';
import { getAllPermissions, getPermissionsByRole, updateGroup } from 'features/user-management/groups-page/services/groupService';
import { editGroupYupSchema } from 'features/user-management/groups-page/utills';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const GroupEditDialog = () => {
  // State variables

  const dispatch = useDispatch();

  const selectedBranchId = useSelector((state) => state.auth.selectedBranchId);

  const [selectedCheckbox, setSelectedCheckbox] = useState([]);
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [permissionCount, setPermissionCount] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const groupId = location?.state?.id;
  const groupName = location?.state?.name;

  // Default form values
  const defaultValues = {
    roleName: groupName
  };

  // Form methods using react-hook-form
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(editGroupYupSchema)
  });

  // Function to handle form closure
  const handleClose = useCallback(() => {
    navigate(-1);
    reset();
  }, [reset]);

  // Function to handle form submission
  const onSubmit = useCallback(
    async (data) => {
      try {
        console.log(selectedCheckbox,"selectedCheckBox")
        selectedCheckbox?.map((i)=>{
          const [type,id] = i.match(/[a-zA-Z]+|\d+/g)
          console.log(type,id,"type and id")
        })
        d
        const inputData = {
          id: groupId,
          name: data.roleName === groupName ? '' : data?.roleName,
          permission_ids: selectedCheckbox
        };

        const result = await updateGroup(inputData);

        if (result.success) {
          dispatch(getAllGroups({ branch_id: selectedBranchId }));
          navigate(-1);
          toast.success(result.message);
        } else {
          // Handle the error response here

          toast.error(result.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch, selectedCheckbox, navigate, groupId, selectedBranchId]
  );
  // Fetch permissions and permission count on component mount
  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    getAllPermissionsIdByRole(groupId);
  }, [groupId]);

  // Fetch all permissions
  const getPermissions = useCallback(async () => {
    try {
      const result = await getAllPermissions();
      console.log(result,"permissions getAll")
      if (result.success) {
        // setPermissions(result.data);
        // result?.permissions?.forEach((permission) => {
        //   togglePermission("create"+permission.id);
        //   togglePermission("read"+permission.id);
        //   togglePermission("update"+permission.id);
        //   togglePermission("delete"+permission.id);
        // });
        // setPermissionCount(result.permissions);
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Fetch permissions by role id
  const getAllPermissionsIdByRole = useCallback(async (id) => {
    try {
      setLoading(true);
      const result = await getPermissionsByRole(id);
      console.log(result,"result permissionsByRole")
      if (result.success) {
        result.data?.forEach((permission) => {
          permission?.create_permission?.permission && togglePermission("create"+permission.id);
          permission?.read_permission?.permission && togglePermission("read"+permission.id);
          permission?.update_permission?.permission && togglePermission("update"+permission.id);
          permission?.delete_permission?.permission && togglePermission("delete"+permission.id);
        });
        setLoading(false);
        setPermissions(result?.data)
      } else {
        console.log(result.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  // Function to toggle permission selection
  const togglePermission = useCallback((id) => {
    setSelectedCheckbox((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((item) => item !== id);
      } else {
        return [...prevState, id];
      }
    });
  }, []);

  // Function to handle select all checkbox
  const handleSelectAllCheckbox = useCallback(() => {
    if (isIndeterminateCheckbox) {
      setSelectedCheckbox([]);
      setIsIndeterminateCheckbox(false);
    } else {
      const arr = [];
      permissionCount?.forEach((permission) => {
        arr.push(permission.id);
      });
      setSelectedCheckbox(arr);
      setIsIndeterminateCheckbox(true);
    }
  }, [isIndeterminateCheckbox, permissionCount]);
  console.log(selectedCheckbox,"selected",permissions)
  // Render permissions table rows
  const renderPermissions = useMemo(() => {
    return permissions?.map((module,index) =>
      // module?.screens?.map((screen, index) => (
        <TableRow key={index} sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
          <TableCell
            sx={{
              fontWeight: 600,
              whiteSpace: 'nowrap',
              fontSize: (theme) => theme.typography.h6.fontSize
            }}
          >
            {module?.identity}
          </TableCell>
          {/* {screen?.permissions?.map((permission, index) => ( */}
            {
              module?.create_permission?.permission &&<TableCell key={module?.id+module._id+index+module?.identity}>
              <FormControlLabel
                label={"create"}
                sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                control={
                  <Checkbox
                    size="small"
                    id={`${index}-create`}
                    onChange={() => togglePermission("create"+module?.id)}
                    checked={selectedCheckbox?.includes("create"+module?.id)}
                  />
                }
              />
            </TableCell>
            }
            {module?.read_permission?.permission&&<TableCell key={module?._id+module.id+index+module?.identity}>
              <FormControlLabel
                label={"read"}
                sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                control={
                  <Checkbox
                    size="small"
                    id={`${index}-read`}
                    onChange={() => togglePermission("read"+module?.id)}
                    checked={selectedCheckbox?.includes("read"+module?.id)}
                  />
                }
              />
            </TableCell>
            }
            {module?.update_permission?.permission&&<TableCell key={index+module.id+module?._id+module?.identity}>
              <FormControlLabel
                label={"update"}
                sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                control={
                  <Checkbox
                    size="small"
                    id={`${index}-update`}
                    onChange={() => togglePermission("update"+module?.id)}
                    checked={selectedCheckbox?.includes("update"+module?.id)}
                  />
                }
              />
            </TableCell>
            }
            {module?.delete_permission?.permission&&<TableCell key={index+module.id+module?.identity+module?._id}>
              <FormControlLabel
                label={"delete"}
                sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                control={
                  <Checkbox
                    size="small"
                    id={`${index}-delete`}
                    onChange={() => {togglePermission("delete"+module?.id);console.log(selectedCheckbox?.includes("delete"+module?.id),module?.id)}}
                    checked={selectedCheckbox?.includes("delete"+module?.id)}
                  />
                }
              />
            </TableCell>
            }
          {/* ))} */}
        </TableRow>
      // ))
    );
  }, [permissions, selectedCheckbox, togglePermission]);

  return (
    <>
      {loading ? (
        <AddGroupSkeleton />
      ) : (
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader
              sx={{
                textAlign: 'center',
                px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(5)} !important`],
                pt: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(8)} !important`]
              }}
              title="Edit Group"
              subheader="Set Group Permissions"
            ></CardHeader>
            <CardContent
              sx={{
                pb: (theme) => `${theme.spacing(5)} !important`,
                px: (theme) => [`${theme.spacing(3)} !important`, `${theme.spacing(5)} !important`]
              }}
            >
              <Box sx={{ my: 4 }}>
                <Controller
                  name="roleName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      label="Role Name"
                      onChange={onChange}
                      placeholder="John Doe"
                      error={Boolean(errors.roleName)}
                      {...(errors.roleName && { helperText: errors.roleName.message })}
                    />
                  )}
                />
              </Box>
              <Typography variant="h4">Group Permissions</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ pl: '0 !important' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            whiteSpace: 'nowrap',
                            alignItems: 'center',
                            textTransform: 'capitalize',
                            '& svg': { ml: 1, cursor: 'pointer' },
                            color: (theme) => theme.palette.text.secondary,
                            fontSize: (theme) => theme.typography.h6.fontSize
                          }}
                        >
                          Administrator Access
                          <Tooltip placement="top" title="Allows a full access to the system">
                            <Box sx={{ display: 'flex' }}>
                              <Icon icon="tabler:info-circle" fontSize="1.25rem" />
                            </Box>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell colSpan={3}>
                        <FormControlLabel
                          label="Select All"
                          sx={{ '& .MuiTypography-root': { textTransform: 'capitalize', color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size="small"
                              onChange={handleSelectAllCheckbox}
                              indeterminate={isIndeterminateCheckbox}
                              checked={selectedCheckbox?.length === permissionCount?.length}
                            />
                          }
                        />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{renderPermissions}</TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <CardActions
              sx={{
                display: 'flex',
                justifyContent: 'center',
                px: (theme) => [`${theme.spacing(3)} !important`, `${theme.spacing(8)} !important`],
                pb: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(8)} !important`]
              }}
            >
              <Box className="demo-space-x">
                <Button type="submit" variant="contained">
                  Submit
                </Button>
                <Button sx={{ ml: 3 }} variant="tonal" color="error" onClick={handleClose}>
                  Cancel
                </Button>
              </Box>
            </CardActions>
          </form>
        </Card>
      )}
    </>
  );
};

export default GroupEditDialog;
