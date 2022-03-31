import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    Container: {
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    Form: {
        width: "100%",
        marginTop: 8,
    },
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