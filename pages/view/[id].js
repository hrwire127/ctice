import React, { useState } from 'react'
import DeclrView from '../../components/DeclrView';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { getLimitedComments, timeout, determRendering, getDeclr, getClientUser } from '../../utilsCS/_client'
import useLoading from '../../components/hooks/useLoading'


function view(props)                                                                           
{
    const { declaration, user } = props;
    const { _id } = declaration;
    const [alert, setAlert] = useState()
    const [comments, setComments] = useState([])
    const [loadingWhile, switchLoading] = useLoading(false)
    const [commentWhile, switchComment] = useLoading(false)
    const [creatingWhile, creatingSwitch] = useLoading(false)
    const [loadMoreWhile, loadMoreSwitch] = useLoading(false)

    const setError = (msg) => 
    {
        setAlert(msg)
        setTimeout(() =>
        {
            setAlert()
        }, 9000);
    }

    const onDeclrDelete = async (e) =>                                                                           
    {
        e.preventDefault();
        loadingWhile(async () =>
        {
            await timeout(500)
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                    if (res.err) setError(res.err.message)
                })
        })

    }

    const handleSubmit = async (body) =>
    {
        creatingWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${_id}/comment/`, {
                method: 'POST',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                    if (res.err) setError(res.err.message)
                })
        })

    };

    function loadMore(e)
    {
        e.preventDefault()
        loadMoreWhile(async () =>
        {
            await timeout(500)
            const newComments = await getLimitedComments(comments, _id);
            CS_Redirects.tryResCS(newComments, window)
            setComments(comments.concat(newComments.obj));
        })
    }

    return switchLoading(2, () => <DeclrView
        declaration={declaration}
        onDeclrDelete={onDeclrDelete}
        creatingSwitch={creatingSwitch}
        alert={alert}
        handleSubmit={handleSubmit}
        comments={comments}
        setComments={setComments}
        loadMore={loadMore}
        switchComment={switchComment}
        commentWhile={commentWhile}
        loadMoreSwitch={loadMoreSwitch}
        user={user}
    />)
}

view.getInitialProps = async (props) =>
{
    const { id } = props.query;

    let declr = await getDeclr(id);

    const user = await getClientUser();

    console.log(user)
    console.log(user.obj ? user.obj : undefined)

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(declr, window)
        return { declaration: declr.obj, user: user.obj ? user.obj : undefined }
    }, () =>
    {
        CS_Redirects.tryResSR(declr, props)
        return { declaration: declr.obj, user: user.obj ? user.obj : undefined }
    })
}



export default view                                                                           