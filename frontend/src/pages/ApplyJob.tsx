import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";
import axiosInstance from "../api/API";
import JobCard from "../components/JobCard";
import { IJob } from "../types/Job";

const ApplyJob: React.FC = () => {
  const { jobId } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [job, setJob] = useState<IJob | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(`/jobs/${jobId}`);
        setJob(response.data);
      } catch (error) {
        navigate("/jobs");
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJob();
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("resume", resume);

    try {
      await axiosInstance.post(`/applications/${jobId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Application submitted");
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Apply for Job
      </Typography>
      {job && <JobCard jobPage={true} job={job} />}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files ? e.target.files[0] : null)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit Application
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

export default ApplyJob;
