import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    Upload: {
        width: 100,
        height: 100,
        "&:hover": {
            cursor: "pointer",
            borderWidth: 2,
            "& svg": {
                fontSize: 30
            }
        },
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
    }
}))

export default useStyles;