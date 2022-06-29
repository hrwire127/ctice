import * as React from 'react'; //<M+
import ErrorPage from './ErrorPage'

class ErrorBoundary extends React.Component
{
    constructor(props)
    {
        super(props)

        // Define a state variable to track whether is an error or not
        this.state = { hasError: false }
    }
    static getDerivedStateFromError(error)
    {
        // Update state so the next render will show the fallback UI

        return { hasError: true }
    }
    componentDidCatch(error, errorInfo)
    {
        // You can use your own error logging service here
        console.log({ error, errorInfo })
    }
    render()
    {
        // Check if the error is thrown
        if (this.state.hasError)
        {
            // You can render any custom fallback UI
            return (<ErrorPage message="Client Error" status={500} />
            )
        }

        // Return children components in case of no error

        return this.props.children
    }
}

export default ErrorBoundary 