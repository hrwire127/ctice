import * as React from 'react';
import PropTypes from 'prop-types';
import { Toolbar, Button, IconButton, Typography, Link, InputBase } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  Toolbar: {
    borderBottom: 1,
    borderColor: 'divider',
    typography: 'body1',
    backgroundColor: "white"
  },
  List: {
    flex: 1,
    justifyContent: 'space-evenly',
    overflowX: 'auto'
  },
  Profile: {
    transition: "width 0.4s",
    transition: "height 0.4s",
    "&:hover":
    {
      width: 30,
      height: 30
    }
  }
})

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
  const { sections, title } = props;
  const classes = useStyles();
  return (
    <React.Fragment>
      <Toolbar className={classes.Toolbar}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          noWrap
        >
          {title}
        </Typography>
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
        <Link sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: 30, height: 30 }} href="#">
          <AccountCircleIcon color="action" className={classes.Profile} />
        </Link>
      </Toolbar>
    </React.Fragment>
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