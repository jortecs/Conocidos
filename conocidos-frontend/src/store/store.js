import { create } from "zustand";
import { persist } from 'zustand/middleware'


export const useTriviaStore = create (persist((set) => ({
  roomPlayers:[],
  setRoomPlayers: (roomPlayers) => set({roomPlayers}),
  player: {
    id: null,
    nickname: "",
    avatar: "cat",
    isReady: false,
    isHost: false,
    score: 0,
    roomId: null,
    
  },
  setPlayer: (player) => set({player}),
  room: {
    code: "",
    isReady: false,
    maxPlayers: 0,
    maxQuestions: 0
  },
  setRoom: (room) => set({room}),
  question: {
    question_text: "",
    roomId: "",
    playerId: 0,
  },
  setQuestion: (question) => set({question}),
  showSettings: false,
  setShowSettings: ((showSettings) => set({showSettings}))
}),
 {
        name: 'Trivia Party', 
        partialize: (state) => ({ player: state.player, room: state.room }), // Aquí ponemos lo que se guardará en el localStorage. Es recomendable especificarlo expresamente, porque si no lo hacemos, se guardará todo el contenido de la store en el localStorage, lo cual incluye las funciones de los actions, pero como no podemos guardar una función en el localStorage, daría problemas
}
))