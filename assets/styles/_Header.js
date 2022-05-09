import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
	Toolbar: {
		borderBottom: 1,
		minHeight: 60,
		borderColor: 'divider',
		typography: 'body1',
		backgroundColor: theme.background.primary,
		["@media (max-width:467px)"]: {
			minHeight: 60
		},
		paddingLeft: 80,
		paddingRight: 80,
		["@media (max-width:740px)"]: {
			paddingLeft: 10,
			paddingRight: 10,
		},
	},
	List: {
		flex: 1,
		justifyContent: 'space-evenly',
		overflowX: 'auto'
	},
	Profile: {
		transition: "transform 0.4s",
		"&:hover":
		{
			transform: "scale(1.2)",
			cursor: "pointer",
		}
	},
	Auth: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: 40,
		height: 40
	},
	Authbar: {
		display: "flex",
		justifyContent: "space-between",
		gap: 20,
		["@media (max-width:553px)"]: {
			gap: 0,
		},
		["@media (max-width:740px)"]: {
			marginLeft: 20
		},
	},
	Tools: {
		display: "flex",
		justifyContent: "space-between",
		gap: 50,
		alignItems: "center",
		["@media (max-width:500px)"]: {
			flexWrap: "wrap",
			gap: 10,
			justifyContent: "center",
		},
		["@media (max-width:740px)"]: {
			gap: 0,
		},
	},
	Total: {
		display: 'flex',
		justifyContent: "center",
		flexDirection: "column",
		width: "100%",
		boxShadow: "0px 0px 10px -7px"
	},
	RedBar: {
		width: "100vw",
		height: 3,
		background: "rgb(255, 255, 255)",
		background: theme.gradient
	},
	Brand: {
		fontFamily: theme.title.font,
		margin: "auto",
		textDecoration: "none",
		fontSize: theme.title.size,
		fontWeight: theme.title.weight,
		color: theme.title.color,
		margin: "auto",
		textDecoration: "none",
	},
	SignIn: {
		backgroundColor: "primary",
		textTransform: "none",
		"&:hover": {
			backgroundColor: "secondary"
		}
	},
	SignUp: {
		borderColor: "primary",
		color: "primary",
		textTransform: "none",
		"&:hover": {
			borderColor: "secondary",
			backgroundColor: "secondary",
		}
	},
	Search: {
		width: 200,
		color: theme.background.secondary,
		["@media (max-width:534px)"]: {
			width: 100,
		},
		["@media (max-width:452px)"]: {
			width: 200,
		},
	},
	DropDown: {
		"& ul":
		{
			backgroundColor: theme.background.primary,
		}
	}
}))

export default useStyles;