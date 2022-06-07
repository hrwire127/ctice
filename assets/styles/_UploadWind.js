import { makeStyles } from "@mui/styles";

const useStyles = props => makeStyles((theme) => ({
    Main: {
        flexGrow: 1,
        bgcolor: 'background.default',
        p: 3,
        paddingRight: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "left"
    },
    SelectionsFull:
    {
        flex: 1,
        overflowY: "auto",
        direction: "ltr",
        scrollbarColor: " #d4aa70 #e4e4e4",
        scrollbarWidth: "thin",
    },
    Window: {
        width: 800,
        height: 400,
        zIndex: 3,
        position: "absolute",
        top: "50%",
        left: "50%",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)"
    },
    Btn: {
        fontSize: 90,
        position: "absolute",
        top: "50%",
        transition: "top 0.1s cubic-bezier(0.72, 1.34, 1, 1)",
        transform: "translate(0, -50%)"
    },
    Profile: {
        width: 200,
        height: 200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
            cursor: "pointer",
        },
        "& div": {
            width: "200%",
            height: "100%",
            background: `linear-gradient(to top, rgb(0 0 0 / 54%), rgb(0 0 0 / 54%)), url(${props.image ? (typeof props.image === 'string' ? props.image : URL.createObjectURL(props.image)) : process.env.NEXT_PUBLIC_DEF_PROFILE_URL
                }
    }) no - repeat center`,
            backgroundSize: "cover",
            borderRadius: 4,
            borderColor: "primary.main",
            boxShadow: "0px 0px 5px 0px",
            transition: "background 1s cubic-bezier(0.72, 1.34, 1, 1)",
        },
        position: "relative"
    },
}))

export default useStyles;