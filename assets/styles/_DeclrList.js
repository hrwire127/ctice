import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    Bar: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        margin: "auto",
        ["@media (max-width:510px)"]: {
            flexWrap: "wrap",
            justifyContent: "center"
        },
    },
    Grid: {
        margin: "auto!important",
        width: "90vw!important",
    },
    List: {
        margin: "auto",
        marginTop: 20,
        width: "100%",
        paddingBottom: "50px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 220px)",
        justifyContent: "center",
        gridGap: "20px",
    },
    DrawerList: {
        height: "100vh",
        zIndex: 0,
        backgroundColor: theme.background,
        paddingBottom: 24,
        paddingTop: 24,
        textAlign: "right"
    },
    Body:
    {
        display: 'flex',
        backgroundColor: theme.backgroundSecondary
    },
    Title: {
        color: theme.palette.primary.main
    }
}));

export default useStyles;