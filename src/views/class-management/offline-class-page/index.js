import { Grid } from '@mui/material';
import ClassSkeleton from 'components/cards/Skeleton/ClassSkeleton';
import OfflineClassCard from 'features/class-management/offline-classes/components/OfflineClassCard';
import OfflineClassCardHeader from 'features/class-management/offline-classes/components/OfflineClassCardHeader';
import OfflineClassFilterCard from 'features/class-management/offline-classes/components/OfflineClassFilterCard';
import { selectOfflineClasses, selectLoading } from 'features/class-management/offline-classes/redux/offlineClassSelectors';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllOfflineClasses } from 'features/class-management/offline-classes/redux/offlineClassThunks';

const OfflineClass = () => {
  const [offlineClassRefetch, setofflineClassRefetch] = useState(false);
  const selectedBranchId = useSelector((state) => state.auth.selectedBranchId);
  const offlineClasses = useSelector(selectOfflineClasses);
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  useEffect(() => {
    const data = {
      type: 'offline',
      branch_id: selectedBranchId
    };
    dispatch(getAllOfflineClasses(data));
  }, [dispatch, selectedBranchId, offlineClassRefetch]);
  return (
    <>
      <Grid>
        <OfflineClassFilterCard selectedBranchId={selectedBranchId} />
        <OfflineClassCardHeader selectedBranchId={selectedBranchId} setRefetch={setofflineClassRefetch} />
        {loading ? (
          <ClassSkeleton />
        ) : (
          <Grid container spacing={1} className="match-height" sx={{ marginTop: 3 }}>
            <OfflineClassCard
              offlineClassRefetch={offlineClassRefetch}
              setofflineClassRefetch={setofflineClassRefetch}
              offlineClasses={offlineClasses?.data}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default OfflineClass;
