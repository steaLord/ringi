import { Button, Card, CardContent, Typography } from "@mui/material";
import { IJob } from "../types/Job";
import { Link } from "react-router-dom";

const JobCard = ({
  job,
  jobPage,
  showDetails = false,
}: {
  job: IJob;
  jobPage: boolean;
  showDetails?: boolean;
}) => {
  return (
    <Card key={job.id} style={{ marginBottom: "1rem" }}>
      <CardContent>
        <Typography variant="h5">{job.title}</Typography>
        <Typography>{job.description}</Typography>
        <Typography>{`Location: ${job.location}`}</Typography>
        <Typography>{`Salary: ${job.salaryMin} - ${job.salaryMax} ${job.currency}`}</Typography>
        {!jobPage && !showDetails && (
          <Button
            component={Link}
            to={`/apply/${job.id}`}
            variant="contained"
            color="primary"
          >
            Apply
          </Button>
        )}
        {showDetails && (
          <Button
            component={Link}
            to={`/job-details/${job.id}`}
            variant="contained"
            color="primary"
          >
            Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;
