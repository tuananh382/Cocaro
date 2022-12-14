
import { useState } from 'react';
import './App.css';
import React, { useRef, useEffect } from 'react';
import socketIOClient from "socket.io-client";
const host = "http://localhost:3000";




function App()  {
  const Ref = useRef(null);
  const [timer, setTimer] = useState('20:00');
  const [inputValue, setInputValue] = useState("")
  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }
  const [inputValue1, setInputValue1] = useState("")

  const handleInputChange1 = (event) => {
    setInputValue1(event.target.value)
  }
  const [winner, setWinner] = useState(false)
  const [size, setSize] = useState(20)
  const [win, setWin] = useState(false)
  const [state, setState] = useState({
    player: "x",
    winner: null,
    data: new Array ,
  });
  const [id, setId] = useState();
  const [idclient, setIdclient] = useState();
  var pos;
  const buttons = new Array(0)
  for(var i = 1; i <= (size*size) ; i++){
    buttons.push(i);
  }
  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = socketIOClient.connect(host)

    socketRef.current.on('getId', data => {
        setIdclient(data)
        socketRef.current.emit('sendIdClient', data);
    })
    socketRef.current.on('sendIdServer', ids => {
      if (idclient != ids)
      {setId(ids)}
    }
  );
    socketRef.current.on('sendDataServer', dataGot => {
      setState(dataGot.data)
    })
    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  const sendMessage = () => {
    if(state !== null) {
      const msg =  state
      socketRef.current.emit('sendDataClient', msg);
    }
  }
    function buttonclick(x) {
    if(id != idclient)
          {
            if(state.data[x] == null){
              state.data[x] = state.player;
              state.player = state.player === "x" ? "o" : "x";
              setState({
                ...state,
                player: state.player,
                data:state.data,
              });
              sendMessage()
            pos = x;
            checkWin();
            addarea(x);
            setturn(); 
            checkWinner(win)                                    
            } 
          };
    }
      function setturn(){
    socketRef.current.emit('sendIdClient', idclient);
    }
    function checkWinner(win) {
      if(win == true)
      {
        socketRef.current.emit("sendWinClient", win)
      }
    socketRef.current.on("sendWinSever", win => {
      setWinner(win)
    })
    }
      function addarea(x) {
        const arr = new Array
        for(i=1 ; i<= size;i++)
          arr.push(i);
        for(i=size+1 ; i <= size*(size-1)+1 ;i=size+i)
          arr.push(i);
        for(i=2*size; i<= size*size ; i=i+size)
          arr.push(i);
        for(i=size+2; i<size*size; i++)
          arr.push(i);
        for(i=1; i <= size*(size-4); i++)
          {
            if(state.data[x] == arr[i])
              setSize(size+5);
          } 
      }
      function checkWin()  {
        var addleft=0, addright=0, addup=0, adddown=0, addcheoup=0, addcheodown=0, addngcup=0, addngcdown=0;
        for(var i = 1; i <= 5 ; i++) { 
            if (state.data[pos] == state.data[pos-i])
            {
                addleft++;      
            }
            else
            break;
        } 
        for(var i = 1; i <= 5 ; i++) { 
          if (state.data[pos] == state.data[i+pos])
          {
              addright++;      
          }
          else
          break;
        } 
        for(var i = 1; i <= 5 ; i++) { 
          if (state.data[pos] == state.data[i*size+pos])
          {
              addup++;      
          }
          else
          break;
      } 
      for(var i = 1; i <= 5 ; i++) { 
        if (state.data[pos] == state.data[pos - size*i])
        {
            adddown++;      
        }
        else
        break;
    } 
    for(var i = 1; i <= 5 ; i++) { 
      if (state.data[pos] == state.data[i*(size-1)+pos])
      {
          addcheodown++;      
      }
      else
      break;
  } 
  for(var i = 1; i <= 5 ; i++) { 
    if (state.data[pos] == state.data[pos - (size-1)*i])
    {
        addcheoup++;      
    }
    else
    break;
} 
for(var i = 1; i <= 5 ; i++) { 
  if (state.data[pos] == state.data[i*(size+1)+pos])
  {
      addngcdown++;      
  }
  else
  break;
} 
for(var i = 1; i <= 5 ; i++) { 
  if (state.data[pos] == state.data[pos-i*(size+1)])
  {
      addngcup++; 
  }
  else
  break;
} 
var check1=0;
var check2=0;
      if( state.data[pos] == "x")
      {
        if(addright+addleft >= 3)
      { 
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos+(i+addright)] == "o")
             check1++;
        }
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos -(i+addleft)] == "o")
             check2++;
        }
        if(check1+check2 > 1)
          {setWin(false);
          check1 =0;check2=0;}
        else 
          setWin(true);
      }
      else if(addup +adddown >= 3)
      {
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos-(i+addup)*size] == "o")
             check1++;
        }
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos + (i+adddown)*size] == "o")
             check2++;
        }
        if(check1+check2 > 1)
          {setWin(false);
          check1 =0;check2=0;}
        else 
          setWin(true);
      }
      else if(addcheodown +addcheoup >= 3)
      {
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos-(i+addcheoup)*(size+1)] == "o")
             check1++;
        }
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos +(i+addcheodown)*(size-1)] == "o")
             check2++;
        }
        if(check1+check2 > 1)
          {setWin(false);
          check1 =0;check2=0;}
        else 
          setWin(true);
      }
      else if(addngcdown +addngcup >= 3)
      {
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos-(i+addngcup)*(size+1)] == "o")
             check1++;
        }
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos +(i+addngcdown)*(size+1)] == "o")
             check2++;
        }
        if(check1+check2 > 1)
          {setWin(false);
          check1 =0;check2=0;}
        else 
          setWin(true);
      }
      }

      if( state.data[pos] == "o")
      {
        if(addright+addleft >= 3)
      { 
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos+(i+addright)] == "x")
             check1++;
        }
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos -(i+addleft)] == "x")
             check2++;
        }
        if(check1+check2 > 1)
          {setWin(false);
          check1 =0;check2=0;}
        else 
          setWin(true);
      }
      else if(addup +adddown >= 3)
      {
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos-(i+addup)*size] == "x")
             check1++;
        }
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos + (i+adddown)*size] == "x")
             check2++;
        }
        if(check1+check2 > 1)
          {setWin(false);
          check1 =0;check2=0;}
        else 
          setWin(true);
      }
      else if(addcheodown +addcheoup >= 3)
      {
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos-(i+addcheoup)*(size+1)] == "x")
             check1++;
        }
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos +(i+addcheodown)*(size-1)] == "x")
             check2++;
        }
        if(check1+check2 > 1)
          {setWin(false);
          check1 =0;check2=0;}
        else 
          setWin(true);
      }
      else if(addngcdown +addngcup >= 3)
      {
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos-(i+addngcup)*(size+1)] == "x")
             check1++;
        }
        for(var i = 1;i <=(size-5);i++)
        {
          if(state.data[pos +(i+addngcdown)*(size+1)] == "x")
             check2++;
        }
        if(check1+check2 > 1)
          {setWin(false);
          check1 =0;check2=0;}
        else 
          setWin(true);
      }
      }
    }
      function Notice() {
        var namewin;
        if (state.player == "o")
          namewin = inputValue;
        else
          namewin = inputValue1;

        console.log(win)
        console.log(winner)
        return (
            
            <div className="notice">
                <h1>{namewin}</h1>
                <h1>{win === winner ? "You win" : "you lose"}</h1>
                {clearInterval(Ref.current)}
                <h1>{timer}</h1>
                <buttons className="again" onClick={() => {window.location.reload(true)}}>Again</buttons>
            </div>
        )
      }
      function Countdown() {
        
      
      
        const getTimeRemaining = (e) => {
            const total = Date.parse(e) - Date.parse(new Date());
            const seconds = Math.floor((total / 1000) % 60);
            const minutes = Math.floor((total / 1000 / 60) % 60);
            const hours = Math.floor((total / 1000 / 60 / 60) % 24);
            return {
                total, hours, minutes, seconds
            };
        }
      
      
        const startTimer = (e) => {
            let { total, hours, minutes, seconds } 
                        = getTimeRemaining(e);
            if (total >= 0) {  
                setTimer(
                    (minutes > 9 ? minutes : '0' + minutes) + ':'
                    + (seconds > 9 ? seconds : '0' + seconds)
                )
            }
        }
        const clearTimer = (e) => {
            setTimer('20:00');
            if (Ref.current) clearInterval(Ref.current);
            const id = setInterval(() => {
                startTimer(e);
            }, 1000)
            Ref.current = id;
        }
      
        const getDeadTime = () => {
            let deadline = new Date();
            deadline.setSeconds(deadline.getSeconds() + 1200);
            return deadline;
        }
        const onClickReset = () => {
            clearTimer(getDeadTime());
            
        }
        return (
            <div className="countdown">
                <h2>{timer}</h2>
                <button className='num' onClick={onClickReset}>Start</button>
            </div>
        )
    }
    return (
      <div>
        {/* <Signin/> */}
      <div className='app'>
        {winner === true && <Notice/>}
        {buttons.map((x,index) => <button key={index} className="button" onClick={() => buttonclick(x)} style={{color: state.data[x] === "x" ? "red" : "blue"}}  >  {state.data[x]}  </button>)}
      </div>
        <div className='player'>
           <div className='player1'>
              <div className='name'>
                  <p>Name Player 1</p>
                  <input className='buttonname' value={inputValue} onChange={handleInputChange} placeholder="Type..." type="text" />
                  <p>B???n ????nh X nh?? !!</p>
      
              </div>
           </div>
           <div className='player2'>
              <div className='name'>
                  <p>Name Player 2</p>
                  <input className='buttonname' value={inputValue1} onChange={handleInputChange1} placeholder="Type..." type="text" />
                  <p>B???n ????nh O nh?? !!</p>
              </div>
           </div>
        </div>
        <div><Countdown/></div>
      </div>
    );
      function Signin() {
        return (
          <div className='box'>
            <form>
					    <div class="form-control">
                <label for="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Enter username..."
                  required
                />
					    </div>
					    <div class="form-control">
                <label for="room">Room</label>
                <input
                  type="text"
                  name="room"
                  id="room"
                  placeholder="Enter room..."
                  required
                />
					    </div>
					    <button type="submit" class="btn">Join Chat</button>
				    </form>
          </div>
        )
      }
}

export default App;