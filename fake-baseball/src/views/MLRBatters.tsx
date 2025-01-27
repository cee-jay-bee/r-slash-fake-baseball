import * as React from 'react'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import { FormSchemaPlayers } from '../types/schemas/player-schema';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios'
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Grid2';
import { LineChart } from '@mui/x-charts/LineChart';

export default function MLRBatters() {
    const [players, setPlayers] = React.useState<FormSchemaPlayers>([])
    const [batters, setBatters] = React.useState<FormSchemaPlayers>([])
    const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [batterOption, setBatterOption] = React.useState('')
    const [pitchNumbers, setPitchNumbers] = React.useState<number[]>([])
    const [swingNumbers, setSwingNumbers] = React.useState<number[]>([])
    const [pitchCount, setPitchCount] = React.useState<number[]>([])
  
    const theme = createTheme({
      colorSchemes: {
        dark: true,
      },
    });
  
    React.useEffect(() => {
      const fetchPlayerData = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get('https://api.mlr.gg/legacy/api/players')
          setPlayers(response.data);
        } catch (err) {
          setError('Error Fetching Data');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchPlayerData();
    }, []); 
  
    React.useEffect(() => {
      if (players != null) {
        const battersList = []
        for (let i = 0; i < players.length; i++) {
          if(players[i].batType != "" && (players[i].Team == "UWU" || players[i].Team == "ZOO" || players[i].Team == "KSU" || players[i].Team == "BSU" || players[i].Team == "BDE" || players[i].Team == "CSU")) {
            battersList.push(players[i])
          }
        }
        battersList.sort((a, b) => a.playerName.localeCompare(b.playerName));
        setBatters(battersList)
      }
    }, [players])
  
    async function handleChangeBatter(event: SelectChangeEvent) {
      let player = players.find(player => player.playerID === Number(event.target.value))
      if (player) {
        setBatterOption(player.playerName)
      }
      const pNumbers = []
      const sNumbers = []
      const pCount = []
      const p1Numbers = []
      const p1Count = []
      const p2Numbers = []
      const p2Count = []
      const p3Numbers = []
      const p3Count = []
      let p1 = 1
      let p2 = 1
      let p3 = 1
  
      try {
        const response = await axios.get(
          `https://api.mlr.gg/legacy/api/plateappearances/batting/fcb/${event.target.value}`,
        )
        for (let i = 0; i < response.data.length; i++) {
          pNumbers.push(response.data[i].pitch)
          sNumbers.push(response.data[i].swing)
          pCount.push(i+1)
          if ( response.data[i].inning !== (response?.data[i-1]?.inning ?? '0')) {
            p1Numbers.push(response.data[i].pitch)
            p1Count.push(p1)
            p1++
          }
          if ( response.data[i].inning === (response?.data[i-1]?.inning ?? '0') && response.data[i].inning !== (response?.data[i-2]?.inning ?? '0') ) {
            p2Numbers.push(response.data[i].pitch)
            p2Count.push(p2)
            p2++
          }
          if ( response.data[i].inning === (response?.data[i-1]?.inning ?? '0') && response.data[i].inning === (response?.data[i-2]?.inning ?? '0') && response.data[i].inning !== (response?.data[i-3]?.inning ?? '0') ) {
            p3Numbers.push(response.data[i].pitch)
            p3Count.push(p3)
            p3++
          }
          
        }
        setPitches(response.data);
        setPitchNumbers(pNumbers)
        setSwingNumbers(sNumbers)
        setPitchCount(pCount)
        
      } catch (err) {
        setError('Error Fetching Swings');
      } finally {
        setIsLoading(false);
      }
    }
  
    
  
    return (
      <>
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!isLoading && !error &&
          <ThemeProvider theme={theme}>
            <Grid container justifyContent="center">
              <Grid size={12}>
                <FormControl sx={{ m: 1, minWidth: 240, color: "red"}}>
                  <InputLabel id="demo-simple-select-helper-label">Batter</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label={batterOption}
                    onChange={handleChangeBatter}
                    color="warning"
                    value={batterOption}
                  >
                    {
                      batters.map((batter) => {
                        return (
                          <MenuItem key={batter.playerID} value={batter.playerID}>
                            <em>{batter.playerName}</em>
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                  <FormHelperText>Select Batter</FormHelperText>
                </FormControl>
                <TableContainer component={Paper} style={{ maxHeight: document.documentElement.clientHeight * 0.6 }}>
                  <Table stickyHeader sx={{ minWidth: document.documentElement.clientWidth * 0.80}} size="small" aria-label="a dense table" >
                    <TableHead>
                      <TableRow>
                          <TableCell width={50} align="center" >Pitch</TableCell>
                          <TableCell width={50} align="center" >Swing</TableCell>
                          <TableCell width={50} align="center" >Result</TableCell>
                          <TableCell width={50} align="center" >Inning</TableCell>
                          <TableCell width={50} align="center" >Outs</TableCell>
                          <TableCell width={50} align="center" >OBC</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pitches.map((pitch) => {
                          return <TableRow
                          key={pitch.playNumber}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell colSpan= {1} component="th" scope="row" align="center">
                                {pitch.pitch}
                            </TableCell>
                            <TableCell align="center">{pitch.swing}</TableCell>
                            <TableCell align="center">{pitch.exactResult}</TableCell>
                            <TableCell align="center">{pitch.inning}</TableCell>
                            <TableCell align="center">{pitch.outs}</TableCell>
                            <TableCell align="center">{pitch.obc}</TableCell>
                          </TableRow>
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid container justifyContent="center">
                <Grid size={9} alignItems="center" justifyContent="center">
                  {pitchCount.length != 0 && pitchNumbers.length != 0 && swingNumbers.length != 0 &&
                    <LineChart
                      title="All Pitches"
                      xAxis={[{ data: pitchCount }]}
                      series={[
                        {
                          label: "Pitch", data: pitchNumbers, color:"red"
                        },
                        {
                          label: "Swing", data: swingNumbers
                        },
                      ]}
                      width={document.documentElement.clientWidth * 0.50}
                      height={300}
                    />
                  }
                </Grid>
              </Grid>
            </Grid>
          </ThemeProvider>
        } 
      </>
    );
}