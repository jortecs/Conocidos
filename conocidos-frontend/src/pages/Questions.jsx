import { useEffect, useRef, useState } from "react";
import removeIcon from '../icons/cross.svg'
import { useNavigate, useParams } from "react-router-dom";
import { createAnswer, createQuestion, getRoom } from "../services/api";
import { useTriviaStore } from "../store/store";
import {io} from 'socket.io-client';

const Questions = () => {
  const { roomId } = useParams()
  const { player, setPlayer } = useTriviaStore(state => state)
  const [type, setType] = useState("multiple");
  const [question, setQuestion] = useState("");
  const [createdQuestions, setCreatedQuestions] = useState(0)
  const [answers, setAnswers] = useState(["", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [maxQuestions, setMaxQuestions] = useState(null)
  const navigate = useNavigate()

  const socketRef = useRef()
  if (!socketRef.current) {
    socketRef.current = io('http://localhost:3000')
  }
  const socket = socketRef.current;

  useEffect(() => {
    getRoomMaxQuestion(roomId);
    socket.on('connect', () => {
      console.log('question page connected');

      socket.on('allPlayersReady', async () => {
        await handleNotReady();
        navigate(`/game/${roomId}`);
      });

      socket.emit('playerJoins', roomId)
    });
    
    return () => {
      socket.off('allPlayersReady'); // Clean up listener
    };
  }, [])

  useEffect(() => {
    if(createdQuestions === maxQuestions ){
      console.log("todas las preguntas han sido creadas")
      handleReady()
    }
  }, [createdQuestions]) 

  const handleNotReady = async () =>{
    console.log('player is not ready')
    await setPlayer({...player, isReady: false})
    socket.emit('playerNotReady', {roomId, playerId:  player.id})
  }

  const handleReady = async () =>{
    console.log('player is ready: ', player)

    await setPlayer({...player, isReady: true})
    socket.emit('playerIsReady', {roomId, playerId:  player.id})
  }

  const getRoomMaxQuestion = async (roomCode) => {
    const room = await getRoom(roomCode)
    const fetchedMaxQuestions = room[0].maxQuestions
    setMaxQuestions(fetchedMaxQuestions)
    
  }

  const handleAnswerChange = (value, index) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const addAnswerField = () => {
    if (answers.length < 4) {
      setAnswers([...answers, ""]);
    }
  };

  const removeAnswerField = (index) => {
    if (answers.length > 2) {
      const updated = answers.filter((_, i) => i !== index);
      setAnswers(updated);
      // Adjust correct index if needed
      if (correctIndex === index) {
        setCorrectIndex(null);
      } else if (correctIndex > index) {
        setCorrectIndex(correctIndex - 1);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedQuestion = question.trim();
    const filledAnswers = type === "multiple" ? answers.filter(a => a.trim()) : ["Verdadero", "Falso"];

    if (!trimmedQuestion || correctIndex === null || filledAnswers.length < 2) {
      return alert("Please complete all required fields and select the correct answer.");
    }

    const collectedQuestion = {
      question_text: trimmedQuestion,
      roomId: roomId,
      playerId: player.id
    }

    setCreatedQuestions(prev => prev + 1)

    // console.log(payload)
    console.log('question: ',collectedQuestion)

    const newQuestion = await createQuestion(collectedQuestion)
    console.log('question created successfully')
    const questionId = newQuestion.id

    const separatedAnswers = filledAnswers.map((answer, index) => {
      const isCorrect = index === correctIndex
    const answerObject = {
        answer_text: answer,
        is_correct: isCorrect,
        questionId: questionId
      }
      return answerObject
    })
    
    Promise.all(separatedAnswers.map(answer => createAnswer(answer)))
    .then((response)=> {
      response.map(answer => {console.log('created answer: ', answer.data)})
    })
    .catch(error => {console.error('Error creating answers: ', error)})

    resetForm();
  };

  const resetForm = () => {
    setType("multiple");
    setQuestion("");
    setAnswers(["", ""]);
    setCorrectIndex(null);
  };

  return (
    <div className="mosaic-question p-2 flex flex-col gap-5 w-full h-screen items-center justify-center">
      
      
      {createdQuestions < maxQuestions 
        ? (
        <div className="p-2 sm:p-5 w-full  sm:w-md rounded-xl shadow bg-white">
          <h2 className="text-xl font-bold text-center">Crea una pregunta</h2>
          <form className="flex flex-col gap-4" onSubmit={(event)=>{handleSubmit(event)}}>
            <div>
              <label htmlFor="type" className="text-sm">Tipo de pregunta</label>
              <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setCorrectIndex(null);
                    setAnswers(e.target.value === "multiple" ? ["", ""] : []);
                  }}
                  className="w-full outline-2 outline-gray-300 focus:outline-amber-900 px-2 py-1 rounded mt-1"
                >
                  <option value="multiple">Multiple opción</option>
                  <option value="boolean">Verdadero / Falso</option>
                </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm" htmlFor="question">Pregunta</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className=" bg-white outline-2 px-2 py-1 rounded focus:outline-amber-900 outline-gray-300"
                placeholder="Me gusta..."
              />
              {type === "multiple" && (
                <div className="flex flex-col gap-3 mt-1">
                  {answers.map((answer, idx) => (
                    <div key={idx} className=" flex justify-between gap-2">
                      <input
                        type="radio"
                        name="correct"
                        checked={correctIndex === idx}
                        onChange={() => setCorrectIndex(idx)}
                      />
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => handleAnswerChange(e.target.value, idx)}
                        className="w-full shrink  bg-white outline-2 px-2 py-1 rounded focus:outline-amber-900 outline-gray-300"
                      
                        placeholder={`Respuesta ${String.fromCharCode(65 + idx)}`}
                      />
                      {answers.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeAnswerField(idx)}
                          className="shrink-0 text-red-500 text-sm min-w-3 max-w-4" 
                        >
                          <img className="w-full" src={removeIcon} alt="remove icon" />
                        </button>
                      )}
                    </div>
                  ))}
                  {answers.length < 4 && (
                    <button
                      type="button"
                      onClick={addAnswerField}
                      className="text-sm text-amber-600 hover:underline"
                    >
                      + Añadir
                    </button>
                  )}
                </div>
              )}
              {type === "boolean" && (
                <div className="space-y-2">
                  {["Verdadero", "Falso"].map((ans, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="correct"
                        checked={correctIndex === idx}
                        onChange={() => setCorrectIndex(idx)}
                      />
                      <label>{ans}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
  
            <button
              onClick={handleSubmit}
              className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded cursor-pointer"
            >
              Confirmar pregunta
            </button>
          </form>
        </div>
        )
        : (
          <div className="p-2 sm:p-5 w-full  sm:w-md rounded-xl shadow bg-white">
        <h2>Has creado todas tus preguntas, esperando a los otros jugadores...</h2>
      </div>
        )
      }

      {/* <button onClick={()=>{
        if(player.isReady){
          handleNotReady()
        }else{
          handleReady()
        }
      }} className={`border-2 border-amber-900 px-8 py-2 text-lg text-white ${player.isReady ? "bg-emerald-500 active:bg-emerald-700 active:border-emerald-800" : "bg-red-500 active:bg-red-700 active:border-red-800"}   rounded`}>
        {player.isReady ? "Ready" : "Not ready"}
      </button> */}
    </div>
  );
};

export default Questions;
