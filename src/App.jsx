import ReactPlayer from 'react-player';
import './App.css'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
const socket = io("localhost:3006/");
socket.emit("join-stream", "")

function App() {
  const [processPercent, setProcessPercent] = useState(0);
  const [streamRoomID, setStreamRoomID] = useState("");
  const [stop, setStop] = useState(false);
  const [filePathState, setFilePathState] = useState("");
  useEffect(() => {
    socket.on("process_percent", (percent) => {
      console.log(percent)
      if (percent) setProcessPercent(percent)
    })
    socket.on("custom-event", (dataa) => {
      console.log(dataa)
    })
    socket.on("render-status", (data) => {
      const { status, filePath } = data;
      console.log(data)
      if (status && filePath) setFilePathState(filePath)
    })
    socket.on("get-stream-id", (id) => setStreamRoomID(id))
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log({ formData })
    const headers = {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      'Socket-ID': streamRoomID

    }
    console.log(formData)
    const res = axios.post("http://localhost:3006/upload", formData
      , {
        headers: headers
      }
    );
    const data = res.data;
    console.log(data)

  }

  return (
    <>
      <form action="POST" encType='multipart/form-data' onSubmit={handleSubmit}>
        <input type="file" name="file" id="" onChange={(e) => { console.log(e.target.files[0]) }} />
        <input type="submit" value={"Submit"} />
      </form>
      <h2>Tiến trình {processPercent.toFixed(2)}</h2>

      {
        stop ? (
          <button>Remuse</button>

        ) : (
          <button>Pause</button>
        )
      }
      <div>
        <ReactPlayer
          url={filePathState && "http://localhost:3006/stream/" + filePathState}
          width="480px"
          height="360px"
          controls={true}
        />
      </div>
    </>

  )
}

export default App;
