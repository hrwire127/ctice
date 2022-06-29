import { makeStyles } from "@mui/styles";

const useStyles = props => makeStyles((theme) => ({
    Upload: {
        textAlign: "center"
    },
    Profile: {
        width: 200,
        height: 200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "& img": {
            width: "200%",
            height: "100%",
            // background: `linear-gradient(to top, rgb(0 0 0 / 54%), rgb(0 0 0 / 54%)), url(${props.image ? (typeof props.image === 'string' ? props.image : URL.createObjectURL(props.image)) : process.env.NEXT_PUBLIC_DEF_PROFILE_URL}) no-repeat center`,
            backgroundSize: "cover",
            borderRadius: 4,
            borderColor: "primary.main",
            boxShadow: "0px 0px 5px 0px",
            transition: "background 1s cubic-bezier(0.72, 1.34, 1, 1)",
        },
        position: "relative"
    },
    Actions: {
        marginTop: 12,
        display: "flex",
        justifyContent: "space-evenly"
    }
}))

export default useStyles;