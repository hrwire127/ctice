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
import AddAlertIcon from '@mui/icons-material/AddAlert';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import Link from 'next/link';
import StyleIcon from '@mui/icons-material/Style';

const mainDrawerItems = (
  <React.Fragment>
    <Link href="/admin/">
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon color="tertiary" />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
    </Link>
    <Link href="/admin/declrlist">
      <ListItemButton>
        <ListItemIcon>
          <ShoppingCartIcon color="tertiary" />
        </ListItemIcon>
        <ListItemText primary="Declarations" />
      </ListItemButton>
    </Link>
    <Link href="/admin/userlist">
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon color="tertiary" />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItemButton>
    </Link>
    <Link href="/admin/banner/create">
      <ListItemButton>
        <ListItemIcon>
          <ViewCarouselIcon color="tertiary" />
        </ListItemIcon>
        <ListItemText primary="Create Banner" />
      </ListItemButton>
    </Link>
    <Link href="/admin/notification">
      <ListItemButton>
        <ListItemIcon>
          <AddAlertIcon color="tertiary" />
        </ListItemIcon>
        <ListItemText primary="Create Notification" />
      </ListItemButton>
    </Link>
    <Link href="/admin/banner/list">
      <ListItemButton>
        <ListItemIcon>
          <BackupTableIcon color="tertiary" />
        </ListItemIcon>
        <ListItemText primary="Banner List" />
      </ListItemButton>
    </Link>
    <Link href="/admin/tags">
      <ListItemButton>
        <ListItemIcon>
          <StyleIcon color="tertiary" />
        </ListItemIcon><ListItemText primary="Tags" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);

export { mainDrawerItems }