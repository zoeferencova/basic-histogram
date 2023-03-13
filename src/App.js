import React from 'react';
import { scaleLinear, scaleTime, max, extent, timeFormat, bin, timeMonths, sum } from 'd3';
import { useData } from './hooks/useData'
import { AxisBottom } from './components/AxisBottom'
import { AxisLeft } from './components/AxisLeft'
import { Marks } from './components/Marks'

const width = 960;
const height = 500;
const margin = { top: 30, right: 30, bottom: 75, left: 90 };
const xAxisLabelOffset = 55;
const yAxisLabelOffset = 55;

export const App = () => {
  const data = useData();

  if (!data) {
    return <pre>"Loading..."</pre>;
  }

  const xValue = d => d.date;
  const xAxisLabel = "Time";

  const yValue = d => d.person_count;
  const yAxisLabel = "Count";

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const xAxisTickFormat = timeFormat('%m/%d/%y');

  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth])

  const [start, stop] = xScale.domain()

  const binnedData = bin()
    .value(xValue)
    .domain(xScale.domain())
    .thresholds(timeMonths(start, stop))
    (data)
    .map(array => ({
      y: sum(array, yValue),
      x0: array.x0,
      x1: array.x1
    }))

  const yScale = scaleLinear()
    .domain([0, max(binnedData, d => d.y)])
    .range([innerHeight, 0])
    .nice()

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <AxisBottom
          xScale={xScale}
          innerHeight={innerHeight}
          tickFormat={xAxisTickFormat}
          tickOffset={12}
        />
        <text
          className="axis-label"
          textAnchor="middle"
          transform={`translate(${-yAxisLabelOffset}, ${innerHeight / 2}) rotate(-90)`}
        >
          {yAxisLabel}
        </text>
        <AxisLeft
          yScale={yScale}
          innerWidth={innerWidth}
          tickOffset={8}
        />
        <text
          className="axis-label"
          x={innerWidth / 2}
          y={innerHeight + xAxisLabelOffset}
          textAnchor="middle"
        >
          {xAxisLabel}
        </text>
        <Marks
          xScale={xScale}
          yScale={yScale}
          binnedData={binnedData}
          innerHeight={innerHeight}
        />
      </g>
    </svg>
  );
};
