import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    UploadBtn: {
        borderColor: "rgb(175, 175, 175)",
        color: "rgb(30, 30, 30)",
        flex: 1,
        "&:hover": {
            borderColor: "black",
        },
    },
    Upload: {
        display: "flex",
        marginTop: 8,
    },
});


export default useStyles;