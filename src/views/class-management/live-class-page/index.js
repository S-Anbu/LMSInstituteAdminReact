import { Grid } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LiveClassCard from 'features/class-management/live-classes/components/LiveClassCard';
import LiveClassCardHeader from 'features/class-management/live-classes/components/LiveClassCardHeader';
import LiveClassFilterCard from 'features/class-management/live-classes/components/LiveClassFilterCard';
import ClassSkeleton from 'components/cards/Skeleton/ClassSkeleton';
import { selectLiveClasses, selectLoading } from 'features/class-management/live-classes/redux/liveClassSelectors';
import { getAllLiveClasses } from 'features/class-management/live-classes/redux/liveClassThunks';
const LiveClass = () => {
  const [refetch, setRefetch] = useState(false);
  const selectedBranchId = useSelector((state) => state.auth.selectedBranchId);
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const liveClasses = useSelector(selectLiveClasses);

  useEffect(() => {
    const data = {
      type: 'live',
      branch_id: selectedBranchId
    };
    dispatch(getAllLiveClasses(data));
  }, [dispatch, selectedBranchId, refetch]);
  return (
    <>
      <Grid>
        <LiveClassFilterCard selectedBranchId={selectedBranchId} />
        <LiveClassCardHeader selectedBranchId={selectedBranchId} setRefetch={setRefetch} />
        {loading ? (
          <ClassSkeleton liveClasses={liveClasses?.data} />
        ) : (
          <Grid container spacing={1} className="match-height" sx={{ marginTop: 3 }}>
            <LiveClassCard refetch={refetch} setRefetch={setRefetch} liveClasses={liveClasses?.data} />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default LiveClass;