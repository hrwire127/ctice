import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    Card: {
        width: 220,
        height: 207,
        position: 'relative',
        backgroundColor: theme.background
    },
    Actions: {
        display: "flex",
        justifyContent: "space-between",
        background: "rgb(255,255,255)",
        background: `linear-gradient(180deg, rgb(255 255 255) 0%, ${theme.background} 0%, ${theme.background} 10%)`,
        position: "absolute",
        width: "93%",
        height: 40,
    },
    Title: {
        fontSize: 16,
        fontWeight: 600,
        color: theme.palette.primary.main
    },
    Icon: {
        width: 20,
        height: 20,
        color: theme.text
    }
}))

export default useStyles;