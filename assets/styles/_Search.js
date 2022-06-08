import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
	Search: {
		width: 200,
		"& input": {
			color: theme.palette.text.secondary,
		},
		["@media (max-width:534px)"]: {
			width: 100,
		},
		["@media (max-width:452px)"]: {
			width: 200,
		},
		"& :hover:not(.Mui-disabled):before ": {
			borderBottom: `2px solid ${theme.palette.text.secondary}`
		}
	},
}))

export default useStyles;