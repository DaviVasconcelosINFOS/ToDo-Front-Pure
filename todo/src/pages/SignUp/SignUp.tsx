import React from 'react';
import { Grid, CssBaseline, Paper, Box, Avatar, Typography, TextField, Button, Link } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { signUpApi } from '../../services/api';

function SignUp() {
    const navigate = useNavigate(); // Usa o hook 'useNavigate'

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const email = data.get('email');
        const nome = data.get('name');
        const password = data.get('password');
        const repassword = data.get('repassword');

        if (typeof email === 'string' && typeof password === 'string' && typeof repassword === 'string' && typeof nome === 'string') {
            if (password === repassword) {
                signUpApi(email, password)
                    .then(response => {
                        if (response.data === true) {
                            navigate('/'); // Usa 'navigate' para redirecionar
                        } else {
                            console.error('Erro'); // Mostrar alerta se necessário
                        }
                    })
                    .catch(error => {
                        console.error('Sign up failed:', error); // Mostrar alerta se necessário
                    });
            } else {
                console.error('Passwords don\'t match.'); // Mostrar alerta se necessário
            }
        } else {
            console.error('Email or password is missing or invalid.'); // Mostrar alerta se necessário
        }
    };

    return (
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
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Nome"
                            name="name"
                            autoFocus
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
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="repassword"
                            label="Repeat Password"
                            type="password"
                            id="repassword"
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
    );
}

export default SignUp;
