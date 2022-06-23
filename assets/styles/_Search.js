import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
	Search: {
		width: 200,
		"& input": {
			color: theme.palette.text.secondary,
		},
		"& :hover:not(.Mui-disabled):before ": {
			borderBottom: `2px solid ${theme.palette.text.secondary}`
		}
	},
}))

export default useStyles;