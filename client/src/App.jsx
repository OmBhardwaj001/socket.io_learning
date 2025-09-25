import React,{useEffect,useState,useMemo} from 'react'
import {io} from 'socket.io-client'


function App() {
  
  const socket = useMemo(()=>io('http://localhost:8000'),[  ])

  const [message,setMessage] = useState('');
  const [room, setRoom] = useState('');
  const [socketID,setSocketID] = useState('');
  const [incomingMessage, setIncomingMessage] = useState([]);
  const [roomName,setRoomName] = useState('')

  const submitHandler=(e)=>{
    e.preventDefault()
    socket.emit("message",{room,message})
    setMessage('')
    setRoom('')
  }

  const joinRoomHandler=(e)=>{
    e.preventDefault();
    socket.emit('join-room',roomName);
    setRoomName('')
  }
  

  useEffect(()=>{
  socket.on('connect',()=>{
    console.log("connected")
    setSocketID(socket.id)
  })

  socket.on('message-recieved',(data)=>{
    setIncomingMessage((prev)=> [...prev,data])
    console.log(data)
  })

  socket.on('disconnect',()=>{
    console.log("server disconnected")
    setIncomingMessage([]);
  })

  return()=>{
    socket.off('connect');
    socket.off('disconnect');
    socket.off('message-recieved');
  }

  },[socket]) 



  return(
    <div className="flex justify-center min-h-screen items-center bg-gray-100">
  <div className="flex flex-col bg-white shadow-lg justify-center items-center w-96 p-6 rounded-lg">
    <h1 className="font-bold text-xl mb-2">Chat App</h1>
    <h2 className="font-mono text-xs text-gray-500">{socketID}</h2>

    <input
      type="text"
      placeholder="Type message here"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="border px-3 py-2 rounded-md mt-4 w-full focus:ring-2 focus:ring-blue-400 outline-none"
    />
    <input
      type="text"
      placeholder="Type room id here"
      value={room}
      onChange={(e) => setRoom(e.target.value)}
      className="border px-3 py-2 rounded-md mt-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
    />
    <button
      onClick={submitHandler}
      className="cursor-pointer bg-blue-500 px-4 py-2 rounded-md mt-4 text-white font-medium hover:bg-blue-600 w-full"
    >
      Send
    </button>

    {/* Messages Container */}
    <div className="mt-4 w-full max-h-60 overflow-y-auto bg-gray-50 rounded-md p-2 shadow-inner">
      {incomingMessage.map((ele, index) => (
        <div
          key={index}
          className="text-sm text-gray-800 bg-white p-2 rounded-md mb-2 shadow-sm"
        >
          {ele}
        </div>
      ))}
    </div>

     <div className="flex gap-2">
      <input
        type="text"
        placeholder="Enter room name"
        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        onClick={joinRoomHandler}
      >
        Join
      </button>
    </div>

  </div>
</div>

  )


}

export default App
