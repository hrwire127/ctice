import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    List: {
        margin: "auto",
        width: "10vw",
        paddingBottom: "50px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 220px)",
        justifyContent: "center",
        gridGap: "20px",
    },
});

export default useStyles;