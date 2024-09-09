import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Job } from "./Job";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: [0, 1],
    comment: "0: Job Seeker, 1: Recruiter",
  })
  role: 0 | 1;

  @OneToMany(() => Job, (job) => job.recruiter)
  jobs: Job[];
}
