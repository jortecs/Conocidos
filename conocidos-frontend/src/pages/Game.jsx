import { useNavigate, useParams } from "react-router-dom";
import { useTriviaStore } from "../store/store";
import { useEffect, useRef, useState } from "react";
import {io} from 'socket.io-client';
import { getAnswers, getPlayer, getQuestions, updatePlayer } from "../services/api";

const Game = () => {
  const { roomId } = useParams()
  const { player, setPlayer } = useTriviaStore(state => state)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [question, setQuestion] = useState({})
  const [currentAnswers, setCurrentAnswers] = useState([])
  const [isAnswered, setIsAnswered] = useState(false);
  const [fetchedQuestions, setFetchedQuestions] = useState([])
  const [playerNickname, setPlayerNickname] = useState('')
  const [finished, setFinished] = useState(false)
  const navigate = useNavigate()
    
  useEffect(() => {
    socket.on('connect', () => {
      console.log('question page connected');

      socket.on('allPlayersReady', async () => {
        console.log("redirecting...")
        navigate(`/end/${roomId}`);
      });

      socket.emit('playerJoins', roomId)
    });

    return () => {
      socket.off('allPlayersReady'); // Clean up listener
    };
  }, [])

  useEffect(() => {
    const fetchQuestions = async () => {
      const allQuestions = await getQuestions(roomId, player.id)
       setFetchedQuestions(allQuestions)
    }
    fetchQuestions()
  }, [roomId, player.id])

  useEffect(() => {
    console.log('Fetched questions: ', fetchedQuestions)
    const fetchAnswers = async (questionId) =>{
      const currentAnswers = await getAnswers(questionId)
      setCurrentAnswers(currentAnswers)
    }
    const fetchNickname = async (playerId) => {
      const data = await getPlayer(playerId)
      console.log('fetched player nickname: ', data)
      setPlayerNickname(data.nickname)
    }
    if (fetchedQuestions.length > 0){
      const currentQuestion = fetchedQuestions[questionIndex]
      setQuestion(currentQuestion)
      fetchAnswers(currentQuestion.id)
      fetchNickname(currentQuestion.playerId)
    }


  }, [fetchedQuestions, questionIndex])

  const handleReady = async () =>{
  console.log('player has finished')
  setFinished(true)
  await setPlayer({...player, isReady: true})
  socket.emit('playerIsReady', {roomId, playerId:  player.id})
  }

  const socketRef = useRef()
  if (!socketRef.current) {
      socketRef.current = io('http://localhost:3000')
  }
  const socket = socketRef.current;

  const handleAnswer = async (isCorrect) =>{
    if(isCorrect){
      console.log('answer is correct')
      await setPlayer({...player, score: player.score + 1})
      const newPlayerScore = {...player, score: player.score + 1}
      console.log(newPlayerScore)
      await updatePlayer({playerId: player.id, player: newPlayerScore})
    }
    console.log('setting answered true')
    setIsAnswered(true)
  }

  const handleNext = async () =>{
    setIsAnswered(false)
    setQuestionIndex(prev => prev + 1)
  }

    return (
        <div className="mosaic-game opac p-2 flex flex-col gap-5 items-center justify-center min-h-screen bg-gradient-to-r from-amber-300 to-orange-500/70 text-white">
            <div className="w-full max-w-4xl bg-white text-black rounded-lg shadow-lg p-6">
              { finished
                ? <p>Esperando que los demás terminen de contestar...</p>
                : <div>
                    <h2 className="text-2xl font-semibold mb-4 text-center">Pregunta de {playerNickname}</h2>
                    <p className="text-lg mb-6 text-center">{question?.question_text}</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        { // fetchedQuestions.length>0
                            currentAnswers.length>0 && currentAnswers.map((answer, index) => {
                                return(
                                  <button
                                  key={index}
                                  onClick={() => handleAnswer(answer.is_correct)}
                                  disabled={isAnswered}
                                  className={` py-2 px-4 rounded ${
                                    isAnswered
                                      ? answer.is_correct
                                        ? "bg-emerald-500"
                                        : "bg-rose-500"
                                      : "bg-blue-500 hover:bg-blue-700"
                                  } text-white`}
                                >
                                        {answer.answer_text}
                                    </button>
                                )
                            })
                        }
                    </div>
                  </div>
              }
                
            </div>
            <p className="text-2xl">Your score: {player.score}</p>
            { (isAnswered && !finished) &&
              <button onClick={()=>{
                if(questionIndex < fetchedQuestions.length-1){
                  handleNext()
                }else{
                  console.log('all questions answered')
                  handleReady()
                }
              }} className='border-2 border-violet-900 px-8 py-2 text-lg text-white bg-violet-700 active:bg-violet-500 active:border-violet-800 rounded' >
                {questionIndex < fetchedQuestions.length-1
                  ? 'Siguiente pregunta'
                  : 'Terminar'
                }
              </button>
            }
        </div>
    );
};

export default Game;