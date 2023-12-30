import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';
import ChatLogo from '../../images/ChatLogo.png';


const SignUp = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [conPassword, setConPassword] = useState("");
    const [fileName, setFileName] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [loading, setLoading] = useState(false)
    const [alertStatus, setAlertStatus] = useState({});
    const navigate = useNavigate();


    const handleProfilePic = (image) => {
        //alert if Image is not selected
        if (image === undefined) {
            setAlertStatus({
                openSnackbar: true,
                severity: "error",
                message: "Image is not Selected !"
            })
            return;
        }

        setLoading(true);

        if (image.type === "image/jpeg" || image.type === "image/png") {
            setFileName(image.name);
            const data = new FormData();
            const uploadPreset = "chat-app";
            data.append("file", image);
            data.append("upload_preset", uploadPreset);
            data.append("cloud_name", "vedantrana");

            axios.post("https://api.cloudinary.com/v1_1/vedantrana/upload", data)
                .then(response => {
                    setImgUrl(response.data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    // console.log(err);
                    setAlertStatus({
                        openSnackbar: true,
                        severity: "error",
                        message: "Image Uploading Error !"
                    })
                    setLoading(false);
                })
        } else {
            setAlertStatus({
                openSnackbar: true,
                severity: "error",
                message: "select jpeg/png only !"
            })
            return;
        }
    }

    //close handler for Toast / Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertStatus({
            openSnackbar: false
        })
    };

    //handle function for submitting form data to backend
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!firstName || !lastName || !password || !conPassword) {
            setAlertStatus({
                openSnackbar: true,
                severity: "warning",
                message: "Fill up All the fields"
            })
            setLoading(false);
            return;
        }

        if (password !== conPassword) {
            setAlertStatus({
                openSnackbar: true,
                severity: "warning",
                message: "Password not matched"
            })
            setLoading(false)
            return;
        }

        try {

            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            }

            const { data } = await axios.post("/api/user/register",
                {
                    firstName,
                    lastName,
                    email,
                    password,
                    pic: imgUrl,
                },
                config
            );

            console.log(data);

            setAlertStatus({
                openSnackbar: true,
                severity: "success",
                message: "Registration Successful"
            })

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);

        } catch (error) {
            setAlertStatus({
                openSnackbar: true,
                severity: "error",
                message: "Registration Failed, Try Again !"
            })
            setLoading(false)
            return;
        }

        const userInfo = JSON.parse(localStorage.getItem("userInfo"))

        if (userInfo) {
            navigate('/chat');
        }
    };


    return (
        <Container component="main" maxWidth="xs" >
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
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                onChange={(e) => setFirstName(e.target.value)}
                                value={firstName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="cpassword"
                                autoComplete="new-password"
                                value={conPassword}
                                onChange={(e) => setConPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>

                            <label htmlFor="upload-photo">
                                <input
                                    style={{ display: 'none' }}
                                    id="upload-photo"
                                    name="upload-photo"
                                    type="file"
                                    onChange={(e) => handleProfilePic(e.target.files[0])}
                                />

                                <Button
                                    color="secondary"
                                    variant="contained"
                                    component="span"
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#191717',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#2b2b2e',
                                        },
                                    }}
                                >
                                    {fileName ? (fileName.substring(0, 24) + '...') : 'Profile Picture'}
                                </Button>
                            </label>
                        </Grid>
                    </Grid>
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
                        Sign Up
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
    )

}


export default SignUp;