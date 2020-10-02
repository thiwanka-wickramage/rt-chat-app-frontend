import React, {useState} from 'react';
import axios from "axios";
import {withRouter} from "react-router-dom";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const SignUp = (props) => {
    const classes = useStyles();
    let [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordC: ''
    });

    let [formDataError, setFormDataError] = useState({
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        passwordC: null
    });

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        const _formData = { ...formData }
        const _formDataError = { ...formDataError}
        _formDataError[name] = null;
        setFormDataError(_formDataError)
        _formData[name] = value;
        setFormData(_formData);
    };

    const signupHandler = (e) => {
        e.preventDefault();
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        const { firstName, lastName, email, password, passwordC } = formData;
        let hasError = false;
        const _formDataError = { ...formDataError }
        if(!firstName) {
            _formDataError.firstName = 'Required';
            hasError = true;
        }
        if(!lastName) {
            _formDataError.lastName = 'Required';
            hasError = true;
        }
        if(!email  || !reg.test(email)) {
            _formDataError.email = 'Please enter valid email address';
            hasError = true;
        }
        if(!password) {
            _formDataError.password = 'Required';
            hasError = true;
        }
        if(!passwordC) {
            _formDataError.passwordC = 'Required';
            hasError = true;
        }
        if(passwordC !== password){
            _formDataError.passwordC = 'Password mismatch';
            hasError = true;
        }


        if(hasError) {
            return setFormDataError(_formDataError);
        }

        axios
            .post("http://localhost:8080/api/auth/signup", {
                firstName,
                lastName,
                email,
                password,
            })
            .then((response) => {
                props.history.push("/signin");
            })
            .catch((err) => {
                if (
                    err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                )
                    console.log("error", err.response.data.message);
            });
    };


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                error={!!formDataError.firstName}
                                id="firstName"
                                label='First Name'
                                autoFocus
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                error={!!formDataError.lastName}
                                name="lastName"
                                autoComplete="lname"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label={!!formDataError.passwordC?formDataError.passwordC : "Email Address"}
                                error={!!formDataError.email}
                                name="email"
                                autoComplete="email"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                error={!!formDataError.password}
                                id="password"
                                autoComplete="current-password"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="passwordC"
                                label={!!formDataError.passwordC?formDataError.passwordC : "Confirm Password"}
                                error={!!formDataError.passwordC}
                                type="password"
                                id="passwordC"
                                autoComplete="current-password"
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        style={{marginTop:'20px', marginBottom:'10px'}}
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={signupHandler}
                        type='submit'
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/signin" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};
export default withRouter(SignUp);