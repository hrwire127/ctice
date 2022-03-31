import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    Card: {
        width: "220px",
        height: "262px",
        position: 'relative'
    },
    Actions: {
        background: "rgb(2, 0, 36)",
        background: "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 18%)",
        position: "absolute",
        width: "100%",
        height: "60px",
    },
});

export default useStyles;