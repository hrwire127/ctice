import * as React from 'react'; //<M+
import ErrorPage from './ErrorPage'

class ErrorBoundary extends React.Component
{
    constructor(props)
    {
        super(props)

        this.state = { hasError: false }
    }
    static getDerivedStateFromError(error)
    {
        return { hasError: true }
    }
    componentDidCatch(error, errorInfo)
    {
        console.log({ error, errorInfo })
    }

    render()
    {
        let childrenwprops = this.props.children;

        if (React.isValidElement(this.props.children))
        {
            childrenwprops = React.cloneElement(this.props.children, {
                ...this.props.children.props,
                ...this.props
            });
        }

        delete childrenwprops.children

        if (this.state.hasError)
        {
            return (<ErrorPage message="Client Error" status={500} />
            )
        }

        return childrenwprops
    }
}

export default ErrorBoundary 