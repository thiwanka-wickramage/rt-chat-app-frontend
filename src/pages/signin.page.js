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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const SignIn = (props) => {
    const classes = useStyles();
    let [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    let [formDataError, setFormDataError] = useState({
        email: '',
        password: ''
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

    const loginHandler = (e) => {
        e.preventDefault();
        const {email, password} = formData;
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        let hasError = false;
        const _formDataError = { ...formDataError }
        if(!email  || !reg.test(email)) {
            _formDataError.email = 'Please enter valid email address';
            hasError = true;
        }
        if(!password) {
            _formDataError.password = 'Required';
            hasError = true;
        }
        if(hasError) {
            return setFormDataError(_formDataError);
        }

        axios
            .post("http://localhost:8080/api/auth/signin", {
                email,
                password,
            })
            .then((response) => {
                const {token, id, username} = response.data.user;
                localStorage.setItem("WC_Token", token);
                localStorage.setItem("WC_UserId", id);
                props.history.push("/chat");
                props.setupSocket(username);
            })
            .catch((err) => {
                console.log(err);
                if (
                    err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                )
                    console.log("error", err.response.data.message);
            });
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        error={!!formDataError.email}
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        error={!!formDataError.password}
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={loginHandler}
                        type='submit'
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};

export default withRouter(SignIn);