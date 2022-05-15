import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    Link: {
        '&:hover': {
            cursor: "pointer",
        },
        color: theme.palette.tertiary.main
    }
}));

export default useStyles; 