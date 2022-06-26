import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    Table: {
        "& td": {
            color: theme.palette.text.default
        }
    }
}));

module.exports = useStyles