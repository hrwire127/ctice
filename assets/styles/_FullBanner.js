import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    Banner: {
        width: "80vw",
        height: "80vh",
        zIndex: 4,
        position: "absolute",
        top: "50%",
        left: "50%",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)"
    }
}))

export default useStyles;