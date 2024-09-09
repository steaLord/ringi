import React, { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../api/API";
import { useAuth } from "../context/AuthContext";
import { parseJwt } from "../utils/parseJwt";
import { IJob } from "../types/Job";
import JobCard from "../components/JobCard";

const JobList: React.FC = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get("/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Available Jobs
      </Typography>
      {loading
        ? "Loading..."
        : jobs.map((job) => <JobCard job={job} jobPage={false} key={job.id} />)}
      {token && parseJwt(token).user.role === 1 ? (
        <Button
          component={Link}
          to="/post-job"
          variant="text"
          color="primary"
          fullWidth
        >
          Post a Job
        </Button>
      ) : null}
    </Container>
  );
};

export default JobList;
