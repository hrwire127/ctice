import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
    ContainerNormal: {
        width: 100,
        height: 100,
        position: "relative",
        "& img": {
            width: "100%",
            height: "100%",
            // background: `linear-gradient(to top, rgb(0 0 0 / 54%), rgb(0 0 0 / 54%)), url(${image}) no-repeat center`,
            backgroundSize: "cover",
            borderRadius: 1,
            borderColor: "primary.main",
            boxShadow: "0px 0px 5px 0px",
        },
    },
    Check: {
        fontSize: 90,
        position: "absolute",
        top: "0%",
        left: "6%"
    },
    ContainerChecked: {
        width: 100,
        height: 100,
        "&:hover": {
            cursor: "pointer",
            "& img": {
                // background: `linear-gradient(rgb(0 0 0 / 71%), rgb(0 0 0 / 71%)), url(${image}) no-repeat center`,
                backgroundSize: "cover",
            }
        },
        "& img": {
            width: "100%",
            height: "100%",
            // background: `url(${image}) no-repeat center`,
            backgroundSize: "cover",
            borderRadius: 1,
            borderColor: "primary.main",
            boxShadow: "0px 0px 5px 0px",
        },
    }
}));


export default useStyles;