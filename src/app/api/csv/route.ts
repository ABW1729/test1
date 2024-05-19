import {  NextApiRequest, NextApiResponse } from "next";
import { readCSV } from "../../../lib/readCSV"

export async function GET(req:Request) {
    try {
        const data = await readCSV('salaries.csv'); 
        const stats = {};

        data.forEach(row => {
          const year = row.work_year;
          const salary = parseFloat(row.salary_in_usd);
    
          if (!stats[year]) {
            stats[year] = {
              totalJobs: 0,
              totalSalary: 0,
              averageSalary: 0,
            };
          }
    
          stats[year].totalJobs += 1;
          stats[year].totalSalary += salary;
        });
    
        Object.keys(stats).forEach(year => {
          stats[year].averageSalary = stats[year].totalSalary / stats[year].totalJobs;
        });
    
        return new Response(JSON.stringify({ stats }), {
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
