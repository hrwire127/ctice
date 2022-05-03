import React, { useState } from 'react'
import DeclrView from '../../components/DeclrView';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { getLimitedComments, timeout, determRendering, getDeclr, setError } from '../../utilsCS/_client'
import useLoading from '../../components/hooks/useLoading'


function view(props)                                                                           
{
    const { declaration } = props;
    const { _id } = declaration;
    const [alert, setAlert] = useState()
    const [comments, setComments] = useState([])
    const [loadingWhile, switchLoading] = useLoading(false)
    const [commentWhile, switchComment] = useLoading(false)
    const [creatingWhile, creatingSwitch] = useLoading(false)

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
        commentWhile(async () =>
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
    />)
}

view.getInitialProps = async (props) =>
{
    const { id } = props.query;

    let declr = await getDeclr(id);

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(declr, window)
        return { declaration: declr.obj }
    }, () =>
    {
        CS_Redirects.tryResSR(declr, props)
        return { declaration: declr.obj }
    })
}



export default view                                                                           