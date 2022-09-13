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
import {SkiResort} from '../types';
import UserInputs from '../components/UserInputs/UserInputs';

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

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Future Levels'
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
    fetch('/austria-resorts')
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setSkiResorts(response.data);
        }
      });
  }, []);

  return (
    <div className="page-content-container">
      <div className="content-wrapper">
        <UserInputs skiResorts={skiResorts} selectedResortId={selectedResortId} setSelectedResortId={setSelectedResortId}/>
        <div className="graph">
          <Line options={options} data={data}/>
        </div>
      </div>
    </div>
  );
}

export default Root;
