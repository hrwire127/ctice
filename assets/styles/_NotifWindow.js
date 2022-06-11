import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    Full:
    {
        width: 200,
        height: 300,
        position: "absolute",
        top: 60,
        overflow: "auto",
        overflowY: "auto",
        direction: "ltr",
        scrollbarColor: " #d4aa70 #e4e4e4",
        scrollbarWidth: "thin",
        '&::-webkit-scrollbar': {
            width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
            WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: 12
        }
    },
}))

export default useStyles;