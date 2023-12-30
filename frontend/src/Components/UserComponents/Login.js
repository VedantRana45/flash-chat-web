import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';
import ChatLogo from '../../images/ChatLogo.png';


const Login = () => {

    const initialLoginData = {
        email: '',
        password: '',
    }

    const [loginDetails, setLoginDetails] = useState(initialLoginData);
    const [alertStatus, setAlertStatus] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //close handler for Toast / Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertStatus({
            openSnackbar: false
        })
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginDetails({
            ...loginDetails,
            [name]: value,
        })
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (!loginDetails.email || !loginDetails.password) {
            setAlertStatus({
                openSnackbar: true,
                severity: "warning",
                message: "Please fill all fields !"
            })
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            }

            const { data } = await axios.post("/api/user/login", loginDetails, config);
            setAlertStatus({
                openSnackbar: true,
                severity: "success",
                message: "Login Success !"
            })

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);

        } catch (error) {
            setAlertStatus({
                openSnackbar: true,
                severity: "error",
                message: error.message
            })
            setLoading(false);
            console.log(error.message);
        }

        const userInfo = JSON.parse(localStorage.getItem("userInfo"))

        if (userInfo) {
            navigate('/chat');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: '100px', height: '100px' }}>
                    <img src={ChatLogo} style={{ scale: '1.3' }} alt='FlashChat' />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={loginDetails.email}
                        onChange={handleChange}

                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={loginDetails.password}
                        onChange={handleChange}
                    />
                    <LoadingButton
                        type="submit"
                        fullWidth
                        loading={loading}
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: '#191717',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#2b2b2e',
                            },
                        }}

                    >
                        Sign In
                    </LoadingButton>

                </Box>
                <Snackbar
                    open={alertStatus.openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={alertStatus.severity}>
                        {alertStatus.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
}

export default Login;