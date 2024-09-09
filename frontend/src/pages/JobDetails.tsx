import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import axiosInstance from "../api/API";
import { IApplication } from "../types/Application";
import { IJob } from "../types/Job";

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<IJob | null>(null); // Use IJob interface
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axiosInstance.get(`/jobs/${jobId}`);
        setJob(response.data);
        setLoading(false);
      } catch (error: any) {
        setError(error.response?.data?.message || "Error fetching job details");
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  const handleAnswer = async (applicationId: number, status: string) => {
    try {
      await axiosInstance.post(`/applications/answer/${applicationId}`, {
        status,
      });
      const updatedApplications = job?.applications?.map((app: IApplication) =>
        app.id === applicationId ? { ...app, status } : app
      );
      setJob((prev) =>
        prev ? { ...prev, applications: updatedApplications! } : null
      );
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Error updating application status"
      );
    }
  };
  const downloadResume = async (
    applicationId: number,
    applicantName: string
  ) => {
    try {
      // Fetch the resume PDF from the server
      const response = await axiosInstance.get(
        `/applications/${applicationId}/resume`,
        {
          responseType: "arraybuffer", // Important to fetch binary data
        }
      );

      // Create a Blob from the response data and trigger a download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `resume_${applicantName}.pdf`; // Suggested file name
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Release the object URL after the download
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the resume", error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!job) return <Typography>No job details found</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {job.title}
      </Typography>
      <Typography variant="body1" paragraph>
        {job.description}
      </Typography>
      <Typography variant="body2" paragraph>
        Location: {job.location}
      </Typography>
      <Typography variant="body2" paragraph>
        Salary: {job.salaryMin} - {job.salaryMax} {job.currency}
      </Typography>

      <Typography variant="h5" gutterBottom>
        Applications
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      {job.applications && job.applications.length > 0 ? (
        job.applications.map((application: IApplication) => (
          <Card key={application.id} style={{ marginBottom: "1rem" }}>
            <CardContent>
              <Typography variant="h6">{application.name}</Typography>
              <Typography>Email: {application.email}</Typography>
              <Typography>Status: {application.status}</Typography>

              <Button
                variant="contained"
                color="success"
                onClick={() => handleAnswer(application.id, "shortlisted")}
                style={{ marginRight: "1rem" }}
                disabled={application.status === "shortlisted"}
              >
                Shortlist
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleAnswer(application.id, "declined")}
                style={{ marginRight: "1rem" }}
                disabled={application.status === "declined"}
              >
                Decline
              </Button>
              <Button
                variant="contained"
                onClick={() => downloadResume(application.id, application.name)}
                disabled={!application.resume}
              >
                Download resume
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No applications for this job yet.</Typography>
      )}
    </Container>
  );
};

export default JobDetails;
