import { useState, useEffect } from 'react';
import { Box, Grid, Tab, Typography, Card, CardContent, CardHeader, Modal, IconButton } from '@mui/material';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Avatar from 'components/mui/avatar';
import { getAllNotificationsByAuth } from 'features/notification-management/all-notifications/services/allNotificationServices';
import { useSelector } from 'react-redux';
import { useInstitute } from 'utils/get-institute-details';
import { useSpinner } from 'context/spinnerContext';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';
import client from 'api/client';
import { formatDateToTextAsPastValue } from 'utils/formatDate';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AllNotifications = () => {
  const selectedBranchId = useSelector((state) => state.auth.selectedBranchId);
  const institute = useInstitute();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [value, setValue] = useState(searchParams.get('status') || 'all'); // Tabs: 'all', 'read', 'unread'
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { show, hide } = useSpinner();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Handle tab change and update query params
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchParams({ status: newValue });
    fetchNotifications(newValue);
  };

  // Fetch notifications based on the selected status
  const fetchNotifications = async (status) => {
    setLoading(true);
    const data = { institute_id: institute.getInstituteId() };
    const query = { branch_id: selectedBranchId, status: status === 'all' ? undefined : status };

    try {
      const result = await getAllNotificationsByAuth(data, query);
      setNotifications(result?.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications initially based on query params
  useEffect(() => {
    fetchNotifications(value);
  }, [value]);

  // Handle notification click and update query params
  const handleNotificationClick = async (notification) => {
    const notificationId = notification?.uuid;
    setSearchParams({ status: value, id: notificationId });
    if (notification?.status === 'unread') {
      try {
        show();
        const data = { id: notificationId };
        const body = { status: 'read' };
        await client.institute_notification.update_institute_notification(data, body);
      } catch (error) {
        toast.error(error.message);
      } finally {
        hide();
      }
    }
    setSelectedNotification(notification);
    setModalOpen(true);
  };

  // Handle modal close and update query params
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedNotification(null);
    setSearchParams({ status: value });
  };

  // Render notifications list
  const renderNotifications = () => (
    <Grid container spacing={2}>
      {notifications.length > 0 ? (
        notifications.map((item, index) => (
          <Grid item xs={12} key={index}>
            <Box
              onClick={() => handleNotificationClick(item)}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 2,
                borderRadius: 2,
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: item.status === 'unread' ? '#0cce7f' : '#ffffff',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src="/vuexy-nextjs-admin-template/demo-1/images/avatars/1.png" alt={item.title} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.title || 'No Title'}</Typography>
                  <Typography variant="body2" sx={{ color: 'grey.600', mt: 0.5 }}>
                    {item.body || 'No description available'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography fontSize={12} variant="body2" sx={{ color: 'grey.500' }}>
                  {formatDateToTextAsPastValue(item.createdAt) || 'Just now'}
                </Typography>
                <Typography fontSize={12} sx={{ color: item.status === 'unread' ? '#0CCE7F' : '#7367F0', fontWeight: 'bold' }}>
                  {item.status === 'unread' ? 'Unread' : 'Read'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))
      ) : (
        <Typography variant="body2" sx={{ color: 'grey.500', mt: 2 }}>No notifications to display</Typography>
      )}
    </Grid>
  );

  // Modal for detailed notification view
  const renderModal = () => (
    <Modal open={modalOpen} onClose={handleCloseModal}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>
        {selectedNotification && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>{selectedNotification.title}</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>{selectedNotification.body}</Typography>
            <Typography variant="caption" sx={{ color: 'grey.600' }}>Status: {selectedNotification.status}</Typography>
          </>
        )}
      </Box>
    </Modal>
  );

  return (
    <Card>
      <CardHeader title="Notifications" />
      <CardContent sx={{ mt: 0, pt: 0 }}>
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label="notification tabs">
            <Tab value="all" label="All Notifications" />
            <Tab value="read" label="Read" />
            <Tab value="unread" label="Unread" />
          </TabList>
          <TabPanel value="all">{loading ? 'Loading...' : renderNotifications()}</TabPanel>
          <TabPanel value="read">{loading ? 'Loading...' : renderNotifications()}</TabPanel>
          <TabPanel value="unread">{loading ? 'Loading...' : renderNotifications()}</TabPanel>
        </TabContext>
        {renderModal()}
      </CardContent>
    </Card>
  );
};

export default AllNotifications;
