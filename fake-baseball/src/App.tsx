import {
  Route,
  Routes,
  BrowserRouter,
} from 'react-router-dom';
import FCBPitchers from './views/FCBPitchers';
import FCBBatters from './views/FCBBatters';
import Nav from './views/Nav';
import MLRBatters from './views/MLRBatters';
import MLRPitchers from './views/MLRPitchers';

export default function App() {

  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/r-slash-fake-baseball/fcb/batters" element={<FCBBatters />} />
        <Route path="/r-slash-fake-baseball/fcb/pitchers" element={<FCBPitchers />} />
        <Route path="/r-slash-fake-baseball/mlr/batters" element={<MLRBatters />} />
        <Route path="/r-slash-fake-baseball/mlr/pitchers" element={<MLRPitchers />} />
        {/* <Route path="/r-slash-fake-baseball/mlr/teams" element={<Teams />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
