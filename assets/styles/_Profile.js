import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    TextArea:
    {
        width: "100%",
        minHeight: 150,
        padding: 20,
        border: `1px solid ${theme.line}`,
        borderRadius: 4,
        overflowY: "auto",
        direction: "ltr",
        scrollbarColor: " #d4aa70 #e4e4e4",
        scrollbarWidth: "thin",
        '&::-webkit-scrollbar': {
            width: '0.4em',
        },
        '&::-webkit-scrollbar-track': {
            WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: 12
        }
    },
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
    Username: {
        textAlign: "left",
        ["@media (max-width:580px)"]: {
            textAlign: "center",
            fontSize: 80
        },
    },
    SecInfo: {
        flex: 1,
        ["@media (max-width:580px)"]: {
            textAlign: "center",
            justifyContent: "center"
        },
    },
    Status: {
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        ["@media (max-width:580px)"]: {
            justifyContent: "center",
        },
    },
    ThirdInfo:
    {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        marginTop: 4,
        ["@media (max-width:580px)"]: {
            justifyContent: "center",
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
    Img: {
        width: "200px",
        height: "200px",
        borderRadius: 4
    },
    Name: {
        display: 'flex',
        justifyContent: "left",
        alignItems: "center",
        marginTop: 4,
        ["@media (max-width:580px)"]: {
            justifyContent: "center",
        },
    },
    Connection: {
        width: 70,
        minHeight: 70,
        display: 'flex',
        justifyContent: "center",
        alignItems: "center"
    }
}));

export default useStyles;