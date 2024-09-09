import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Job } from "./Job";

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Job, (job) => job.applications)
  job: Job;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: "bytea" })
  resume: Buffer;

  @Column({
    type: "enum",
    enum: ["unanswered", "declined", "shortlisted"],
  })
  status: "unanswered" | "declined" | "shortlisted";
}
