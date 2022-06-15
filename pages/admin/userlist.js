import React, { useEffect, useContext } from 'react'
import AdminContext from '../../components/context/contextAdmin'
import AdminUsers from '../../components/AdminUsers';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { getUsers } from '../../utilsCS/_get'
import AdminLayout from "../../components/AdminLayout"
import handleError from '../../components/custom/handleError';

const userlist = (props) => handleError(props, function (props)
{
    const [users, setUsers] = useState([])

    let adminCtx = useContext(AdminContext);

    useEffect(async () =>
    {
        if (props.isAdmin)
        {
            adminCtx = props.isAdmin
        }

        if (!adminCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`, window)
        }

        const newUsers = await getUsers()
        CS_Redirects.tryResCS(newUsers, window)
        setUsers(newUsers.obj)
    }, [])


    return adminCtx ? (<AdminLayout><AdminUsers users={users} /></AdminLayout>) : (<></>)
})

userlist.getInitialProps = async (props) =>
{
    return { noHeader: true }
}
export default userlist