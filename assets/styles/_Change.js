import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    FrontInfo: {
        display: 'flex',
        justifyContent: "left",
        gap: 24,
        alignItems: "center",
        flexWrap: "wrap",
        ["@media (max-width:580px)"]: {
            justifyContent: "center",
        },
    },
    SecInfo: {
        flex: 1,
        ["@media (max-width:580px)"]: {
            textAlign: "center",
            justifyContent: "center"
        },
    },
    Profile: {
        width: "200px",
        height: "200px",
        boxShadow: "0 0 10px -7px",
        "&:hover": {
            cursor: "pointer"
        }
    },
    Connections: {
        marginTop: 20,
        gap: 10,
        display: 'flex',
        justifyContent: "space-between",
        alignItems: "stretch",
        ["@media (max-width:730px)"]: {
            flexDirection: "column",
            justifyContent: "center",
        },
    }
}));

export default useStyles;