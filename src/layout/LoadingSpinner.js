import React from 'react'
import './LoadingSpinner.css'

export default function LoadingSpinner(props) {
    return <div className="d-flex justify-content-center my-2"><div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>;
}