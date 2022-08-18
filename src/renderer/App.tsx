import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Chart from './Chart';
import { useState } from 'react';
import './App.css';


const Hello = () => {


  const [data, setData] = useState(null);
  const [fileErr, setFileErr] = useState(null);

  const onFileChange = (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const json = JSON.parse(e.target.result);
        setData(json);
        fileErr(null);
      } catch (err) {
        setFileErr('Invalid file!');
        console.log(err);
      }
    };
    reader.readAsText(e.target.files[0])
  }

  const renderChart = () => {

    if (data) {
      return (
        <Chart data={data} />
      );
    } else if (fileErr) {

      return (
        <h2 className='hErr'>{fileErr}</h2>
      )

    }

    return (
      <h2 className='hMsg'>No file selected!</h2>
    )
  }

  const onClear = (e) => {
    e.preventDefault();
    setData(null);
  }

  console.log('data')
  console.log(data)

  return (
    <div>
      <form>
        <input type="file" accept=".json" onChange={onFileChange} />
        {(data !== null) && <button onClick={onClear}>Clear</button>}
      </form>
      {renderChart()}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
