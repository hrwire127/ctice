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
        background: "rgb(2, 0, 36)",
        background: "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 18%)",
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