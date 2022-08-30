import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Chart from './Chart';
import ColorPicker from './ColorPicker';
import ClickAwayListener from 'react-click-away-listener';
import { useEffect, useState } from 'react';
import useInterval from 'use-interval'

import 'react-toastify/dist/ReactToastify.css';
import './App.css';


import logo from '../../assets/logo-telestar.svg';


const Hello = () => {

  const defaultBackground = 'black';
  const [data, setData] = useState(null);
  const [fileErr, setFileErr] = useState(null);
  const [componentRendered, setComponentRendered] = useState(false);
  const [background, setBackground] = useState(defaultBackground);
  const [colorPickerBg, setColorPickerBg] = useState(null);
  const [path, setPath] = useState('');
  const [order, setOrder] = useState('DESC');
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (componentRendered) return;

    setComponentRendered(true);
    const fetchData = async () => {
      const data = await window.electron.getData('get-data');
      try {

        setData(JSON.parse(data))
      } catch (err) {
        console.log(err)
      }
      return data;
    }

    fetchData();

  }, [data]);

  useEffect(() => {
    if (componentRendered) return;

    setComponentRendered(true);
    const fetchSettings = async () => {
      const background = await window.electron.getSetting('get-setting', 'background');
      const path = await window.electron.getSetting('get-setting', 'path');
      const order = await window.electron.getSetting('get-setting', 'path');

      setPath(path);

      if (order) {
        setOrder(order);
      }

      if (background) {
        setBackground(background);
      }
    }

    fetchSettings();
  });


  const fetchData = async () => {
    const data = await window.electron.getData('get-data');
    try {
      setData(JSON.parse(data));
      setFileErr(null);
    } catch (err) {
      setFileErr(err.message);
      console.log(err)
    }
    return data;
  }


  useInterval(() => {
    fetchData();
  }, 3000); // passing null instead of 1000 will cancel the interval if it is already running


  const onFileChange = async (e) => {
    e.preventDefault()
    const reader = new FileReader();

    const file = e.target.files[0];

    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target.result);
        window.electron.sendPath('path', file.path);
        window.electron.saveSettings('save-settings', 'path', file.path);
        setPath(file.path);
        setData(json);
        setFileErr(null);
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
        <Chart data={data} order={order} />
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
    setPath('');
    window.electron.saveSettings('save-settings', 'path', null);
  }

  const onClickColorBtn = (e) => {
    e.preventDefault();
    setShowColorPicker(!showColorPicker);
  }

  const onChangeColor = (color) => {
    setBackground(color.hex);
    window.electron.saveSettings('save-settings', 'background', color.hex);
  }

  const onChangeOrder = (e) => {
    setOrder(e.target.value);
    window.electron.saveSettings('save-settings', 'order', e.target.value);
  }

  return (
    <div className='vRoot' style={{ background }}>
      <div className='vSettings'>
        <button onClick={onClickColorBtn}>Background Color</button>
        {showColorPicker &&
          <ClickAwayListener onClickAway={() => setShowColorPicker(false)}>
            <div className='colorPicCont'>
              <ColorPicker
                color={background}
                onChange={onChangeColor}
              />
            </div>
          </ClickAwayListener>
        }
      </div>
      <div className='vMain'>
        <img className='logo' src={logo} />
        <div className='chartSettings'>
          {data && data.length &&
            <p className='formEl'>All: {data.length}</p>
          }
          <form className='form'>
            <input className='fakeFileInput' type="text" disabled value={path} />

            {(data === null) &&
              <label className='button' htmlFor="fileInput">
                Select
                <input name='' id="fileInput" className='hidden' type="file" accept=".json" onChange={onFileChange} />
              </label>}

            {(data !== null) && <button onClick={onClear}>Clear</button>}
          </form>
          {data !== null &&
            <div className='formEl'>
              <label className='label' htmlFor="selectOrder">
                Order
              </label>
              <select id="selectOrder" onChange={onChangeOrder}>
                {['ASC', 'DESC'].map((op) => {
                  if (op === order) {
                    return <option key={op} value={op}>{op === 'ASC' ? 'Ascending' : 'Descending'}</option>
                  }
                  return <option key={op} value={op}>{op === 'ASC' ? 'Ascending' : 'Descending'}</option>
                })}
              </select>
            </div>
          }
        </div>
        {renderChart()}
      </div>
    </div >
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
