import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    Bar: {
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        width: "90vw",
        margin: "auto",
    },
    Grid: {
        margin: "auto!important",
        width: "90vw!important",
    },
    List: {
        margin: "auto",
        width: "90vw",
        paddingBottom: "50px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 220px)",
        justifyContent: "center",
        gridGap: "20px",
    },
});

export default useStyles;