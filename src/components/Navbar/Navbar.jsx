import { AppBar, Avatar, Button, Toolbar, Typography } from "@material-ui/core";
import { Link, useLocation, useNavigate } from "react-router-dom";

import useStyles from "./styles";
import memoriesLogo from "../../images/memoriesLogo.png";
import memoriesText from "../../images/memoriesText.png";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { googleLogout } from "@react-oauth/google";

export default function Navbar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const logout = () => {
    googleLogout();
    dispatch({ type: "LOGOUT" });
    navigate("/");
    setUser(null);
  };
  useEffect(() => {
    if (user) {
      if (user.userObject.exp * 1000 < new Date().getTime()) logout();
    }
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <Link to="/">
        <img src={memoriesText} alt="icon" height="45px" />
        <img
          className={classes.logo}
          src={memoriesLogo}
          alt="memories logo"
          height="40"
        />
      </Link>
      <Toolbar className={classes.toolbar}>
        {user ? (
          <div className={classes.profile}>
            <Avatar
              className={classes.purple}
              alt={user.userObject.name}
              src={user.userObject.picture}
            >
              {user.userObject.name.charAt(0)}
            </Avatar>
            <Typography className={classes.userName} variant="h6">
              {user.userObject.name}
            </Typography>
            <Button
              component={Link}
              to="/"
              onClick={logout}
              variant="contained"
              className={classes.logout}
              color="secondary"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            className={classes.logout}
            color="primary"
          >
            Sign in
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
