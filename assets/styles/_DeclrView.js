import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    Container: {
        flexGrow: 1,
        padding: "24px",
        maxWidth: theme.containerMaxWidth
    },
    BtnGroup: {
        margin: "auto",
        display: "flex",
        justifyContent: "space-between",
        width: "200px",
    },
    FlexFill: {
        flex: "1 1 auto !important",
    },
    Paragraph: {
        // padding: "30px",
        // display: "flex",
        // flexDirection: "column",
        // gap: "20px",
        width: "100%",
        display: "flex",
        justifyContent: "space-evenly"
    },
    Bar: {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap"
    },
    Content: {
        display: "flex",
        justifyContent: "space-evenly",
    },
    FullWidth: {
        width: '100%'
    },
    Line: {
        width: "100%",
        height: 1,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: theme.line,
        alignSelf: "stretch"
    },
    Title: {
        display: "flex",
        justifyContent: "left",
        flexWrap: "wrap"
    },
    Body: {
        display: "flex",
        gap: 2,
        maxHeight: "100vh",
    },
    Vote: {
        display: 'flex',
        flexDirection: "column",
        alignItems: "center"
    },
    Tags: {
        display: 'flex',
        justifyContent: "left",
        marginBottom: 4,
        marginTop: 4
    },
    Social: {
        marginBottom: 4,
        display: 'flex',
        justifyContent: "space-between",
        alignItems: "baseline",
        justifyContent: "left",
        gap: 1
    },
    Share: {
        width: 40,
        height: 40,
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        "& svg": { margin: 0 }
    },
    LastRow: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        rowGap: 12,
        gap: 12,
        alignItems: "center"
    },
    Authors: {
        display: 'flex',
        justifyContent: "center",
        gap: 12,
        flexWrap: "wrap",
        ["@media (max-width:410px)"]: {
            justifyContent: "left",
        },
    },
    Author: {
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "auto",
        padding: 12
    }
}));

export default useStyles;