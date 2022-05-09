import * as React from 'react';
import PropTypes from 'prop-types';
import
{
	Toolbar, Button, IconButton,
	Typography, InputBase, Box, TextField, Menu,
	MenuItem, InputAdornment
} from '@mui/material';
import { styled, alpha, ThemeProvider, createTheme } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from 'next/link';
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { LogoutFetch } from '../utilsCS/_client'
import useStyles from "../assets/styles/_Header"

// const Title = styled(Checkbox)(({ theme }) => ({
// 	color: theme.status.danger,
// 	'&.Mui-checked': {
// 	  color: theme.status.danger,
// 	},
//   }));


function Header(props)
{
	const userCtx = React.useContext(UserContext);
	const adminCtx = React.useContext(AdminContext);
	const { sections, title, toggleTheme } = props;
	const classes = useStyles();

	const [anchorEl, setAnchorEl] = React.useState(null);
	const [inputValue, setInputValue] = React.useState("");
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
							<MenuIcon color="primary" sx={{ fontSize: 30 }} />
						</IconButton>
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
						<TextField
							className={`${classes.Search} search-query`}
							color="primary"
							variant="standard"
							placeholder="Search…"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							InputProps={{
								endAdornment:
									<InputAdornment position="end" sx={inputValue === "" ? { display: "none" } : {}}>
										<IconButton
											className="query-clear"
											onClick={() =>
											{
												setInputValue("")
											}}
											edge="end"
										>
											<ClearIcon color="primary"/>
										</IconButton>
									</InputAdornment>
							}}

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
										<Button className={classes.SignUp} disableElevation variant="outlined">Sign Up</Button>
									</Link>
									<Link href="/user/login" className={classes.Auth}>
										<Button className={classes.SignIn} disableElevation variant="contained">Sign In</Button>
									</Link>
								</>)
							}
						</Box>
						<Button onClick={toggleTheme}>Theme</Button>
					</Box>
				</Toolbar>
			</Box >
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

export default Header