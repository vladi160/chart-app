import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import style from './Chart.mpodule.js';


const Chart = ({ data }) => {

    data = (data && data.length) ? data.map(el => { return { y: parseFloat(el.y), name: el.label } }) : [];
    const renderChart = () => {

        if (data && data.length) {

            return (
                <BarChart
                    layout="vertical"
                    width={1600}
                    height={data.length * 60}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="y" type='number' />
                    <YAxis type="category" width={450} padding={{ left: 20 }} dataKey="name" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="y" fill="#8884d8" />
                </BarChart>
            )
        }

        return <></>;
    }

    return (
        <>
            {renderChart()}
        </>
    )
}

export default Chart;