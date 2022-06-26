import React, { useState, useContext, useRef, useEffect } from 'react';
import
{
	Toolbar, Button, IconButton,
	Box, Badge,
} from '@mui/material';
import { Mail, Logout as LogoutIcon, Notifications, AssignmentInd, AccountCircle, Menu } from "@mui/icons-material"
import Link from 'next/link';
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import { LogoutFetch, getClientUser } from '../utilsCS/_get'
import useStyles from "../assets/styles/_Header"
import NotifWindow from './NotifWindow'
import Redirects_CS from '../utilsCS/CS_Redirects'
import useWindowSize from './hooks/useWindowSize';


const Header = (props) => 
{
	const userCtx = useContext(UserContext);
	const adminCtx = useContext(AdminContext);

	const [notifOpen, setNotifOpen] = useState(false);
	const [notifications, setNotificaions] = useState([]);
	const [views, setViews] = useState();

	const [windowMenuSize] = useWindowSize(830, 0);
	const [windowBtnSize] = useWindowSize(380, 0);

	//\/setError
	const { title = "ctice", setError } = props;

	const classes = useStyles();


	useEffect(async () =>
	{
		const user = await getClientUser()

		if (user.obj)
		{
			setNotificaions(user.obj.notifications)
			setViews(user.obj.notifications.filter(n => !n.seen).length)
		}
	}, [])


	return (
		<Box className={classes.Total}>
			<Box className={classes.RedBar} />
			<Toolbar className={classes.Toolbar}>
				<Box
					id="menu-btn"
				>
					{windowMenuSize && (
						<IconButton>
							<Menu />
						</IconButton>)}
				</Box>
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
				</Toolbar>
				<Box className={classes.Tools}>
					<Box className={classes.Authbar}>
						{adminCtx && (<Link href="/admin"><IconButton><AssignmentInd color="tertiary" /></IconButton></Link>)}
						{userCtx
							? (<>
								<Box
								// onBlur={() => setNotifOpen(false)} 
								>
									<IconButton
										// onFocus={() => setNotifOpen(!notifOpen)}
										onClick={() => setNotifOpen(!notifOpen)}
									>
										<Badge badgeContent={views} color="secondary">
											<Notifications color="tertiary" />
										</Badge>
									</IconButton>
									{notifOpen && (<NotifWindow setError={setError} notifications={notifications} setViews={setViews} setNotificaions={setNotificaions} />)}
								</Box>
								<Link href="/user/profile"><IconButton><AccountCircle color="tertiary" /></IconButton></Link>
							</>)
							: (<>
								<Link href="/user/register" className={classes.Auth}>
									<Button className={classes.SignUp} disableElevation size={windowBtnSize ? "small" : "medium"} variant="outlined">Sign Up</Button>
								</Link>
								<Link href="/user/login" className={classes.Auth}>
									<Button className={classes.SignIn} disableElevation size={windowBtnSize ? "small" : "medium"} variant="contained">Sign In</Button>
								</Link>
							</>)
						}
					</Box>
				</Box>
			</Toolbar >
		</Box >
	);
}

export default Header