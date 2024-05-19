import { readCSV } from '../../../lib/readCSV'

export async function GET(req) {
  const url = new URL(req.url);
  const year = url.searchParams.get('year');

  if (!year) {
    return new Response(JSON.stringify({ error: 'Year is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const data = await readCSV('salaries.csv');
    const details = {};

    data.forEach(row => {
      if (row.work_year === year) {
        const jobTitle = row.job_title;
        if (!details[jobTitle]) {
          details[jobTitle] = 0;
        }
        details[jobTitle] += 1;
      }
    });

    const formattedDetails = Object.entries(details).map(([jobTitle, count]) => ({
      jobTitle,
      count,
    }));

    return new Response(JSON.stringify({ details: formattedDetails }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}