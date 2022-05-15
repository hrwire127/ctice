import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    DrawerList: {
        textAlign: "right",
        position: "sticky",
        overflowY: "auto",
        width: "auto",
        top: 24
    },
    Body:
    {
        display: 'flex',
        paddingLeft: theme.maxPadding,
        paddingRight: theme.maxPadding,
        height: "100%"
    },
    ItemButton: {
        backgroundColor: theme.palette.shadow,
        paddingRight: 0
    },
    Line: {
        width: 4,
        backgroundColor: theme.palette.primary.main,
        alignSelf: "stretch"
    },
    Drawer: {
        width: theme.drawerWidth,
        flexShrink: { sm: 0 },
        height: "100%",
        borderRight: `2px solid ${theme.line}`,
        paddingBottom: 24,
        paddingTop: 24,
        zIndex: 0,
    },
    Content: {
        flexGrow: 1,
        padding: 24,
        width: theme.drawerWidth
    }
}))

export default useStyles;