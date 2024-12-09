import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ButtonBase,
  Card,
  Grid,
  //  InputAdornment,
  TextField,
  Popper,
  MenuItem
} from '@mui/material';

// third-party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports
import Transitions from 'components/extended/Transitions';
import { updateSelectedBranch } from 'features/authentication/authActions';
import { useDispatch } from 'react-redux';
// assets
import {
  // IconAdjustmentsHorizontal,
  IconSearch
  // IconX
} from '@tabler/icons';
import { shouldForwardProp } from '@mui/system';

import { useSelector } from 'react-redux';

// styles
const PopperStyle = styled(Popper, { shouldForwardProp })(({ theme }) => ({
  zIndex: 1100,
  width: '99%',
  top: '-55px !important',
  padding: '0 12px',
  [theme.breakpoints.down('sm')]: {
    padding: '0 10px'
  }
}));

const OutlineInputStyle = styled(TextField)(({ theme }) => ({
  minWidth: 434,
  marginLeft: 16,
  // paddingLeft: 16,
  paddingRight: 16,
  '& input': {
    background: 'transparent !important',
    paddingLeft: '4px !important'
  },
  [theme.breakpoints.down('lg')]: {
    width: 250
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: 4,
    background: '#fff'
  }
}));

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme }) => ({
  ...theme.typography.commonAvatar,
  ...theme.typography.mediumAvatar,
  background: theme.palette.secondary.light,
  color: theme.palette.secondary.dark,
  '&:hover': {
    background: theme.palette.secondary.dark,
    color: theme.palette.secondary.light
  }
}));

// ==============================|| SEARCH INPUT - MOBILE||============================== //

const MobileSearch = () =>
// { value, setValue, popupState }
{
  // const theme = useTheme();

  return (
    <OutlineInputStyle
      id="input-search-header"
      select
      sx={{
          backgroundColor : "red"
      }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Branch"
      aria-describedby="search-helper-text"
      inputProps={{ 'aria-label': 'weight' }}
    />
  );
};

MobileSearch.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
  popupState: PopupState
};

// ==============================|| SEARCH INPUT ||============================== //

const SearchSection = () => {
  const theme = useTheme();
  const [value, setValue] = useState('Keelkattalai');
  // Inside your component
  const branches = useSelector((state) => state.auth.branches);
  const selectedBranchId = useSelector((state) => state.auth.selectedBranchId);
  const dispatch = useDispatch();
  console.log(selectedBranchId,"selectedBranchId",branches,branches?.[0]?.uuid === selectedBranchId,typeof(selectedBranchId),typeof(branches?.[0]?.uuid),selectedBranchId )
  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <>
              <Box sx={{ ml: 2 }}>
                <ButtonBase sx={{ borderRadius: '12px' }}>
                  <HeaderAvatarStyle variant="rounded" {...bindToggle(popupState)}>
                    <IconSearch stroke={1.5} size="1.2rem" />
                  </HeaderAvatarStyle>
                </ButtonBase>
              </Box>
              <PopperStyle {...bindPopper(popupState)} transition>
                {({ TransitionProps }) => (
                  <>
                    <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                      <Card
                        sx={{
                          background: '#fff',
                          [theme.breakpoints.down('sm')]: {
                            border: 0,
                            boxShadow: 'none'
                          }
                        }}
                      >
                        <Box sx={{ p: 2 }}>
                          <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item xs>
                              <MobileSearch value={value} setValue={setValue} popupState={popupState} />
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                    </Transitions>
                  </>
                )}
              </PopperStyle>
            </>
          )}
        </PopupState>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <OutlineInputStyle
          id="input-search-header"
          value={selectedBranchId?.trim()}
          onChange={(e) => {

            dispatch(updateSelectedBranch(e.target.value));
            localStorage.setItem('selectedBranchId', e.target.value)
          }}
          placeholder="Search"
          aria-describedby="search-helper-text"
          inputProps={{ 'aria-label': 'weight' }}
          select
          label="Branch"
        >
          {branches?.map((branch, index) => (
            <MenuItem value={branch?.uuid} key={index} selected={selectedBranchId === branch?.uuid}>
              {branch?.branch_identity}
            </MenuItem>
          ))}
        </OutlineInputStyle>
      </Box>
    </>
  );
};

export default SearchSection;
