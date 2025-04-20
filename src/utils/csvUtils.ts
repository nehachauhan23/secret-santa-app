import Papa from 'papaparse';
import { Assignment } from '../types/assignment';
import { RawEmployeeCSV } from "../types/csv";
import { Employee } from "../types/employee";

export const downloadCSV = (assignments: Assignment[]) => {
  const csvData = assignments.map(({ giver, receiver }) => ({
    Employee_Name: giver.Employee_Name,
    Employee_EmailID: giver.Employee_EmailID,
    Secret_Child_Name: receiver.Employee_Name,
    Secret_Child_EmailID: receiver.Employee_EmailID,
  }));

  const csv = Papa.unparse(csvData);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'secret_santa_pairs.csv';
  link.click();
};

export function parseEmployeeCSV(
  file: File,
  callback: (data: Employee[]) => void
) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results: Papa.ParseResult<RawEmployeeCSV>) => {
      const parsed: Employee[] = results.data.map((emp: any) => ({
        Employee_Name: emp.Employee_Name?.trim(),
        Employee_EmailID: emp.Employee_EmailID?.trim(),
      }));
      callback(parsed);
    },
  });
}

export function parsePreviousYearCSV(
  file: File,
  callback: (data: Map<string, string>) => void
) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results: Papa.ParseResult<RawEmployeeCSV>) => {
      const previous = new Map<string, string>();
      results.data.forEach((row: any) => {
        const giver = row.Employee_EmailID?.trim();
        const receiver = row.Secret_Child_EmailID?.trim();
        if (giver && receiver) {
          previous.set(giver, receiver);
        }
      });
      callback(previous);
    },
  });
}