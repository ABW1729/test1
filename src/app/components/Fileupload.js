import { useState } from 'react';
import Papa from 'papaparse';

const FileUpload = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setError("Please select a file.");
      return;
    }

    if (file.type !== "text/csv") {
      setError("Please upload a CSV file.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setData(results.data);
        setError(null);
      },
      error: function (error) {
        setError(`Parsing error: ${error.message}`);
      }
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default FileUpload;
