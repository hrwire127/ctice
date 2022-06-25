import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    Card: {
        width: "100%",
        position: 'relative'
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
        height: 1,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: theme.line,
        alignSelf: "stretch"
    },
    Container: {
        display: "flex", 
        gap: 20, 
        maxHeight: "100vh"
    },
    FooterBar: {
        display: 'flex', 
        justifyContent: "space-between", 
        gap: 4,
        width: "100%", 
        marginTop: 8,
        flexWrap: "wrap"
    }
}));

export default useStyles;