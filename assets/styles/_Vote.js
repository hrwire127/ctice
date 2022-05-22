import { makeStyles } from "@mui/styles"

const useStyles = makeStyles((theme) => ({
    Vote: {
        display: "flex",
        justifyContent: "top",
        flexDirection: "column",
        textAlign: "center",
    },
    VoteBtn: {
        "&:hover": {
            color: theme.palette.base.main,
        },
        fontSize: 55,
        marginBottom: -10,
        marginTop: -10,
    },
}))

export default useStyles;