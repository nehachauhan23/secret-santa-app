import { Employee } from "./employee";

export interface Assignment {
  giver: Employee;
  receiver: Employee;
}