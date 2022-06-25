import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    '@global': {
        '*::-webkit-scrollbar': {
            width: '0.4em',
        },
        '*::-webkit-scrollbar-track': {
            WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: 12
        }
    },
    DrawerList: {
        textAlign: "right",
        position: "sticky",
        overflowY: "auto",
        top: 24
    },
    Body:
    {
        display: 'flex',
        paddingLeft: theme.maxPadding,
        paddingRight: theme.maxPadding,
        ["@media (max-width:1300px)"]: {
            paddingLeft: theme.minPadding,
            paddingRight: theme.minPadding,
        },
        ["@media (max-width:960px)"]: {
            paddingLeft: 0,
            paddingRight: 0,
        },
        ["@media (max-width:830px)"]: {
            paddingLeft: 0,
            paddingRight: 0,
        },
        height: "100%",
        flex: 1
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
        borderRight: `1px solid ${theme.line}`,
        paddingBottom: 24,
        paddingTop: 24,
        zIndex: 0,
    },
    Content: {
        flexGrow: 1,
        padding: 24,
        width: theme.drawerWidth,
        ["@media (max-width:960px)"]: {
            paddingRight: 60,
        },
        ["@media (max-width:830px)"]: {
            paddingLeft: 60,
        },
    },
    Banners: {
        display: "flex",
        flexDirection: "column",
    }
}))

export default useStyles;