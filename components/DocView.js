import React, { useState, useEffect } from 'react'
import parse from 'html-react-parser';

function DocView(props)
{
    const { url } = props

    useEffect(() =>
    {
        fetch(url)
            .then(res => res.text())
            .then(res => setHtml(res))
            .catch(err => console.log(err))
    }, [])

    const [html, setHtml] = useState("")

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
}

export default DocView