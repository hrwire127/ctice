import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    Card: {
        width: "80%",
        position: 'relative',
    },
    Actions: {
        display: "flex",
        justifyContent: "space-between",
        background: `linear-gradient(180deg, #1e1e1e00 0%, ${theme.top} 10%, ${theme.top} 0%)`,
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
        color: theme.palette.primary.main,
    },
    Line: {
        width: "100%",
        height: 2,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: theme.line,
        alignSelf: "stretch"
    },
}));

export default useStyles;