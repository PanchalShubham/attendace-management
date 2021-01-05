import React from 'react';
import Button from '@material-ui/core/Button';
import Image from '../../resources/images/404.gif';
// functional component
export default function NotFound() {
    return (
        <div id="page404" style={{display: 'flex', alignItems: 'center', height: '100vh'}}>
            <div>
                <img src={Image} alt="page-404" style={{width: '100%'}}/>
            </div>
            <div style={{textAlign: 'center'}}>
                <p>The page you are looking for does not exist!</p>
                <Button variant="contained" color="primary" href="/">Home</Button>
            </div> 
        </div>
    );
}