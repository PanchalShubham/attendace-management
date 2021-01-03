import React from 'react';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import BrandIcon from '../../resources/images/brand.png';
const useStyles = makeStyles(theme => ({
    homepage: {
        userSelect: 'none',
    },
    header: {
        textAlign: 'center',
        color: '#2977c9',
    },
    content: {
        display: 'flex',
        alignItems: 'center',
    },
    leftFlexBox: {
        flex: 0.5,
        textAlign: "center",
        marginRight: "10px",
    },
    rightFlexBox: {
        flex: 0.5,
        textAlign: "left",
        marginLeft: "10px",
    },
    brandImage:{
        borderRadius: '50%',
        width: '200px',
        height: '200px'
    },
    button: {
        margin: 'auto 10px',
    },
}));

function Homepage(props) {
    const classes = useStyles();
    return (
        <div className={classes.homepage}>
            <h1 className={classes.header}>Attendance Management System</h1>
            <div className={classes.content}>
                <div className={classes.leftFlexBox}>
                    <img src={BrandIcon} alt="our-brand" className={classes.brandImage}/>
                </div>
                <div className={classes.rightFlexBox}>
                    <p>
                        - One place to manage all your attendances! <br/>
                        - Collect attendance on-demand! <br/>
                        - Maintain your attendance record with ease! <br/>
                        - 
                    </p>
                    <Button className={classes.button} variant="contained" color="primary" href="/login">Sign In</Button>
                    OR
                    <Button className={classes.button} variant="contained" color="primary" href="/register">Sign Up</Button>
                </div>
            </div>
        </div>
    );
};
export default Homepage;