import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';

function createData(time, amount)
{
	return { time, amount };
}

function getUserChartData(users)
{
	var today = new Date();
	let data = [];
	let val = 0;
	for (let i = 90; i >= 0; i--)
	{
		var priorDate = new Date(new Date().setDate(today.getDate() - i)).toISOString().substring(2, 10)
		users.map(el =>
		{
			if (new Date(el.date[0]).toISOString().substring(2, 10) === priorDate) 
			{
				val++;
			}
		})
		data.push(createData(priorDate, val))
	}
	return data;
}

function Chart(props)
{
	const theme = useTheme();

	const { users } = props;

	const chartData = getUserChartData(users)

	return (
		<React.Fragment>
			<Title>Last Month</Title>
			<ResponsiveContainer>
				<LineChart
					data={chartData}
					margin={{
						top: 16,
						right: 16,
						bottom: 0,
						left: 24,
					}}
				>
					<XAxis
						dataKey="time"
						stroke={theme.palette.text.secondary}
						style={theme.typography.body2}
					/>
					<YAxis
						stroke={theme.palette.text.secondary}
						style={theme.typography.body2}
						allowDecimals={false}
					>
						<Label
							angle={270}
							position="left"
							style={{
								textAnchor: 'middle',
								fill: theme.palette.text.primary,
								...theme.typography.body1,
							}}
						>
							Users
						</Label>
					</YAxis>
					<Line
						isAnimationActive={false}
						type="monotone"
						dataKey="amount"
						stroke={theme.palette.primary.main}
						dot={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		</React.Fragment>
	);
}

export default Chart;