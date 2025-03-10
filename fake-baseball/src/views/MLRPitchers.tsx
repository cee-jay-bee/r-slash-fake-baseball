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
import DeltaHeatmap from '../components/DeltaHeatmap';

export default function MLRPitchers() {
    const [players, setPlayers] = React.useState<FormSchemaPlayers>([])
    const [pitchers, setPitchers] = React.useState<FormSchemaPlayers>([])
    const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [pitcherOption, setPitcherOption] = React.useState<number>()
    const [pitchNumbers, setPitchNumbers] = React.useState<number[]>([])
    const [swingNumbers, setSwingNumbers] = React.useState<number[]>([])
    const [deltaNumbers, setDeltaNumbers] = React.useState<number[]>([])
    const [allDeltaNumbers, setAllDeltaNumbers] = React.useState<number[]>([])
    const [pitchCount, setPitchCount] = React.useState<number[]>([])
    const [pitch1Numbers, setPitch1Numbers] = React.useState<number[]>([])
    const [pitch1Count, setPitch1Count] = React.useState<number[]>([])
    const [pitch2Numbers, setPitch2Numbers] = React.useState<number[]>([])
    const [pitch3Numbers, setPitch3Numbers] = React.useState<number[]>([])
    const [inningNumbers, setInningNumbers] = React.useState<FormSchemaPitchInInning>([])
    const [session, setSession] = React.useState<number>(0)
    const [season, setSeason] = React.useState<number>(11)
  
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
          if(players[i].pitchType != "" && players[i].Team != "" ) {
            pitchersList.push(players[i])
          }
        }
        pitchersList.sort((a, b) => a.playerName.localeCompare(b.playerName));
        setPitchers(pitchersList)
      }
    }, [players])

    React.useEffect(() => {
      parseSeasonSessionData();
    }, [season, session, pitcherOption])

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

    function handleChangeSession(event: SelectChangeEvent) {
      setSession(Number(event.target.value))
    }

    function handleChangeSeason(event: SelectChangeEvent) {
      setSeason(Number(event.target.value))
    }

    function parseSeasonSessionData() {
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
      let currentChunk: number[] = []
      let p1 = 1
      let p2 = 1
      let p3 = 1
      let inningObject: { inning: number, pitches: number[] }[] = [];
      let filteredPitches: FormSchemaPitches = []

      filteredPitches = pitches.filter((pitch) => pitch.session === session && pitch.season === season)
      console.log(filteredPitches)

      for ( let i = 0; i< filteredPitches.length; i++) {
        pNumbers.push(filteredPitches[i].pitch)
        sNumbers.push(filteredPitches[i].swing)
        dNumbers.push(calculateCircleDelta(filteredPitches[i], filteredPitches[i-1]))
        pCount.push(i+1)

        if ( filteredPitches[i].inning !== (filteredPitches[i-1]?.inning ?? '0')) {
          p1Numbers.push(filteredPitches[i].pitch)
          p1Count.push(p1)
          p1++
        }
        if ( filteredPitches[i].inning === (filteredPitches[i-1]?.inning ?? '0') && filteredPitches[i].inning !== (filteredPitches[i-2]?.inning ?? '0') ) {
          p2Numbers.push(filteredPitches[i].pitch)
          p2Count.push(p2)
          p2++
        }
        if ( filteredPitches[i].inning === (filteredPitches[i-1]?.inning ?? '0') && filteredPitches[i].inning === (filteredPitches[i-2]?.inning ?? '0') && filteredPitches[i].inning !== (filteredPitches[i-3]?.inning ?? '0') ) {
          p3Numbers.push(filteredPitches[i].pitch)
          p3Count.push(p3)
          p3++
        }
        
        if (currentChunk.length === 0 || filteredPitches[i-1].inning === filteredPitches[i].inning) {
          currentChunk.push(filteredPitches[i].pitch);
        } else {
          inningPitches.push(currentChunk);
          currentChunk = [filteredPitches[i].pitch];
        }
      }
      if (currentChunk.length > 0) {
        inningPitches.push(currentChunk);
      }

      for (let i=0; i< inningPitches.length; i++){
        inningObject.push({inning: i+1, pitches: inningPitches[i]})
      }

      console.log(inningObject)
      setDeltaNumbers(dNumbers)
      setPitchNumbers(pNumbers)
      setSwingNumbers(sNumbers)
      setPitchCount(pCount)
      setPitch1Numbers(p1Numbers)
      setPitch1Count(p1Count)
      setPitch2Numbers(p2Numbers)
      setPitch3Numbers(p3Numbers)
      setInningNumbers(inningObject)
      
    }
  
    async function handleChangePitcher(event: SelectChangeEvent) {
      setPitches([])
      const aDNumbers = []
      let player = players.find(player => player.playerID === Number(event.target.value))
      if (player) {
        setPitcherOption(Number(event.target.value))
      }
    
      try {
        const response = await axios.get(
          `https://api.mlr.gg/legacy/api/plateappearances/pitching/mlr/${event.target.value}`,
        )

        for ( let i = 0; i< response.data.length; i++) {
          aDNumbers.push(calculateCircleDelta(response.data[i], response.data[i-1]))
        }
        
        setPitches(response.data)
        setAllDeltaNumbers(aDNumbers)
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
                <FormControl variant='filled' sx={{ m: 1, minWidth: 240 }}>
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
                <FormControl variant='filled' sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-helper-label">Season</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label={season}
                    onChange={handleChangeSeason}
                    color="warning"
                    value={season.toString()}
                  >
                    <MenuItem value={11}>11</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant='filled' sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-helper-label">Session</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label={session}
                    onChange={handleChangeSession}
                    color="warning"
                    value={session.toString()}
                  >
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={19}>19</MenuItem>
                    <MenuItem value={18}>18</MenuItem>
                    <MenuItem value={17}>17</MenuItem>
                    <MenuItem value={16}>16</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={14}>14</MenuItem>
                    <MenuItem value={13}>13</MenuItem>
                    <MenuItem value={12}>12</MenuItem>
                    <MenuItem value={11}>11</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={0}>0</MenuItem>
                  </Select>
                </FormControl>
                <TableContainer component={Paper} style={{ maxHeight: document.documentElement.clientHeight * 0.4 }}>
                  <Table stickyHeader sx={{ minWidth: document.documentElement.clientWidth * 0.80}} size="small" aria-label="a dense table" >
                    <TableHead>
                      <TableRow>
                          <TableCell width={50} align="center" >Pitch</TableCell>
                          <TableCell width={50} align="center" >Swing</TableCell>
                          <TableCell width={50} align="center" >PDiff</TableCell>
                          <TableCell width={50} align="center" >Result</TableCell>
                          <TableCell width={50} align="center" >Inning</TableCell>
                          <TableCell width={50} align="center" >Outs</TableCell>
                          <TableCell width={50} align="center" style={{borderRightWidth: 1, borderRightColor: 'red',borderRightStyle: 'solid'}}>OBC</TableCell>
                          <TableCell width={50} align="center">Season</TableCell>
                          <TableCell width={50} align="center">Session</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pitches.map((pitch, index, array) => {
                          return <TableRow
                          key={pitch.playNumber}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell colSpan= {1} component="th" scope="row" align="center">
                                {pitch.pitch}
                            </TableCell>
                            <TableCell align="center">{pitch.swing}</TableCell>
                            <TableCell align="center">{calculateCircleDelta(pitch, array[index-1])}</TableCell>
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
              <Grid container justifyContent="center">
                <Grid size={{xs:12, sm:12, md:12, lg:12}} alignItems="center" justifyContent="center" width='100%'>
                  {allDeltaNumbers.length != 0 &&
                    <DeltaHeatmap deltas={allDeltaNumbers} />
                  }
                </Grid>
              </Grid>
              <Grid size={{xs:12, sm:12, md:12, lg:12}} container justifyContent="center" spacing={2}>
                <Grid alignItems="center" justifyContent="center" width='100%'>
                  {pitchCount.length != 0 && pitchNumbers.length != 0 && swingNumbers.length != 0 &&
                    <LineChart
                      title="All Pitches"
                      xAxis={[{ data: pitchCount, tickInterval: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] }]}
                      series={[
                        {
                          label: "Pitch", data: pitchNumbers, color:"red"
                        },
                        {
                          label: "Swing", data: swingNumbers
                        },
                      ]}
                      height={document.documentElement.clientHeight * 0.50}
                    />
                  }
                </Grid>
              </Grid>
              <Grid size={{xs:12, sm:12, md:12, lg:12}} container justifyContent="center">
                <Grid alignItems="center" justifyContent="center" width='100%'>
                  {pitchCount.length != 0 && pitchNumbers.length != 0 && swingNumbers.length != 0 &&
                    <LineChart
                      title="Pitches by Placement in Inning"
                      xAxis={[{ label: "Inning", data: pitch1Count, tickInterval: [1,2,3,4,5,6,7,8,9,10] }]}
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
                      height={document.documentElement.clientHeight * 0.50}
                    />
                  }
                </Grid>
              </Grid>
              <Grid size={{xs:12, sm:12, md:12, lg:12}} alignItems="center" justifyContent="center" width='100%'>
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
              <Grid size={{xs:12, sm:12, md:12, lg:12}} container justifyContent="center" >
                <Grid alignItems="center" justifyContent="center" width='100%'>
                  {pitchCount.length != 0 && pitchNumbers.length != 0 && swingNumbers.length != 0 && inningNumbers.length != 0 &&
                    <LineChart
                      title="Pitches by Inning"
                      xAxis={[{ data: [1,2,3,4,5,6,7,8], label: "Pitch Number", tickNumber: 15, tickInterval: [1,2,3,4,5,6,7,8,9,10], scaleType: 'point', min: 1, max: 10}
                      ]}
                      series={inningNumbers.map((series) =>({
                        data: series.pitches,
                        label: `In ${series.inning.toString()}`,
                        color: colors[series.inning]
                      }))}
                      height={document.documentElement.clientHeight * 0.90}
                      margin= {{top: 100}}
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