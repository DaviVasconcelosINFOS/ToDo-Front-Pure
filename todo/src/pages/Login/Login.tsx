import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { login } from '../../services/api';
import { loginSuccess } from '../../redux/action';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getPayloadData } from '../../services/utils';
import { Token } from '@mui/icons-material';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    if (typeof email === 'string' && typeof password === 'string') {
      login(email, password)
        .then(response => {
          if (response.data) {

            const payload = getPayloadData(response.data.token);

            dispatch(loginSuccess(response.data.token, payload.nome));
            navigate('/home');
          } else {
            setSnackbarMessage('Erro ao processar a resposta');
            setOpenSnackbar(true);
          }
        })
        .catch(error => {
          setSnackbarMessage('Falha no login: Verifique seu email e senha');
          setOpenSnackbar(true);
        });
    } else {
      setSnackbarMessage('Email ou senha estão ausentes ou inválidos.');
      setOpenSnackbar(true);
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Typography
                  variant="body2"
                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={handleSignupClick}
                >
                  {"Don't have an account? Sign Up"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
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
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
