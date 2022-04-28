import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
	Toolbar: {
		borderBottom: 1,
		borderColor: 'divider',
		typography: 'body1',
		backgroundColor: "white",
        ["@media (max-width:467px)"]: {
			minHeight: 80
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
	}
})

export default useStyles;