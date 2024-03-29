import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    List: {
        margin: "auto",
        width: "100%",
        paddingBottom: "50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        alignSelf: "baseline",
        overflow: "auto",
        // display: "grid",
        // gridTemplateColumns: "repeat(auto-fill, 220px)",
        // justifyContent: "left",
        // gridGap: "20px",
    },
});

export default useStyles;