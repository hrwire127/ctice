import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    Content: {
        height: theme.cardHeight
    },
    Card: {
        width: 220,
        height: 195,
        position: 'relative',
        backgroundColor: theme.card,
        color: theme.palette.tertiary.main,
        backgroundImage: "none"
    },
    Actions: {
        display: "flex",
        justifyContent: "space-between",
        background: `linear-gradient(180deg, #1e1e1e00 0%, ${theme.card} 10%, ${theme.card} 0%)`,
        position: "absolute",
        width: "100%",
        height: 40,
        "& button": {
            color: theme.palette.primary.main,
        }
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
    },
    Upper: {
        height: 160,
    },
    Top:
    {
        display: "flex",
        justifyContent: "space-between"
    }
}))

export default useStyles;