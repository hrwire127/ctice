import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Link from 'next/link';

const mainDrawerItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon color="tertiary" />
      </ListItemIcon>
      <Link href="/admin/"><ListItemText primary="AdminIndex" /></Link>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <ShoppingCartIcon color="tertiary"/>
      </ListItemIcon>
      <Link href="/admin/declrlist"><ListItemText primary="Declarations" /></Link>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon color="tertiary"/>
      </ListItemIcon>
      <Link href="/admin/userlist"><ListItemText primary="Users" /></Link>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <ViewCarouselIcon color="tertiary"/>
      </ListItemIcon>
      <Link href="/admin/banner"><ListItemText primary="Create Banner" /></Link>
    </ListItemButton>
  </React.Fragment>
);

const secondaryDrawerItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon color="tertiary"/>
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon color="tertiary"/>
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon color="tertiary"/>
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);

export { secondaryDrawerItems, mainDrawerItems }