import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    Card: {
        width: 220,
        height: 250,
        position: 'relative'
    },
    Actions: {
        display: "flex",
        justifyContent: "space-between",
        background: "rgb(255,255,255)",
        background: "linear-gradient(180deg, rgb(255 255 255) 0%, rgba(0,0,0,1) 0%, rgb(255 255 255 / 26%) 0%, rgb(255 255 255 / 80%) 5%, rgb(255 255 255 / 100%) 10%)",
        position: "absolute",
        width: "93%",
        height: 40,
    },
    Title: {
        fontSize: 16,
        fontWeight: 600
    },
    Icon: {
        width: 20, 
        height: 20 
    }
});

export default useStyles;