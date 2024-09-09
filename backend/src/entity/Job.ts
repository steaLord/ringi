import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Application } from "./Application";

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.jobs)
  recruiter: User;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column("decimal")
  salaryMin: number;

  @Column("decimal")
  salaryMax: number;

  @Column({
    type: "enum",
    enum: ["USD", "KZT", "JPY"],
  })
  currency: "USD" | "KZT" | "JPY";

  @Column()
  location: string;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];
}
