import React from 'react'

function Navbar()
{
    return ( 
        <div className="container">
            <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                <a href="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                    <h3><i className="bi bi-shield"></i>Ctice</h3>
                </a>

                <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                    <li><a href="/" className="nav-link px-2 link-secondary">Home</a></li>
                    <li><a href="#" className="nav-link px-2 link-dark">Center</a></li>
                    <li><a href="#" className="nav-link px-2 link-dark">News</a></li>
                    <li><a href="#" className="nav-link px-2 link-dark">Auth</a></li>
                    <li><a href="#" className="nav-link px-2 link-dark">More</a></li>
                    <li><a href="#" className="nav-link px-2 link-dark">About</a></li>
                </ul>

                <div className="col-md-3 text-end">
                    <form className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-primary" type="submit">Search</button>
                    </form>
                </div>
            </header>
        </div>
    )
}

export default Navbar
