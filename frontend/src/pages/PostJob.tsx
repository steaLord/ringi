import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/API";

const PostJob: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Ensure salaries are numbers
    if (isNaN(Number(salaryMin)) || isNaN(Number(salaryMax))) {
      setError("Please enter valid numbers for salary.");
      return;
    }

    const jobData = {
      title,
      description,
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      currency,
      location,
    };

    try {
      await axiosInstance.post("/jobs", jobData);

      setSuccess("Job posted successfully!");
      navigate("/jobs"); // Redirect to the jobs listing after successful submission
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to post job.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Post a New Job
      </Typography>

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="primary" gutterBottom>
          {success}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          multiline
          rows={4}
          required
        />
        <TextField
          fullWidth
          label="Minimum Salary"
          value={salaryMin}
          onChange={(e) => setSalaryMin(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Maximum Salary"
          value={salaryMax}
          onChange={(e) => setSalaryMax(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          select
          label="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          fullWidth
          margin="normal"
          required
        >
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="KZT">KZT</MenuItem>
          <MenuItem value="JPY">JPY</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Post Job
        </Button>
      </form>
      <Button
        component={Link}
        to="/jobs"
        variant="text"
        color="primary"
        fullWidth
      >
        Cancel
      </Button>
    </Container>
  );
};

export default PostJob;
