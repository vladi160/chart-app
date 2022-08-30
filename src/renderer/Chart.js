import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import style from './Chart.mpodule.js';


const CustomizedLabel = () => {

    return (
        <p>test</p>
    )
}

const Chart = ({ data, order }) => {

    data = (data && data.length) ? data.map(el => { return { y: parseFloat(el.y), name: el.label } }) : [];

    const orderedData = order === 'DESC' ?
        data.sort((a, b) => b.y - a.y) :
        data.sort((a, b) => a.y - b.y)
    const renderChart = () => {

        if (orderedData && orderedData.length) {

            return (
                <BarChart
                    layout="vertical"
                    width={1600}
                    height={data.length * 60}
                    data={orderedData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="y" type='number'
                    />
                    <YAxis className='yAxis' type="category" width={450} padding={{ left: 20 }} dataKey="name"
                        style={{
                            fontWeight: 'bold',
                        }}
                        tick={{ fill: 'white' }} tickLine={{ stroke: 'white' }}

                    />
                    <Tooltip />
                    <Bar label={{ fill: 'white', fontSize: 20 }} dataKey="y" fill="#1a4f9c" />
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