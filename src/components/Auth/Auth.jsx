import {
  Avatar,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockOutlined } from "@material-ui/icons";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";

import useStyles from "./style";
import Input from "./Input";
import { signin, signup } from "../../actions/auth";

export default function Auth() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    if (user) {
      navigate("/posts");
    }
  }, [navigate, user]);

  const classes = useStyles();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSignUp, setIsSignUp] = useState(false);

  const onSuccess = ({ userObject, credential }) => {
    try {
      dispatch({ type: "AUTH", payload: { userObject, token: credential } });
      navigate("/");
    } catch (error) {
      console.log({ msg: error.message });
    }
  };

  function onFailure() {
    console.log("Sign in to google failure \n");
  }

  function handleCallBackResponse(response) {
    const { name, email, picture, sub, exp } = jwt_decode(response.credential);
    const userObject = { name, email, picture, _id: sub, exp };
    const credential = response.credential;
    onSuccess({ userObject: userObject, credential: credential });
  }

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isSignUp
      ? dispatch(signup(formData, navigate))
      : dispatch(signin(formData, navigate));
  };
  const switchMode = () => {
    setIsSignUp((prevState) => !prevState);
    setShowPassword(false);
  };

  if (user) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar} />
        <LockOutlined />
        <Typography variant="h5">{isSignUp ? "Sign Up" : "Sign In"}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignUp && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={() =>
                setShowPassword((prevState) => !prevState)
              }
            />
            {isSignUp && (
              <Input
                name="confirmPassword"
                label="Confirm Password"
                handleChange={handleChange}
                type="password"
              />
            )}
          </Grid>
          <br />
          <Divider />
          <br />
          <Button type="submit" fullWidth variant="contained" color="primary">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <br />
          <Divider />
          <br />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                handleCallBackResponse(credentialResponse)
              }
              onFailure={onFailure}
              size="medium"
              shape="pill"
            />
          </div>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
