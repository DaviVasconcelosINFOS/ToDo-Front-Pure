import React from 'react';
import { Grid, CssBaseline, Paper, Box, Avatar, Typography, TextField, Button, Link, Alert, Snackbar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { signUpApi } from '../../services/api';
import { error } from 'console';

function SignUp() {
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const email = data.get('email');
        const nome = data.get('name');
        const password = data.get('password');
        const repassword = data.get('repassword');

        if (typeof email === 'string' && typeof password === 'string' && typeof repassword === 'string' && typeof nome === 'string') {
            if (password === repassword) {
                signUpApi(email, password, nome)
                    .then(response => {
                        if (response.data === true) {
                            navigate('/');
                        } else {
                            console.error('Erro');
                            setSnackbarMessage('Erro ao fazer sing in');
                            setOpenSnackbar(true);
                        }
                    })
                    .catch(error => {
                        setSnackbarMessage('Sign up failed: '+ error);
                        setOpenSnackbar(true);
                    });
            } else {
                setSnackbarMessage('Passwords don\'t match.');
                setOpenSnackbar(true);
            }
        } else {
            setSnackbarMessage('Email or password is missing or invalid.');
            setOpenSnackbar(true);
        }


    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage:
                        'url("https://images.pexels.com/photos/205414/pexels-photo-205414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <AccountCircleIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Nome"
                            name="name"
                            autoFocus
                            aria-required
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            aria-required
                            inputProps={{
                                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                                title: "Please enter a valid email address"
                            }}
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
                            aria-required
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="repassword"
                            label="Repeat Password"
                            type="password"
                            id="repassword"
                            aria-required
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent={'center'}>
                            <Grid item >
                                <Link href="/" variant="body2">
                                    {"Go Back"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
        <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        action={
          <Button color="inherit" onClick={handleCloseSnackbar}>
            Close
          </Button>
        }
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </>
    );
}

export default SignUp;
function useState<T>(arg0: null): [any, any] {
    throw new Error('Function not implemented.');
}

