import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
	Toolbar: {
		borderBottom: 1,
		minHeight: 60,
		backgroundColor: theme.top,
		["@media (max-width:467px)"]: {
			minHeight: 60
		},
		paddingLeft: theme.maxPadding,
		paddingRight: theme.maxPadding,
		["@media (max-width:740px)"]: {
			paddingLeft: theme.minPadding,
			paddingRight: theme.minPadding,
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
		boxShadow: `0px 0px 10px -7px ${theme.palette.primary.main}`,
		zIndex: 1
	},
	RedBar: {
		width: "100%",
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
		textTransform: "none",
		"&:hover": {
			backgroundColor: theme.palette.tertiary.main
		},
	},
	SignUp: {
		textTransform: "none",
	},
	DropDown: {
		"& ul":
		{
			backgroundColor: "background",
		}
	}
}))

export default useStyles;