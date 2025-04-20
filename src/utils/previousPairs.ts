import Papa from "papaparse";

export function parsePreviousYearPairs(file: File): Promise<Map<string, string>> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const previousMap = new Map<string, string>();
        results.data.forEach((pair: any) => {
          const giverEmail = pair.Giver_Email?.trim();
          const receiverEmail = pair.Receiver_Email?.trim();
          if (giverEmail && receiverEmail) {
            previousMap.set(giverEmail, receiverEmail);
          }
        });
        resolve(previousMap);
      },
      error: (err: any) => {
        console.log("Error : ", err);
        
        reject(new Error("Error parsing previous year pairs CSV"));
      }
    });
  });
}
