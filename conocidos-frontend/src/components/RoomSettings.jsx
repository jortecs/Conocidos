import {useState, useRef, useEffect, use} from 'react';
import { useTriviaStore } from "../store/store";
import {io} from 'socket.io-client';

const RoomSettings = () => {
    const { room, setRoom, showSettings, setShowSettings } = useTriviaStore(state => state)
    const [newMaxPlayers, setNewMaxPlayers] = useState(room.maxPlayers);
    const [newMaxQuestions, setNewMaxQuestions] = useState(room.maxQuestions);
    const socketRef = useRef()

    if (!socketRef.current) {
        socketRef.current = io('http://localhost:3000')
    }
    const socket = socketRef.current;

    const handleSave = async () => {
      console.log(newMaxPlayers, newMaxQuestions)
      const newRoomSettings = {...room, maxPlayers: Number(newMaxPlayers), maxQuestions: Number(newMaxQuestions)}
      await setRoom(newRoomSettings)
      socket.emit('room-settings-changed', {roomId: room.code , room: newRoomSettings})
      handleCancel()
    };

    const handleCancel = () => {
      setShowSettings(false)
    }
    
      return (
        <div className="fixed inset-0 bg-gray-950/20 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Room Settings</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Max Players</label>
              <input
                type="number"
                value={newMaxPlayers}
                onChange={(e) => setNewMaxPlayers(e.target.value)}
                className="w-full border rounded px-2 py-1"
                min={2} max={5}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Max Questions</label>
              <input
                type="number"
                value={newMaxQuestions}
                onChange={(e) => setNewMaxQuestions(e.target.value)}
                className="w-full border rounded px-2 py-1"
                min={1} max={4}
              />
            </div>
            <div className="flex justify-center gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-md sm:text-lg  rounded hover:bg-red-400  bg-red-500 text-white "
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-md sm:text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded hover:bg-amber-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      );
};

export default RoomSettings;