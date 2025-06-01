import axios from 'axios';
export const i = axios.create({ baseURL: 'http://localhost:3000' });

export const createRoom = async room =>{
  const createdRoom = await i.post('/rooms', room)
  return createdRoom.data
}

export const getRoom = async (roomCode) => {
  const room = await i.get(`/rooms/${roomCode}`)
  return room.data
}

export const getPlayers = async (roomCode) => {
  const players = await i.get(`/players/${roomCode}`)
 return players.data
}

export const getPlayer = async (playerId) => {
  const players = await i.get(`/players/nickname/${playerId}`)
 return players.data
}

export const createPlayer = async (player) => {
  const createdPlayer = await i.post('/players', player)
  return createdPlayer.data
}

export const updatePlayer = async ({playerId, player}) => {
  const createdPlayer = await i.put(`/players/update/${playerId}`, player)
  return createdPlayer.data
}

export const deletePlayer = async(player) => {
  i.delete('/players/delete', 
    {
    data: player
    }
  )
}

export const getQuestions = async (roomCode, playerId) => {
  const questions = await i.get(`/questions/room/${roomCode}/${playerId}`)
  return questions.data
}

export const createQuestion = async (question) =>{
  const newQuestion = await i.post('/questions', question)
  return newQuestion.data
}

export const createAnswer = (answer) => {
  return i.post('/answers', answer)
}

export const getAnswers = async (questionId) => {
  const answers = await i.get(`/answers/question/${questionId}`)
  return answers.data
}
