import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/API";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<number>(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/users/register", {
        email,
        password,
        role,
      });

      // Call login to set token and handle authentication state
      login(response.data.token);

      // Redirect to the jobs page
      navigate("/jobs");
    } catch (error: any) {
      console.error("Error registering user:", error);
      setError(error.response?.data?.message || "Error registering");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        <Select
          fullWidth
          value={role}
          label="Role"
          onChange={(e) => setRole(+e.target.value)}
          sx={{ marginY: "15px" }}
          required
        >
          <MenuItem value={1}>Recruiter</MenuItem>
          <MenuItem value={0}>Job Seeker</MenuItem>
        </Select>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </form>
      <Button
        variant="text"
        color="primary"
        fullWidth
        onClick={() => navigate("/login")}
      >
        Already have an account? Login
      </Button>
    </Container>
  );
};

export default Register;
