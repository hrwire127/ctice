import React, { useState, useContext } from 'react';
import
{
	Toolbar, Button, IconButton,
	Box, Menu, MenuItem,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from 'next/link';
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { LogoutFetch, } from '../utilsCS/_get'
import useStyles from "../assets/styles/_Header"


function Header(props)
{
	const userCtx = useContext(UserContext);
	const adminCtx = useContext(AdminContext);
	const { sections, title } = props;
	const classes = useStyles();

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClose = () =>
	{
		setAnchorEl(null);
	};

	const Logout = async () =>
	{
		const res = await LogoutFetch()
		CS_Redirects.tryResCS(res, window)
	}

	return (
		<>
			<Box className={classes.Total}>
				<Box className={classes.RedBar} />
				<Toolbar className={classes.Toolbar}>
					<div>
						<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
								'aria-labelledby': 'basic-button',
							}}
							className={classes.DropDown}
						>
							<MenuItem color="primary" onClick={handleClose}>Profile</MenuItem>
							<MenuItem color="primary" onClick={handleClose}>My account</MenuItem>
							<MenuItem color="primary" onClick={handleClose}>Logout</MenuItem>
						</Menu>
					</div>
					<Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
						<a href="/" className={classes.Brand}>
							{title}
						</a>
					</Box>
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
					<Box className={classes.Tools}>
						<Box className={classes.Authbar}>
							{adminCtx && (<Link href="/admin"><IconButton><AssignmentIndIcon color="tertiary" /></IconButton></Link>)}
							{userCtx
								? (<>
									<Link href="/user/profile"><IconButton><AccountCircleIcon color="tertiary" /></IconButton></Link>
									<IconButton onClick={Logout}><LogoutIcon color="tertiary" /></IconButton>
								</>)
								: (<>
									<Link href="/user/register" className={classes.Auth}>
										<Button className={classes.SignUp} disableElevation variant="outlined">Sign Up</Button>
									</Link>
									<Link href="/user/login" className={classes.Auth}>
										<Button className={classes.SignIn} disableElevation variant="contained">Sign In</Button>
									</Link>
								</>)
							}
						</Box>
					</Box>
				</Toolbar>
			</Box >
		</>
	);
}

export default Header