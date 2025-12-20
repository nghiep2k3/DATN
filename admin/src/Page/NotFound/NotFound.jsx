import React from 'react'
import { url_api } from '../../config'
import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="not-found" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <img src={`${url_api}/upload/logo.png`} alt="Logo" className="auth-logo" />
        <h1>404</h1>
        <p>Page not found</p>
        <Link to="/" className="btn btn-primary">Go to home</Link>
    </div>
  )
}   
