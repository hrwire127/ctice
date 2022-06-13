import React, { useState, useEffect } from 'react'
import parse from 'html-react-parser';

function DocView(props)
{
    const { url, raw } = props
    const [html, setHtml] = useState("")

    useEffect(() =>
    {
        console.log(url)
        if (url)
        {
            console.log("!!")
            fetch(url)
                .then(res => res.text())
                .then(res => setHtml(res))
                .catch(err => console.log(err))
        }
        else
        {
            console.log("222")
            setHtml(raw)
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
}

export default DocView