import { makeStyles } from "@mui/styles";

const useStyles = props => makeStyles((theme) => ({
    '@global': {
        '*::-webkit-scrollbar': {
            width: '0.4em'
        },
        '*::-webkit-scrollbar-track': {
            WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: 12
        }
    },
    SelectionsFull:
    {
        flex: 1,
        overflowY: "auto",
        direction: "ltr",
        scrollbarColor: " #d4aa70 #e4e4e4",
        scrollbarWidth: "thin",
    },
    SelectionsGrid:
    {
        marginTop: 20,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 100px)",
        justifyContent: "center",
        gridGap: "20px",
    },
}))

export default useStyles;