// ** React Imports
import { useState } from 'react';
// ** MUI Imports
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
// ** Icon Imports
import Icon from 'components/icon';
// ** Third Party Imports
// ** Utils Import
import { getInitials } from 'utils/get-initials';
// ** Custom Components Imports
import { TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import CustomChip from 'components/mui/chip';
import OptionsMenu from 'components/option-menu';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import RefundAddDrawer from './RefundAddDrawer';
import RefundCardHeader from './RefundCardHeader';
// ** Styled Components
import FeesTableSkeleton from 'components/cards/Skeleton/PaymentSkeleton';
import RefundDeleteModel from 'components/modal/DeleteModel';
import { selectBatches } from 'features/batch-management/batches/redux/batchSelectors';
import { getAllBatches } from 'features/batch-management/batches/redux/batchThunks';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatePickerWrapper from 'styles/libs/react-datepicker';
import { selectStudentFeeRefunds } from '../redux/studentFeeRefundSelectors';
import { getAllStudentFeeRefunds } from '../redux/studentFeeRefundThunks';
import toast from 'react-hot-toast';

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.primary.main} !important`
}));

// ** Vars
// const invoiceStatusObj = {
//   Sent: { color: 'secondary', icon: 'tabler:circle-check' },
//   Paid: { color: 'success', icon: 'tabler:circle-half-2' },
//   Draft: { color: 'primary', icon: 'tabler:device-floppy' },
//   'Partial Payment': { color: 'warning', icon: 'tabler:chart-pie' },
//   'Past Due': { color: 'error', icon: 'tabler:alert-circle' },
//   Downloaded: { color: 'info', icon: 'tabler:arrow-down-circle' }
// };

// const handleRowClick = (rowData) => {
//   setSelectedRows(rowData);
// };

// ** renders client column
const renderClient = (row) => {
  if (row?.avatar && row?.avatar?.length) {
    return <Avatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />;
  } else {
    return (
      <Avatar
        skin="light"
        color={row.avatarColor || 'primary'}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: (theme) => theme.typography.body1.fontSize }}
      >
        {getInitials(row.name || 'John Doe')}
      </Avatar>
    );
  }
};

const defaultColumns = [
  {
    flex: 0.1,
    minWidth: 100,
    field: 'id',
    headerName: 'Refund ID',
    renderCell: ({ row }) => (
      <Typography component={LinkStyled} to={`/apps/invoice/preview/${row.id}`}>
        {`#${row.refund_id}`}
      </Typography>
    )
  },
  // {
  //   flex: 0.1,
  //   minWidth: 80,
  //   field: 'invoiceStatus',
  //   renderHeader: () => <Icon icon="tabler:trending-up" />,
  //   renderCell: ({ row }) => {
  //     const { dueDate, balance, invoiceStatus } = row;
  //     const color = invoiceStatusObj[invoiceStatus] ? invoiceStatusObj[invoiceStatus].color : 'primary';

  //     return (
  //       <Tooltip
  //         title={
  //           <div>
  //             <Typography variant="caption" sx={{ color: 'common.white', fontWeight: 600 }}>
  //               {invoiceStatus}
  //             </Typography>
  //             <br />
  //             <Typography variant="caption" sx={{ color: 'common.white', fontWeight: 600 }}>
  //               Balance:
  //             </Typography>{' '}
  //             {balance}
  //             <br />
  //             <Typography variant="caption" sx={{ color: 'common.white', fontWeight: 600 }}>
  //               Due Date:
  //             </Typography>{' '}
  //             {dueDate}
  //           </div>
  //         }
  //       >
  //         <Avatar skin="light" color={color} sx={{ width: '1.875rem', height: '1.875rem' }}>
  //           <Icon icon={invoiceStatusObj[invoiceStatus]} />
  //         </Avatar>
  //       </Tooltip>
  //     );
  //   }
  // },
  {
    flex: 0.2,
    minWidth: 320,
    field: 'name',
    headerName: 'Client',
    renderCell: ({ row }) => {
      const { name, companyEmail } = row;

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {name}
            </Typography>
            <Typography noWrap variant="body2" sx={{ color: 'text.disabled' }}>
              {companyEmail}
            </Typography>
          </Box>
        </Box>
      );
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'paid_amount',
    headerName: 'Paid Amount',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row?.student_fees[0]?.paid_amount}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 140,
    field: 'payment_date',
    headerName: 'Payment Date',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row?.student_fees[0]?.payment_date}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }) =>
      row.balance !== 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>{row?.student_fees[0]?.status}</Typography>
      ) : (
        <CustomChip rounded size="small" skin="light" color="success" label="Paid" />
      )
  }
];

/* eslint-enable */
const RefundTable = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  // ** State

  const [selectedRows, setSelectedRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [addUserOpen, setAddUserOpen] = useState(false);
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [refetch, setRefetch] = useState(false);
  console.log(setRefetch);
  const dispatch = useDispatch();
  const studentFeeRefunds = useSelector(selectStudentFeeRefunds);
  const selectedBranchId = useSelector((state) => state.auth.selectedBranchId);

  console.log(studentFeeRefunds);

  useEffect(() => {
    dispatch(
      getAllStudentFeeRefunds({
        branch_id: selectedBranchId
      })
    );
  }, [dispatch, selectedBranchId, refetch]);

  const toggleEditUserDrawer = () => {
    setEditUserOpen(!editUserOpen);
    console.log('Toggle drawer');
  };

  const [refundDeleteModelOpen, setRefundDeleteModelOpen] = useState(false);

  const [selectedRefundDeleteId, setSelectedRefundDeleteId] = useState(null);

  const handleDelete = useCallback((itemId) => {
    setSelectedRefundDeleteId(itemId);
    setRefundDeleteModelOpen(true);
  }, []);

  // Handle branch deletion
  const handleRefundDelete = async () => {
    const data = { id: selectedRefundDeleteId };
    const result = await deleteCourseCategory(data);
    if (result.success) {
      toast.success(result.message);
      setRefetch((state) => !state);
    } else {
      toast.error(result.message);
    }
  };

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <OptionsMenu
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
            options={[
              {
                text: 'Download',
                icon: <Icon icon="tabler:download" fontSize={20} />
              },
              {
                text: 'Edit',
                to: `/apps/invoice/edit/${row.id}`,
                icon: <Icon icon="tabler:edit" fontSize={20} />,
                menuItemProps: { onClick: toggleEditUserDrawer }
              },
              {
                text: 'View',
                to: `/apps/invoice/view/${row.id}`,
                icon: <Icon icon="tabler:eye" />,
                menuItemProps: { onClick: toggleEditUserDrawer }
              },
              {
                text: 'Delete',
                to: `/apps/invoice/delete/${row.id}`,
                icon: <Icon icon="tabler:trash" />,
                menuItemProps: {
                  onClick: () => {
                    handleDelete();
                  }
                }
              },
              {
                text: 'Duplicate',
                icon: <Icon icon="tabler:copy" fontSize={20} />
              }
            ]}
          />
        </Box>
      )
    }
  ];

  // const store = [
  //   {
  //     id: 1,
  //     invoiceStatus: 'Sent',
  //     name: 'John Doe',
  //     companyEmail: 'john.doe@example.com',
  //     total: 100,
  //     issuedDate: '2025-01-01',
  //     balance: 55,
  //     avatar: '',
  //     avatarColor: 'primary'
  //   },
  //   {
  //     id: 2,
  //     invoiceStatus: 'Sent',
  //     name: 'John Doe',
  //     companyEmail: 'arunbalaji.com',
  //     total: 200,
  //     issuedDate: '2000-01-01',
  //     balance: 50,
  //     avatar: '',
  //     avatarColor: 'primary'
  //   },
  //   {
  //     id: 3,
  //     invoiceStatus: 'Sent',
  //     name: 'John Doe',
  //     companyEmail: 'john.doe@example.com',
  //     total: 300,
  //     issuedDate: '25-01-01',
  //     balance: 40,
  //     avatar: '',
  //     avatarColor: 'primary'
  //   },
  //   {
  //     id: 4,
  //     invoiceStatus: 'Sent',
  //     name: 'John Doe',
  //     companyEmail: 'john.doe@example.com',
  //     total: 40,
  //     issuedDate: '202-01-01',
  //     balance: 30,
  //     avatar: '',
  //     avatarColor: 'primary'
  //   },
  //   {
  //     id: 5,
  //     invoiceStatus: 'Sent',
  //     name: 'John Doe',
  //     companyEmail: 'john.doe@example.com',
  //     total: 50,
  //     issuedDate: '20-01-01',
  //     balance: 0,
  //     avatar: '',
  //     avatarColor: 'primary'
  //   }
  // ];
  useEffect(() => {
    dispatch(
      getAllBatches({
        branch_id: selectedBranchId
      })
    );
  }, [dispatch, selectedBranchId]);

  const batch = useSelector(selectBatches);

  // const students = [
  //   { students_id: '1', students_name: 'students 1' },
  //   { students_id: '2', students_name: 'students 2' },
  //   { students_id: '3', students_name: 'students 3' }
  // ];

  // const [selectedstudents, setSelectedstudents] = useState([]);

  console.log(studentFeeRefunds);

  return (
    <DatePickerWrapper>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Filters" />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    // multiple
                    fullWidth
                    options={batch}
                    filterSelectedOptions
                    onChange={(e, newValue) => {
                      // const batchId = newValue.map((item) => item.batch.batch_id);
                      console.log(newValue);
                      const data = {
                        batch_id: newValue.batch.batch_id,
                        branch_id: selectedBranchId
                      };
                      dispatch(getAllStudentFeeRefunds(data));
                    }}
                    // defaultValue={[top100Films[13]]}
                    id="autocomplete-multiple-outlined"
                    getOptionLabel={(option) => option.batch.batch_name || ''}
                    renderInput={(params) => <TextField {...params} label=" Batches" placeholder="Favorites" />}
                  />
                </Grid>

                {/* <Grid item xs={12} sm={6}>
                  <Autocomplete
                    disableCloseOnSelect
                    multiple
                    id="select-multiple-chip"
                    options={[{ students_id: 'selectAll', students_name: 'Select All' }, ...students]}
                    getOptionLabel={(option) => option.students_name}
                    value={selectedstudents}
                    onChange={(e, newValue) => {
                      if (newValue && newValue.some((option) => option.students_id === 'selectAll')) {
                        setSelectedstudents(students.filter((option) => option.students_id !== 'selectAll'));
                      } else {
                        setSelectedstudents(newValue);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Students"
                        InputProps={{
                          ...params.InputProps,
                          style: { overflowX: 'auto', maxHeight: 55, overflowY: 'hidden' }
                        }}
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                          checkedIcon={<CheckBoxIcon fontSize="small" />}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.students_name}
                      </li>
                    )}
                    renderTags={(value) => (
                      <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', scrollbarWidth: 'none' }}>
                        {value.map((option, index) => (
                          <CustomChip
                            key={option.students_id}
                            label={option.students_name}
                            onDelete={() => {
                              const updatedValue = [...value];
                              updatedValue.splice(index, 1);
                              setSelectedstudents(updatedValue);
                            }}
                            color="primary"
                            sx={{ m: 0.75 }}
                          />
                        ))}
                      </div>
                    )}
                    isOptionEqualToValue={(option, value) => option.students_id === value.students_id}
                    selectAllText="Select All"
                    SelectAllProps={{ sx: { fontWeight: 'bold' } }}
                  />
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <RefundCardHeader selectedBranchId={selectedBranchId} selectedRows={selectedRows} toggle={toggleAddUserDrawer} />
        </Grid>
        <Grid item xs={12}>
          {loading ? (
            <FeesTableSkeleton />
          ) : (
            <Card>
              <DataGrid
                sx={{ p: 2 }}
                autoHeight
                pagination
                rowHeight={62}
                rows={studentFeeRefunds}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
              />
            </Card>
          )}
          <RefundAddDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
          {/* 
          <RefundEditDrawer
            setRefetch={setRefetch}
            selectedRows={selectedRows}
            handleRowClick={handleRowClick}
            open={editUserOpen}
            toggle={toggleEditUserDrawer}
          /> */}

          <RefundDeleteModel
            open={refundDeleteModelOpen}
            setOpen={setRefundDeleteModelOpen}
            description="Are you sure you want to delete this item?"
            title="Delete"
            handleSubmit={handleRefundDelete}
          />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  );
};

export default RefundTable;
