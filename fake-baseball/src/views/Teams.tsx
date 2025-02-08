import * as React from 'react'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';
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
import { SelectTeams } from '../constants/teams';

export default function Teams() {
    const [team, setTeam] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [plateAppearances, setPlateAppearances] = React.useState<FormSchemaPitches>([])
    const [teamPitches, setTeamPitches] = React.useState<FormSchemaPitches>([])
    const [teamSwings, setTeamSwings] = React.useState<FormSchemaPitches>([])

    
    const [pitchNumbers, setPitchNumbers] = React.useState<number[]>([])
    const [swingNumbers, setSwingNumbers] = React.useState<number[]>([])
    const [pitchCount, setPitchCount] = React.useState<number>(0)
    const [swingCount, setSwingCount] = React.useState<number>(0)
    const [pitchAtBats, setPitchAtBats] = React.useState<FormSchemaPitches>([])
    const [swingAtBats, setSwingAtBats] = React.useState<FormSchemaPitches>([])
    const [session, setSession] = React.useState<number>(0)
    const [season, setSeason] = React.useState<number>(11)
  
    const theme = createTheme({
      colorSchemes: {
        dark: true,
      },
    });
  
    React.useEffect(() => {
      const fetchPlateAppearances = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get('https://api.mlr.gg/legacy/api/plateappearances/mlr')
          console.log(response.data)
          setPlateAppearances(response.data);
        } catch (err) {
          setError('Error Fetching Data');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchPlateAppearances();
    }, [team]); 

    React.useEffect(() => {
      parseSeasonSessionData();
    }, [season, session])

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
      let filteredPitches: FormSchemaPitches = []
      let filteredSwings: FormSchemaPitches = []
      let pNumbers = []
      let sNumbers = []

      filteredPitches = teamPitches.filter((pitch) => pitch.session === session && pitch.season === season)
      filteredSwings = teamSwings.filter((pitch) => pitch.session === session && pitch.season === season)
      
      console.log(filteredPitches)
      console.log(filteredSwings)

      for (let i = 0; i < filteredPitches.length; i++){
        pNumbers.push(filteredPitches[i].pitch)
      }

      for (let i = 0; i < filteredSwings.length; i++){
        sNumbers.push(filteredSwings[i].pitch)
      }

      setPitchAtBats(filteredPitches)
      setSwingAtBats(filteredSwings)
      setPitchCount(filteredPitches.length)
      setSwingCount(filteredSwings.length)
      setPitchNumbers(pNumbers)
      setSwingNumbers(sNumbers)
    }
  
    async function handleChangeTeam(event: SelectChangeEvent) {
      setTeam(event.target.value)
      setTeamPitches([])
      setTeamSwings([])
      let filteredPitches: FormSchemaPitches = []
      let filteredSwings: FormSchemaPitches = []

      filteredPitches = plateAppearances.filter((pitch) => pitch.pitcherTeam === event.target.value)
      filteredSwings = plateAppearances.filter((pitch) => pitch.hitterTeam === event.target.value)
      console.log(filteredPitches)
      console.log(filteredSwings)
      
      setTeamPitches(filteredPitches)
      setTeamSwings(filteredSwings)
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
                  <InputLabel id="demo-simple-select-helper-label">Team</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label={team ? team : "Select a Team"}
                    onChange={handleChangeTeam}
                    color="warning"
                    value={team ? team : ""}
                  >
                    {
                      SelectTeams.map((team) => {
                        return (
                          <MenuItem key={team.label} value={team.value}>
                            <em>{team.label}</em>
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                  <FormHelperText>Select Team</FormHelperText>
                </FormControl>
                <FormControl variant='filled' sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-helper-label">Season</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label={team}
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
                    label={team}
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
                {pitchAtBats.length != 0 &&
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
                      {pitchAtBats.map((pitch) => {
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
              }     
              </Grid>
              <Grid size={{xs:12, sm:12, md:12, lg:12}} container justifyContent="center">
                <Grid alignItems="center" justifyContent="center" width='100%'>
                  {pitchCount != 0 && pitchNumbers.length != 0 &&
                    <LineChart
                      title="All Pitches"
                      xAxis={[{ data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] }]}
                      series={[
                        {
                          label: "Pitch", data: pitchNumbers, color:"red"
                        },
                      ]}
                      height={document.documentElement.clientHeight * 0.50}
                    />
                  }
                </Grid>
              </Grid>
              {swingAtBats.length != 0 &&
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
                      {swingAtBats.map((pitch) => {
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
              }
              <Grid size={{xs:12, sm:12, md:12, lg:12}} container justifyContent="center">
                <Grid alignItems="center" justifyContent="center" width='100%'>
                  {swingCount != 0 && swingNumbers.length != 0 &&
                    <LineChart
                      title="All Swings"
                      xAxis={[{ data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] }]}
                      series={[
                        {
                          label: "Swing", data: swingNumbers
                        },
                      ]}
                      height={document.documentElement.clientHeight * 0.50}
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