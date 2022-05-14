import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    DrawerList: {
        height: "100%",
        zIndex: 0,
        borderRight: `2px solid ${theme.line}`,
        paddingBottom: 24,
        paddingTop: 24,
        textAlign: "right",
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
        flexShrink: { sm: 0 }
    },
    Content: {
        flexGrow: 1,
        padding: 24,
        width: { sm: `calc(100% - ${theme.drawerWidth}px)` }
    }
}))

export default useStyles;