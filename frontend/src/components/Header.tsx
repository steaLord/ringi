import React from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { parseJwt } from "../utils/parseJwt";

const Header: React.FC = () => {
  const { isAuthenticated, logout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            style={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
          >
            Job Portal
          </Typography>

          {/* Show Login/Register or Logout depending on authentication */}
          {!isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          ) : (
            <>
              {token && parseJwt(token).user.role === 1 ? (
                <Button color="inherit" component={Link} to="/my-jobs">
                  My Jobs
                </Button>
              ) : null}
              <Button color="inherit" component={Link} to="/jobs">
                Jobs
              </Button>
              {token && parseJwt(token).user.role === 1 ? (
                <Button color="inherit" component={Link} to="/post-job">
                  Post Job
                </Button>
              ) : null}

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
