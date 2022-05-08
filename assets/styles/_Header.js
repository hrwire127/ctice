import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
	Toolbar: {
		borderBottom: 1,
		minHeight: 60,
		borderColor: 'divider',
		typography: 'body1',
		backgroundColor: "white",
		["@media (max-width:467px)"]: {
			minHeight: 80
		},
		paddingLeft: 80,
		paddingRight: 80
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
		gap: 20
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
		background: "linear-gradient(274deg, rgba(255,255,255,0) 0%, rgba(0,0,0,1) 0%, rgba(254,177,57,1) 0%, rgba(245,83,83,1) 100%)"
	},
	Brand: {
		margin: "auto",
		textDecoration: "none",
		fontSize: 22,
		fontWeight: 600,
		fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
		color: "rgb(0 0 0 / 60%)",
		transition: "font-size 0.2s",
		"&:hover": {
			fontSize: 23
		}
	}
})

export default useStyles;