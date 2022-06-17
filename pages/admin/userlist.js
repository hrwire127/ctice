import React, { useEffect, useContext } from 'react'
import AdminContext from '../../components/context/contextAdmin'
import AdminUsers from '../../components/AdminUsers';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { getUsers } from '../../utilsCS/_get'
import AdminLayout from "../../components/AdminLayout"

function userlist(props)
{
    const { setError } = props

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
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`)
        }

        const newUsers = await getUsers();
        if (newUsers.error) return setError(newUsers.error)
        else setUsers(newUsers)
    }, [])


    return adminCtx ? (<AdminLayout>
        <AdminUsers newUsers={newUsers} users={users} />
    </AdminLayout>) : (<></>)
}

userlist.getInitialProps = async (props) =>
{
    return { noHeader: true }
}

export default userlist