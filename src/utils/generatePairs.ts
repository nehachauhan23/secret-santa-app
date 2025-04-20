import { Employee } from "../types/employee";
import { Assignment } from "../types/assignment";

export function generateSecretSantaPairs(
  employees: Employee[],
  previousPairs?: Map<string, string>
): Assignment[] {
  const maxRetries = 1000;
  let attempts = 0;

  while (attempts < maxRetries) {
    attempts++;
    console.log(`🌀 Attempt ${attempts}`);

    const receivers = [...employees].sort(() => Math.random() - 0.5);
    let valid = true;
    const assignments: Assignment[] = [];

    for (let i = 0; i < employees.length; i++) {
      const giver = employees[i];
      const receiver = receivers[i];

      console.log(`🔍 Checking: ${giver.Employee_EmailID} ➡️ ${receiver.Employee_EmailID}`);

      if (giver.Employee_EmailID === receiver.Employee_EmailID) {
        console.warn(` Invalid: Self-match for ${giver.Employee_Name}`);
        valid = false;
        break;
      }

      if (previousPairs?.get(giver.Employee_EmailID) === receiver.Employee_EmailID) {
        console.warn(`Invalid: Repeat match for ${giver.Employee_Name}`);
        valid = false;
        break;
      }

      assignments.push({ giver, receiver });
    }

    if (valid) {
      console.log(`Valid match found after ${attempts} attempt(s)!`);
      console.table(assignments.map(({ giver, receiver }) => ({
        Giver: giver.Employee_Name,
        Receiver: receiver.Employee_Name
      })));
      return assignments;
    }
  }

  console.error("Failed to generate valid Secret Santa pairs.");
  console.table(employees.map((e) => ({
    Name: e.Employee_Name,
    Email: e.Employee_EmailID
  })));
  console.log("Previous Pairs (if any):", previousPairs);
  throw new Error("Unable to generate valid Secret Santa pairs after multiple attempts.");
}
