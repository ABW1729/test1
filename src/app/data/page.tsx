"use client";
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Table,Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Backdrop, Fade, Button } from '@mui/material';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
Chart.register(...registerables);

interface JobStats {
  totalJobs: number;
  averageSalary: number;
}

interface StatsResponse {
  stats: {
    [year: string]: JobStats;
  };
}

interface JobDetail {
  jobTitle: string;
  count: number;
}

type SortKey = 'year' | 'totalJobs' | 'averageSalary';
type SortOrder = 'asc' | 'desc';

const HomePage = () => {
  const [stats, setStats] = useState<{ [year: string]: JobStats }>({});
  const [sortKey, setSortKey] = useState<SortKey>('year');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [jobDetails, setJobDetails] = useState<JobDetail[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/csv');
        const result: StatsResponse = await response.json();
        setStats(result.stats);
      } catch (error) {
        console.error('Error fetching job stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleRowClick = async (year: string) => {
    setSelectedYear(year);

    try {
      const response = await fetch(`/api/job?year=${year}`);
      const result = await response.json();
      setJobDetails(result.details);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sortedStats = Object.entries(stats).sort((a, b) => {
    const [yearA, statsA] = a;
    const [yearB, statsB] = b;
    let compareResult = 0;

    switch (sortKey) {
      case 'year':
        compareResult = yearA.localeCompare(yearB);
        break;
      case 'totalJobs':
        compareResult = statsA.totalJobs - statsB.totalJobs;
        break;
      case 'averageSalary':
        compareResult = statsA.averageSalary - statsB.averageSalary;
        break;
    }

    return sortOrder === 'asc' ? compareResult : -compareResult;
  });

  const chartData = {
    labels: Object.keys(stats),
    datasets: [
      {
        label: 'Total Jobs',
        data: Object.values(stats).map(stat => stat.totalJobs),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div>
      <h4 style={{margin:'20px',display:'flex',justifyContent: 'center',textDecoration:'underline'}}>Job Statistics</h4>
      <div style={{ margin: '20px',padding: '16px', borderRadius: '8px',border: '2px solid black' }}>
      <Line data={chartData} />
      </div>
      <div style={{ margin: '20px',padding: '16px',borderRadius: '8px', border: '2px solid black' }}>
<TableContainer component={Paper} style={{ marginTop: '20px',padding: '8px', border: '1px solid #ddd' }}>
  <Table >
    <TableHead>
      <TableRow>
        <TableCell onClick={() => handleSort('year')} style={{ padding: '8px', borderRight: '1px solid #ddd' }}>Year</TableCell>
        <TableCell onClick={() => handleSort('totalJobs')} style={{ padding: '8px', borderRight: '1px solid #ddd' }}>Total Jobs</TableCell>
        <TableCell onClick={() => handleSort('averageSalary')} style={{ padding: '8px', borderRight: '1px solid #ddd' }}>Average Salary (USD)</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {sortedStats.map(([year, { totalJobs, averageSalary }]) => (
        <TableRow key={year} onClick={() => handleRowClick(year)} style={{ cursor: 'pointer' }}>
          <TableCell style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{year}</TableCell>
          <TableCell style={{padding: '8px', borderRight: '1px solid #ddd' }}>{totalJobs}</TableCell>
          <TableCell style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{averageSalary.toFixed(2)}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
</div>
      <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  closeAfterTransition
>
  <Fade in={open}>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '80%', maxWidth: '600px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', overflowY: 'auto', maxHeight: '80vh',scrollbarWidth: 'thin', scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)'  }}>
        {/* Close button */}
       <IconButton onClick={handleClose} style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 1000, backgroundColor: '#ffffff' }}>
          <CloseIcon />
        </IconButton>
        
        {/* Dialog content */}
      <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>
          <Typography variant="h6">Job Title</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="h6">Count</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {jobDetails.map(({ jobTitle, count }) => (
        <TableRow key={jobTitle}>
          <TableCell style={{ borderRight: '1px solid #ddd' }}>
            <Typography>{jobTitle}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{count}</Typography>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
      </div>
    </div>
  </Fade>
</Modal>
    </div>
  );
};

export default HomePage;

