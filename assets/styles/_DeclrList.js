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
        "& button": {
			color: theme.palette.tertiary.main
        }
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
    Title: {
        color: theme.palette.primary.main
    }
}));

export default useStyles;