import { makeStyles } from "@mui/styles";

const useStyles = (props, preparedImg) => makeStyles((theme) => ({
    Profile: {
        width: 200,
        height: 200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
            cursor: "pointer",
            "& div": {
                background: `linear-gradient(to top, rgb(0 0 0 / 71%), rgb(0 0 0 / 71%)), url(${preparedImg}) no-repeat center`,
            },
            "& svg": {
                top: "30%",
            }
        },
        "& div": {
            width: "200%",
            height: "100%",
            background: `linear-gradient(to top, rgb(0 0 0 / 54%), rgb(0 0 0 / 54%)), url(${preparedImg}) no-repeat center`,
            backgroundSize: "cover",
            borderRadius: 4,
            borderColor: "primary.main",
            boxShadow: "0px 0px 5px 0px",
            transition: "background 1s cubic-bezier(0.72, 1.34, 1, 1)",
        },
        position: "relative"
    },
    UploadBtn: {
        fontSize: 90,
        position: "absolute",
        top: "50%",
        transition: "top 0.1s cubic-bezier(0.72, 1.34, 1, 1)",
        transform: "translate(0, -50%)"
    }
}))

export default useStyles;