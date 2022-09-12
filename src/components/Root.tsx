/* eslint-disable no-underscore-dangle */
import React, {useState, useEffect} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {Line} from 'react-chartjs-2';

import './Root.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Conditions {
  mountain: number;
  valley: number;
  new_snow: number;
  open_lifts: number;
  time: string;
  time_updated: string;
}

interface SkiResort {
  _id: string;
  name: string;
  country: string;
  conditions: Conditions[];
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart'
    }
  }
};
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => Math.random() * 100),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => Math.random() * 100),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)'
    }
  ]
};

function Root() {
  const [skiResorts, setSkiResorts] = useState<SkiResort[]>([]);
  const [selectedResortId, setSelectedResortId] = useState('');
  useEffect(() => {
    fetch('/express-backend')
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setSkiResorts(response.data);
        }
      });
  }, []);

  const selectedResort = selectedResortId ? skiResorts.find((skiResort) => skiResort._id === selectedResortId) : undefined;
  return (
    <div className="page-content-container">
      <select name="ski-resorts" onChange={(e) => setSelectedResortId(e.target.value)}>
        <option value="">- Select a Resort -</option>
        {skiResorts.map((skiResort) => (
          <option key={skiResort._id} value={skiResort._id}>{skiResort.name}</option>
        ))}
      </select>
      {selectedResort && (
        <table>
          <thead>
            <tr>
              <th>Resort Name</th>
              <th>Snow Depth in Valley</th>
              <th>Snow Depth on Mountain</th>
              <th>New Snow</th>
              <th>Open Lifts</th>
              <th>Time of Information</th>
              <th>Updated in Database</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{selectedResort.name}</td>
              <td>{selectedResort.conditions[0].valley}</td>
              <td>{selectedResort.conditions[0].mountain}</td>
              <td>{selectedResort.conditions[0].new_snow}</td>
              <td>{selectedResort.conditions[0].open_lifts}</td>
              <td>{new Date(selectedResort.conditions[0].time).toLocaleString('de-DE')}</td>
              <td>{new Date(selectedResort.conditions[0].time_updated).toLocaleString('de-DE')}</td>
            </tr>
          </tbody>
        </table>
      )}
      <Line options={options} data={data}/>
    </div>
  );
}

export default Root;
