import { useState } from "react";
import { Employee } from "./types/employee";
import { Assignment } from "./types/assignment";
import { generateSecretSantaPairs } from "./utils/generatePairs";
import { downloadCSV, parseEmployeeCSV, parsePreviousYearCSV } from "./utils/csvUtils"; 

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [previousPairs, setPreviousPairs] = useState<Map<string, string>>(new Map());
  const [error, setError] = useState<string>("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    parseEmployeeCSV(file, (parsedData) => {
      setEmployees(parsedData);
      setAssignments([]);
      setError("");
    });
  };

  const handlePreviousYearUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    parsePreviousYearCSV(file, (previous) => {
      setPreviousPairs(previous);
      setError(""); 
    });
  };

  const handleGenerate = () => {
    try {
      const pairs = generateSecretSantaPairs(employees, previousPairs);
      setAssignments(pairs);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDownloadCSV = () => {
    if (assignments.length > 0) {
      downloadCSV(assignments); 
    } else {
      setError("No Secret Santa pairs to download.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-base-200">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">🎁 Secret Santa</h1>

        <div className="mb-4">
          <label htmlFor="employee-upload" className="block font-semibold mb-2">Upload Employee List (Current Year)</label>
          <input
            id="employee-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="file-input w-full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="previous-pairs-upload" className="block font-semibold mb-2">Upload Previous Year Secret Santa Pairs (Optional)</label>
          <input
            id="previous-pairs-upload"
            type="file"
            accept=".csv"
            onChange={handlePreviousYearUpload}
            className="file-input w-full"
          />
        </div>

        {employees.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-2">Uploaded Employees</h2>
            <div className="overflow-x-auto mb-6">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, index) => (
                    <tr key={index}>
                      <td>{emp.Employee_Name}</td>
                      <td>{emp.Employee_EmailID}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="btn btn-primary mb-4" onClick={handleGenerate}>
              Generate Secret Santa Pairs
            </button>
          </>
        )}

        {error && <p className="text-red-500 font-medium mb-4">{error}</p>}

        {assignments.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-2">Generated Secret Santa Pairs</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Giver</th>
                    <th>Giver Email</th>
                    <th>Receiver</th>
                    <th>Receiver Email</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(({ giver, receiver }, index) => (
                    <tr key={index}>
                      <td>{giver.Employee_Name}</td>
                      <td>{giver.Employee_EmailID}</td>
                      <td>{receiver.Employee_Name}</td>
                      <td>{receiver.Employee_EmailID}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn btn-secondary mb-4" onClick={handleDownloadCSV}>
              Download Secret Santa Pairs as CSV
            </button>
          </>
        )}

        {previousPairs.size > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-2 mt-6">Previous Year Secret Santa Pairs</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Giver</th>
                    <th>Giver Email</th>
                    <th>Receiver</th>
                    <th>Receiver Email</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(previousPairs.entries()).map(([giverEmail, receiverEmail], index) => (
                    <tr key={index}>
                      <td>{giverEmail}</td>
                      <td>{giverEmail}</td>
                      <td>{receiverEmail}</td>
                      <td>{receiverEmail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
