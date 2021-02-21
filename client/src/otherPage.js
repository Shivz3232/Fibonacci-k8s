import React from 'react';
import { Link } from 'react-router-dom';

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    return (
        <div>
            <h1>Im Some Other Page!</h1>
            <hr/>
            <h2>Go back <Link to="/">home</Link>.</h2>
        </div>
    );
}