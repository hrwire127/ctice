import React, { useEffect, useContext, useState } from 'react'
import AdminContext from '../../components/context/contextAdmin'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import AdminLayout from "../../components/AdminLayout"
import Tags from '../../components/Tags'
import { getTags } from '../../utilsCS/_get'
import { determRendering } from '../../utilsCS/_basic'
import Redirects_CS from '../../utilsCS/CS_Redirects'
import handleAsync from '../../components/custom/handleAsync'

const tags = (props) => handleAsync(props, (props) => 
{
    const { setError, Mounted } = props

    const [tags, setTags] = useState(props.tags)
    let adminCtx = useContext(AdminContext);

    console.log(tags)

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
    }, [])


    return adminCtx ? (<AdminLayout>
        <Tags setError={setError} tags={tags} setTags={setTags} />
    </AdminLayout>) : (<></>)
})

tags.getInitialProps = async (props) =>
{
    const tags = await getTags(); //<== handle async
    if (tags.error) return { error: tags.error }
    return { noHeader: true, tags: tags.obj }
}

export default tags