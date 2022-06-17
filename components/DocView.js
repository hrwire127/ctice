import React, { useState, useEffect } from 'react'
import parse from 'html-react-parser';
import handleAsync from './custom/handleAsync'

const DocView = (props) => handleAsync(props, (props) =>
{
    const { url, raw, Mounted } = props
    const [html, setHtml] = useState("")

    useEffect(() =>
    {
        if (url)
        {
            fetch(url)
                .then(res => res.text())
                .then(res => 
                {
                    if (Mounted) setHtml(res)
                })
                .catch(err => console.log(err))
        }
        else
        {
            if (Mounted) setHtml(raw)
        }
    }, [])


    const options = {
        replace: (domNode) =>
        {
            if (domNode.attribs && domNode.attribs.class === 'remove')
            {
                return <></>;
            }
        },
    };

    return parse(html, options)
})

export default DocView