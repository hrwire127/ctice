import React, { useEffect, useContext, useState } from 'react'
import AdminContext from '../../components/context/contextAdmin'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import AdminLayout from "../../components/AdminLayout"
import Tags from '../../components/Tags'
import { getTags } from '../../utilsCS/_get'
import { determRendering } from '../../utilsCS/_basic'

function tags(props)
{
    const { setError } = props

    const [tags, setTags] = useState([])
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

        const newTags = await getTags();
        if (newTags.error) return setError(newTags.error)
        else setCount(newTags)
    }, [])


    return adminCtx ? (<AdminLayout>
        <Tags setError={setError} tags={tags} setTags={setTags} />
    </AdminLayout>) : (<></>)
}

tags.getInitialProps = async (props) =>
{
    return { noHeader: true }
}

export default tags