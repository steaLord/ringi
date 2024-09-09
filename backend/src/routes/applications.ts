import express from "express";
import { AppDataSource } from "../lib/data-source";
import { Application } from "../entity/Application";
import { Job } from "../entity/Job";
import { authMiddleware } from "../middleware/auth";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post("/:jobId", upload.single("resume"), async (req, res) => {
  try {
    const { jobId } = req.params;
    const { name, email } = req.body;
    const applicationRepository = AppDataSource.getRepository(Application);
    const jobRepository = AppDataSource.getRepository(Job);

    const job = await jobRepository.findOne({ where: { id: Number(jobId) } });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const application = applicationRepository.create({
      job,
      name,
      email,
      resume: req.file.buffer,
      status: "unanswered",
    });

    await applicationRepository.save(application);
    console.log(
      `Job application email sent from ${email} to ${job.recruiter.email}`
    );
    res.status(201).json(application);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/:jobId", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicationRepository = AppDataSource.getRepository(Application);

    const applications = await applicationRepository.find({
      where: { job: { id: Number(jobId) } },
    });
    if (applications.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/answer/:applicationId", authMiddleware, async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  const applicationRepository = AppDataSource.getRepository(Application);

  const application = await applicationRepository.findOne({
    where: { id: Number(applicationId) },
  });

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }
  application.status = status;

  await applicationRepository.save(application);
  if (status === "shortlisted") {
    console.log(
      `Candidate shortlisted notification email sent from ${application.job.recruiter.email} to ${application.email}`
    );
  } else {
    console.log(
      `Candidate declined notification email sent from ${application.job.recruiter.email} to ${application.email}`
    );
  }
  res.status(200).json(application);
});

router.get("/:applicationId/resume", authMiddleware, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const applicationRepository = AppDataSource.getRepository(Application);

    const application = await applicationRepository.findOne({
      where: { id: Number(applicationId) },
    });

    if (!application || !application.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.send(application.resume);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
