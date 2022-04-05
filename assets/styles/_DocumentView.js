import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    Document: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center"
    },
    ToolBar: {
        display: "flex",
        justifyContent: "space-evenly",
        width: "100%"
    },
    Content: {
        display: "flex",
        justifyContent: "center",
        "& .annotationLayer":
        {
            position: "absolute"
        }
    }
});

export default useStyles;