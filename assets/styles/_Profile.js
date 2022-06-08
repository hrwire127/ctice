import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    TextArea:
    {
        width: "100%",
        height: 250,
        padding: 20,
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
}));

export default useStyles;