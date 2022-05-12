import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    DrawerList: {
        height: "100vh",
        zIndex: 0,
        backgroundColor: "background.default",
        borderRight: `2px solid ${theme.line}`,
        paddingBottom: 24,
        paddingTop: 24,
        textAlign: "right",
        color: theme.palette.textColor,
    },
    Body:
    {
        display: 'flex',
        paddingLeft: theme.maxPadding,
    },
    ItemButton: {
        backgroundColor: theme.palette.shadow,
        paddingRight: 0
    },
    Line: {
        width: 6,
        backgroundColor: theme.palette.primary.main,
        alignSelf: "stretch"
    }
}))

export default useStyles;