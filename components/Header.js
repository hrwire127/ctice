import * as React from 'react';
import PropTypes from 'prop-types';
import { Toolbar, Button, IconButton, Typography, InputBase, Box } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { makeStyles } from '@mui/styles';
import Link from 'next/link';
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { logout } from '../utilsCS/_client'
import useStyles from "../assets/styles/_Header"


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));


function Header(props)
{
  const user = React.useContext(UserContext);
  const admin = React.useContext(AdminContext);
  const { sections, title } = props;
  const classes = useStyles();

  const Logout = () =>
  {
    logout(window)
  }

  return (
    <React.Fragment>
      <Toolbar className={classes.Toolbar}>
        <a
          href="/"
          style={{
            textDecoration: "none",
            fontSize: 26,
            fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
            color: "rgb(0 0 0 / 60%)"
          }}
        >
          {title}
        </a>
        <Toolbar
          component="nav"
          variant="dense"
          className={classes.List}
        >
          {sections.map(section => (
            <Link
              color="inherit"
              noWrap
              key={section.title}
              variant="body2"
              href={section.url}
              underline="none"
              sx={{ p: 1, flexShrink: 0 }}
            >
              {section.title}
            </Link>
          ))}
        </Toolbar>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          {admin && (<Link href="/admin"><IconButton><AssignmentIndIcon /></IconButton></Link>)}
          {user
            ? (<IconButton onClick={Logout}><LogoutIcon /></IconButton>)
            : (<>
              <Link href="/user/register" className={classes.Auth}>
                <a style={{
                  textDecoration: "none",
                  fontSize: 16,
                  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                  color: "rgb(0 0 0 / 60%)"
                }}>
                  Register
                </a>
              </Link>
              <Link href="/user/login" className={classes.Auth}>
                <a style={{
                  textDecoration: "none",
                  fontSize: 16,
                  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                  color: "rgb(0 0 0 / 60%)"
                }}>
                  Login
                </a>
              </Link>
            </>)
          }


        </Box>
      </Toolbar>
    </React.Fragment >
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;