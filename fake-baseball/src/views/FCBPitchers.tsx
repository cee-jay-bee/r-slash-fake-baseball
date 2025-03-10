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
import { calculateCircleDelta } from '../utils/utils';
import { FormSchemaPitchInInning } from '../types/schemas/pitch-in-inning-schema';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';

export default function FCBPitchers() {
    const [players, setPlayers] = React.useState<FormSchemaPlayers>([])
    const [pitchers, setPitchers] = React.useState<FormSchemaPlayers>([])
    const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [pitcherOption, setPitcherOption] = React.useState<number>()
    const [pitchNumbers, setPitchNumbers] = React.useState<number[]>([])
    const [swingNumbers, setSwingNumbers] = React.useState<number[]>([])
    const [deltaNumbers, setDeltaNumbers] = React.useState<number[]>([])
    const [pitchCount, setPitchCount] = React.useState<number[]>([])
    const [pitch1Numbers, setPitch1Numbers] = React.useState<number[]>([])
    const [pitch1Count, setPitch1Count] = React.useState<number[]>([])
    const [pitch2Numbers, setPitch2Numbers] = React.useState<number[]>([])
    const [pitch3Numbers, setPitch3Numbers] = React.useState<number[]>([])
    const [inningNumbers, setInningNumbers] = React.useState<FormSchemaPitchInInning>([])
    const [innings, setInnings] = React.useState<number []>([])
  
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
        const pitchersList = []
        for (let i = 0; i < players.length; i++) {
          if(players[i].pitchType != "" ) {
            pitchersList.push(players[i])
          }
        }
        pitchersList.sort((a, b) => a.playerName.localeCompare(b.playerName));
        setPitchers(pitchersList)
      }
    }, [players])

    const colors: { [key: number]: string } = {
      1: 'red',
      2: 'orange',
      3: 'yellow',
      4: 'green',
      5: 'blue',
      6: 'indigo',
      7: 'violet',
      8: 'gray',
      9: 'white',
      10: 'crimson',
      11: 'coral',
      12: 'khaki',
      13: 'mediumseagreen',
      14: 'aqua',
      15: 'mediumslateblue',
    };
  
    async function handleChangePitcher(event: SelectChangeEvent) {
      setPitches([])
      let player = players.find(player => player.playerID === Number(event.target.value))
      if (player) {
        setPitcherOption(Number(event.target.value))
      }
      const pNumbers = []
      const sNumbers = []
      const dNumbers = []
      const pCount = []
      const p1Numbers = []
      const p1Count = []
      const p2Numbers = []
      const p2Count = []
      const p3Numbers = []
      const p3Count = []
      let inningPitches = []
      let currentChunk = []
      let p1 = 1
      let p2 = 1
      let p3 = 1
      let inningObject: { inning: number, pitches: number[] }[] = [];
      let innings = []
  
      try {
        const response = await axios.get(
          `https://api.mlr.gg/legacy/api/plateappearances/pitching/fcb/${event.target.value}`,
        )
        for (let i = 0; i < response.data.length; i++) {
          pNumbers.push(response.data[i].pitch)
          sNumbers.push(response.data[i].swing)
          dNumbers.push(calculateCircleDelta(response.data[i], response.data[i-1]))
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
          if (currentChunk.length === 0 || response.data[i-1].inning === response.data[i].inning) {
            currentChunk.push(response.data[i].pitch);
          } else {
            inningPitches.push(currentChunk);
            currentChunk = [response.data[i].pitch];
          }
        }
        
        if (currentChunk.length > 0) {
          inningPitches.push(currentChunk);
        }

        for (let i=0; i< inningPitches.length; i++){
          inningObject.push({inning: i+1, pitches: inningPitches[i]})
          innings.push(i+1)
        }
        console.log(dNumbers)
        console.log(inningObject)
        console.log(innings)
        setPitches(response.data)
        setPitchNumbers(pNumbers)
        setSwingNumbers(sNumbers)
        setDeltaNumbers(dNumbers)
        setPitchCount(pCount)
        setPitch1Numbers(p1Numbers)
        setPitch1Count(p1Count)
        setPitch2Numbers(p2Numbers)
        setPitch3Numbers(p3Numbers)
        setInnings(innings)
        setInningNumbers(inningObject)
        
      } catch (err) {
        setError('Error Fetching Pitches');
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
            <Grid container justifyContent="center" style={{padding: 100}}>
              <Grid size={12}>
                <FormControl sx={{ m: 1, minWidth: 240, color: "red"}}>
                  <InputLabel id="demo-simple-select-helper-label">Pitcher</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label={pitcherOption ? pitchers.find(p => p.playerID === pitcherOption)?.playerName : "Select a pitcher"}
                    onChange={handleChangePitcher}
                    color="warning"
                    value={pitcherOption ? pitcherOption.toString() : ""}
                  >
                    {
                      pitchers.map((pitcher) => {
                        return (
                          <MenuItem key={pitcher.playerID} value={pitcher.playerID}>
                            <em>{pitcher.playerName}</em>
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                  <FormHelperText>Select Pitcher</FormHelperText>
                </FormControl>
                <TableContainer component={Paper} style={{ maxHeight: document.documentElement.clientHeight * 0.4 }}>
                  <Table stickyHeader sx={{ minWidth: document.documentElement.clientWidth * 0.80}} size="small" aria-label="a dense table" >
                    <TableHead>
                      <TableRow>
                          <TableCell width={50} align="center" >Pitch</TableCell>
                          <TableCell width={50} align="center" >Swing</TableCell>
                          <TableCell width={50} align="center" >Result</TableCell>
                          <TableCell width={50} align="center" >Inning</TableCell>
                          <TableCell width={50} align="center" >Outs</TableCell>
                          <TableCell width={50} align="center" style={{borderRightWidth: 1, borderRightColor: 'red',borderRightStyle: 'solid'}}>OBC</TableCell>
                          <TableCell width={50} align="center">Season</TableCell>
                          <TableCell width={50} align="center">Session</TableCell>
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
                            <TableCell align="center" style={{borderRightWidth: 1, borderRightColor: 'red',borderRightStyle: 'solid'}}>{pitch.obc}</TableCell>
                            <TableCell colSpan= {1} component="th" scope="row" align="center">
                              {pitch.season}
                            </TableCell>
                            <TableCell align="center">{pitch.session}</TableCell>
                          </TableRow>
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid size={{xs:12, sm:12, md:12, lg:12}} container justifyContent="center">
                <Grid size={{xs:12, sm:12, md:12, lg:12}} alignItems="center" justifyContent="center">
                  {pitchCount.length != 0 && pitchNumbers.length != 0 && swingNumbers.length != 0 &&
                    <LineChart
                      title="All Pitches"
                      xAxis={[{ data: pitchCount }]}
                      series={[
                        {
                          label: "Pitch", data: pitchNumbers, color:"red"
                        },
                      ]}
                      height={document.documentElement.clientHeight * 0.40}
                      tooltip={{trigger: 'item'}}
                    />
                  }
                </Grid>
              </Grid>
              <Grid size={{xs:12, sm:12, md:12, lg:12}} container justifyContent="center">
                <Grid size={{xs:12, sm:12, md:12, lg:12}} alignItems="center" justifyContent="center" >
                  {pitchCount.length != 0 && pitchNumbers.length != 0 && swingNumbers.length != 0 &&
                    <LineChart
                      title="Pitches by Placement in Inning"
                      xAxis={[{ label: "Inning", data: pitch1Count }]}
                      series={[
                        {
                          label: "First Pitches", data: pitch1Numbers, color:"red"
                        },
                        {
                          label: "Second Pitches", data: pitch2Numbers, color:"green"
                        },
                        {
                          label: "Third Pitches", data: pitch3Numbers, color:"white"
                        },
                      ]}
                      height={document.documentElement.clientHeight * 0.40}
                      tooltip={{trigger: 'item'}}
                    />
                  }
                </Grid>
              </Grid>
              <Grid size={{xs:12, sm:12, md:12, lg:12}} container justifyContent="center">
                <Grid size={{xs:12, sm:12, md:12, lg:12}} alignItems="center" justifyContent="center">
                  {deltaNumbers.length != 0 &&
                    <LineChart
                      title="Delta from Pitch to Pitch"
                      xAxis={[{ data: pitchCount }]}
                      yAxis={[{
                        min: -500,   // Set the minimum value for Y-Axis
                        max: 500,    // Set the maximum value for Y-Axis
                        tickInterval: [-500, -400, -300, -200, -100, 0, 100, 200, 300, 400, 500], // Set custom tick values
                      },]}
                      series={[
                        {
                          label: "Delta", data: deltaNumbers, color:"teal"
                        },
                      ]}
                      height={document.documentElement.clientHeight * 0.40}
                      tooltip={{trigger: 'item'}}
                    >
                      <ChartsReferenceLine y={0} label="0" labelAlign="end" />
                    </LineChart>
                  }
                </Grid>
              </Grid>
              <Grid size={{xs:12, sm:12, md:12, lg:12}} container justifyContent="center" >
                <Grid size={{xs:12, sm:12, md:12, lg:12}} alignItems="center" justifyContent="center">
                  {pitchCount.length != 0 && pitchNumbers.length != 0 && swingNumbers.length != 0 && inningNumbers.length != 0 &&
                    <LineChart
                      title="Pitches by Inning"
                      xAxis={[{ data: innings, label: "Pitch Number", tickInterval: [1,2,3,4,5,6,7,8,9,10] }]}
                      series={inningNumbers.map((series) =>({
                        data: series.pitches,
                        label: `Inning ${series.inning.toString()}`,
                        color: colors[series.inning]
                      }))}
                      height={document.documentElement.clientHeight * 0.50}
                      tooltip={{trigger: 'item'}}
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