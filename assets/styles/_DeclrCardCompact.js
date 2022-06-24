import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    Content: {
        height: theme.cardHeight,
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        gap: 10,
    },
    Card: {
        width: "80%",
        height: 55,
        position: 'relative',
        backgroundColor: theme.card,
        color: theme.palette.tertiary.main,
        backgroundImage: "none",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    BookmarkCard: {
        width: "80%",
        height: 55,
        position: 'relative',
        backgroundColor: theme.card,
        color: theme.palette.tertiary.main,
        backgroundImage: "none",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        ["@media (max-width:520px)"]: {
            width: "100%",
        },
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
        color: theme.palette.info.dark,
        "&:hover":
        {
            cursor: "pointer",
            textDecoration: "underline",
            color: theme.palette.text.info
        },
    },
    Icon: {
        width: 20,
        height: 20,
        color: theme.text
    }
}))

export default useStyles;