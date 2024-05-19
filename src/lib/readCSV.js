import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const absolutePath = path.join(process.cwd(), 'public', filePath);

    fs.readFile(absolutePath, 'utf8', (err, fileData) => {
      if (err) {
        return reject(err);
      }

      Papa.parse(fileData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  });
};
