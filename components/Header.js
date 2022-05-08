import * as React from 'react';
import PropTypes from 'prop-types';
import { Toolbar, Button, IconButton, Typography, InputBase, Box, TextField, Menu, MenuItem } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from 'next/link';
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { LogoutFetch } from '../utilsCS/_client'
import useStyles from "../assets/styles/_Header"



function Header(props)
{
	const userCtx = React.useContext(UserContext);
	const adminCtx = React.useContext(AdminContext);
	const { sections, title } = props;
	const classes = useStyles();

	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (e) =>
	{
		setAnchorEl(e.currentTarget);
	};

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
		<React.Fragment>
			<Box className={classes.Total}>
				<Box className={classes.RedBar} />
				<Toolbar className={classes.Toolbar}>
					<div>
						<IconButton
							id="basic-button"
							aria-controls={open ? 'basic-menu' : undefined}
							aria-haspopup="true"
							aria-expanded={open ? 'true' : undefined}
							onClick={handleClick}
							sx={{ textTransform: "none" }}
						>
							<MenuIcon sx={{ fontSize: 30 }} />
						</IconButton>
						<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
								'aria-labelledby': 'basic-button',
							}}
						>
							<MenuItem onClick={handleClose}>Profile</MenuItem>
							<MenuItem onClick={handleClose}>My account</MenuItem>
							<MenuItem onClick={handleClose}>Logout</MenuItem>
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
						<TextField
							className="search-query"
							sx={{
								width: 200,
							
							}}
							color="primary"
							variant="standard"
							placeholder="Search…"
						/>
						<Box className={classes.Authbar}>
							{adminCtx && (<Link href="/admin"><IconButton><AssignmentIndIcon /></IconButton></Link>)}
							{userCtx
								? (<>
									<Link href="/user/profile"><IconButton><AccountCircleIcon /></IconButton></Link>
									<IconButton onClick={Logout}><LogoutIcon /></IconButton>
								</>)
								: (<>
									<Link href="/user/register" className={classes.Auth}>
										<Button sx={{ borderColor: "#143F6B", color: "#143F6B", textTransform: "none" }} disableElevation variant="outlined">Sign Up</Button>
									</Link>
									<Link href="/user/login" className={classes.Auth}>
										<Button sx={{ backgroundColor: "#143F6B", textTransform: "none" }} disableElevation variant="contained">Sign In</Button>
									</Link>
								</>)
							}
						</Box>
					</Box>
				</Toolbar>
			</Box>
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