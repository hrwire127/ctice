import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    Container: {
        display: "flex",
        alignItems: "center" 
    },
    Date: {
        width: 200,
    },
    Btn:
    {
        color: theme.text
    },
    TextField:
    {
        "& label":
        {
            color: theme.palette.primary.main
        },
        "& button":
        {
            color: theme.text
        }
    }
}))


export default useStyles;