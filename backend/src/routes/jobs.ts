import express from "express";
import { Job } from "../entity/Job";
import { User } from "../entity/User";
import { authMiddleware } from "../middleware/auth";
import { AppDataSource } from "../lib/data-source";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, salaryMin, salaryMax, currency, location } =
      req.body;
    const userRepository = AppDataSource.getRepository(User);
    const jobRepository = AppDataSource.getRepository(Job);
    const recruiter = await userRepository.findOne({
      where: { id: (req as any).user.id },
    });
    if (!recruiter || recruiter.role !== 1) {
      return res.status(403).json({ message: "Only recruiters can post jobs" });
    }

    const job = jobRepository.create({
      recruiter,
      title,
      description,
      salaryMin,
      salaryMax,
      currency,
      location,
    });

    await jobRepository.save(job);
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const jobRepository = AppDataSource.getRepository(Job);

    const jobs = await jobRepository.find({
      where: { recruiter: { id: (req as any).user.id } },
    });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/", async (req, res) => {
  try {
    const jobRepository = AppDataSource.getRepository(Job);
    const jobs = await jobRepository.find();
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
router.get("/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    const jobRepository = AppDataSource.getRepository(Job);

    const job = await jobRepository.findOne({
      where: { id: Number(jobId) },
      relations: ["applications"],
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
export default router;
