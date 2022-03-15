import * as React from 'react';
import PropTypes from 'prop-types';
import { Toolbar, Button, IconButton, Typography, Link } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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
  }
})

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
        <IconButton>
          <SearchIcon />
        </IconButton>
        <Link href="#" underline="none">
          Sign Up
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