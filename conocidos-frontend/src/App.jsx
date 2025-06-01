import { BrowserRouter, Routes, Route } from 'react-router'
import Start from "@/pages/Start"
import Error from '@/pages/Error'
import Welcome from '@/pages/Welcome'
import CreateRoom from '@/pages/CreateRoom'
import JoinRoom from "@/pages/JoinRoom"
import Lobby from '@/pages/Lobby'
import Questions from '@/pages/Questions'
import Game from './pages/Game'
import Leaderboard from './pages/Leaderboard'
import Header from './components/Header'
import Layout from './components/Layout'


function App() {

  return (
    <div className='bg-amber-500/20'>
        <BrowserRouter>
        <Routes>   
            <Route index element={<Start />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/lobby" element={<Welcome />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/join-room" element={<JoinRoom />} />
            <Route path="/questions/:roomId" element={<Questions />} />
            <Route path="/lobby/:roomCode" element={<Lobby />} />
            <Route path="/game/:roomId" element={<Game />} />
            <Route path="/end/:roomId" element={<Leaderboard />} />
            <Route path="*" element={<Error />} />
        </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
