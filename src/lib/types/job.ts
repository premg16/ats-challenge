import { Jobs } from "@prisma/client";

export interface JobWithCount extends Jobs {
  _count: {
    applications: number;
  };
}