import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    UploadBtn: {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        flex: 1,
        "&:hover": {
            borderColor: theme.palette.text.default,
        },
    },
    Upload: {
        display: "flex",
        marginTop: 8,
    },
}));


export default useStyles;