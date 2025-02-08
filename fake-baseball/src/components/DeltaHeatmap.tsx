import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

interface DeltaHeatmapProps {
  deltas: number[];
}

interface Row {
    id: number; // The delta start value
    [key: string]: number; // Dynamically indexed keys for each delta end value
  }

// Function to round a delta to the nearest value in the delta range
const roundToNearestDelta = (value: number, deltaRange: number[]): number => {
    let closest = deltaRange[0];
    let minDiff = Math.abs(value - closest);

    for (let i = 1; i < deltaRange.length; i++) {
      const diff = Math.abs(value - deltaRange[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closest = deltaRange[i];
      }
    }

    return closest;
};

const DeltaHeatmap: React.FC<DeltaHeatmapProps> = ({ deltas }) => {

  // Define the range of possible delta values
  const deltaRange: number[] = [-500, -400, -300, -200, -100, 0, 100, 200, 300, 400, 500];
  const deltaCount = deltaRange.length;

  // Create a matrix to track delta pair occurrences
  const deltaMatrix: number[][] = Array.from({ length: deltaCount }, () => Array(deltaCount).fill(0));

  // Loop through the deltas to calculate pair occurrences
  for (let i = 1; i < deltas.length; i++) {
    const firstDelta = deltas[i - 1];
    const secondDelta = deltas[i];

    // Round deltas to the nearest value in deltaRange
    const firstRounded = roundToNearestDelta(firstDelta, deltaRange);
    const secondRounded = roundToNearestDelta(secondDelta, deltaRange);

    // Find the index of each delta in the range
    const firstIndex = deltaRange.indexOf(firstRounded);
    const secondIndex = deltaRange.indexOf(secondRounded);

    if (firstIndex >= 0 && secondIndex >= 0) {
      // Increment the matrix cell for the pair of deltas
      deltaMatrix[firstIndex][secondIndex]++;
    }
  }

  // Prepare rows for DataGrid, using the `Row` interface
  const rows: Row[] = deltaMatrix.map((row, rowIndex) => {
    // Use dynamic keys like `col-500`, `col-400`, etc., and map values
    const rowData: { [key: string]: number } = row.reduce((acc, count, colIndex) => {
      acc[`col${deltaRange[colIndex]}`] = count;
      return acc;
    }, {} as { [key: string]: number });

    return {
      id: deltaRange[rowIndex],
      ...rowData, // Spread the dynamic keys into the row object
    };
  });

  // Define columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Delta Start \\ Delta End', width: 150 },
    ...deltaRange.map((delta) => ({
      field: `col${delta}`,
      headerName: `${delta}`,
      width: 100,
      renderCell: (params: any) => (
        <Box
          sx={{
            backgroundColor: getColorForValue(params.value),
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: params.value === 0 ? 'black' : 'white', // Set text color depending on the value
            fontWeight: 'bold',
          }}
        >
          {params.value}
        </Box>
      ),
    })),
  ];

  // Make sure there is no extra column by adjusting columns length properly
  // Check that the number of columns matches the expected delta range
  const expectedColumnCount = deltaRange.length + 1; // +1 for the 'Delta Start \\ Delta End' column
  const actualColumnCount = columns.length;

  if (actualColumnCount !== expectedColumnCount) {
    console.error('Column count mismatch!');
  }

  const getColorForValue = (value: number) => {
    if (value === 0) return '#d3d3d3'; // Light gray for 0 (no pair)
  
    const maxCount = Math.max(...deltaMatrix.flat());
    const ratio = value / maxCount;
  
    // Blue to Pink gradient: low values are blue, high values are pink
    const blue = Math.min(255, Math.floor(255 * (1 - ratio))); // Blue decreases with higher counts
    const red = Math.min(255, Math.floor(255 * ratio)); // Red increases with higher counts
    const green = 105; // Fixed green to avoid too much green (leaning towards pink)
  
    return `rgb(${red},${green},${blue})`; // Red increases as values increase, blue decreases
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Delta Heatmap
      </Typography>
      <DataGrid 
        rows={rows} 
        columns={columns}
        hideFooter
        sx={{
          '& .MuiDataGrid-cell': {
            padding: '8px',  // Adjust padding if necessary
          }
        }}
      />
    </Box>
  );
};

export default DeltaHeatmap;