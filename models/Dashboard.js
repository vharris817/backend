import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [summary, setSummary] = useState({ customers: 0, workOrders: 0 });

  useEffect(() => {
    axios.get('http://localhost:3001/dashboard') // Replace with your actual API endpoint
      .then((response) => {
        setSummary(response.data);
      })
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded shadow">
          <h2 className="text-lg font-semibold">Total Customers</h2>
          <p className="text-3xl">{summary.customers}</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h2 className="text-lg font-semibold">Active Work Orders</h2>
          <p className="text-3xl">{summary.workOrders}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
