import React, {useEffect, useState} from "react";
import {calculateWinner} from "./game-service";
import Board from "./board";
import {Button, Card, FormControl, Navbar, Row, Col} from "react-bootstrap";
import queryString from 'query-string';
import {socket} from "../Home/home";

const Game = ({location}) => {
    const boardSize = 15
    const [history, setHistory] = useState([
        {
            squares: Array(boardSize * boardSize).fill(null), //check
            step: Array(2).fill(null)
        }
    ])
    const [isYourTurn, setIsXTurn] = useState(true)
    const [stepNumber, setStepNumber] = useState(0)
    const [result, setResult] = useState({status: undefined, line: []})
    const [players, setPlayers] = useState([])
    const [room, setRoom] = useState(null)
    const [messages, setMessages] = useState([])
    const [chatMessage, setChatMessage] = useState('')
    //
    useEffect(() => {
        socket.emit('In-room', (queryString.parse(location.search)).room)
    }, [location])

    useEffect(() => {
        socket.on('Room-Data', (data) => {
            setPlayers(data['players'])
            setRoom(data['room'])
            setIsXTurn(data['players'][0] === localStorage.getItem('username'))
        })

        socket.on('Get-Message', (data) => {
            setMessages(msgs => [ ...msgs, data ]);
        })

        socket.on('Get-Move', (data) => {

        })
    }, [])

    useEffect(() => {
        let copyHistory = history.slice()
        let current = copyHistory[stepNumber]
        let squares = current.squares.slice()
        let step = current.step.slice()
        setResult(calculateWinner(squares, step, boardSize, (isYourTurn ? 'O' : 'X')))
    }, [history, isYourTurn, stepNumber])

    // helper functions declare
    const handleClick = (i) => {
        let copyHistory = history.slice(0, stepNumber + 1)
        let current = copyHistory[copyHistory.length - 1]
        let squares = current.squares.slice()
        let step = current.step.slice() //check
        if (squares[i] ||

            calculateWinner(squares, step, boardSize, (isYourTurn ? 'O' : 'X')).status)
            return
    }

    /*const handleClick = (i) => {
        let copyHistory = history.slice(0, stepNumber + 1)
        let current = copyHistory[copyHistory.length - 1]
        let squares = current.squares.slice()
        let step = current.step.slice() //check
        if (squares[i] || calculateWinner(squares, step, boardSize, (isXTurn ? 'O' : 'X')).status)
            return
        squares[i] = isXTurn ? 'X' : 'O'
        setHistory(copyHistory.concat({
            squares: squares,
            step: [Math.floor(i / boardSize), i % boardSize]
        }),)
        setIsXTurn(!isXTurn)
        setStepNumber(copyHistory.length)
    }*/

    const jumpTo = (index) => {
        setIsXTurn(index % 2 === 0)
        setStepNumber(index)
    }

    const handleChat = (e) => {
        e.preventDefault();
        socket.emit('Send-Message', chatMessage);
        setChatMessage('');
    }

    // let copyHistory = history.slice()
    // let current = copyHistory[stepNumber]
    // let squares = current.squares.slice()
    // let step = current.step.slice()
    //
    // let status
    // let line = []
    // let result = calculateWinner(squares, step, boardSize, (isXTurn ? 'O' : 'X')) //check
    //
    // if (result) {
    //     status = 'Winner: ' + result.winner
    //     line = result.line
    // } else if (checkBoardFull(squares)) {
    //     status = 'Result is a draw!'
    // } else {
    //     status = 'Next player: ' + ((isXTurn) ? 'X' : 'O');
    // }

    const historyMoves = () => {
        return (
            history.map((move, index) => {
                const buttonString = (index) ? ('Go to move #' + index + ' (row: ' + move.step[0] + ', column: ' + move.step[1] + ')') : 'Go to game start'
                return (
                    <li key={index} style={{listStyleType: 'none'}}>
                        <Button variant="primary"
                                onClick={() => jumpTo(index)}
                                style={(stepNumber === index) ? {
                                    backgroundColor: '#F93E17',
                                    borderColor: 'orange',
                                    width: '100%',
                                    margin: 1,
                                    textAlign: 'left',
                                    fontSize: 12,
                                    padding: 3
                                } : {
                                    width: '100%',
                                    margin: 1,
                                    textAlign: 'left',
                                    fontSize: 12,
                                    padding: 3
                                }}>
                            {buttonString}
                        </Button>
                    </li>
                )
            }).reverse()
        )
    }

    return (
        <>
            <Navbar style={{backgroundColor: '#F27405', justifyContent: 'space-around'}}>
                <Navbar.Brand style={{color: '#F2F2F2', fontWeight: 'bold', flexGrow: 1}}>GOMOKU</Navbar.Brand>
                <Row style={{marginRight: 10}}>
                    <Button style={{backgroundColor: '#F2F2F2', color: '#F27405', width: 100}}>
                        Sign In
                    </Button>
                    <Button style={{backgroundColor: '#F2F2F2', color: '#F27405', width: 100}}>
                        Sign Out
                    </Button>
                </Row>
            </Navbar>
            <Row noGutters>
                <Col md={6}>
                    <Board squares={history[stepNumber].squares}
                           onClickHandle={(i) => handleClick(i)}
                           winnerLine={result.line}
                           boardSize={boardSize}/>
                </Col>
                <Col md={6}>
                    <h5 style={{textAlign: 'center'}}>
                        {result.status === undefined && 'Next player: ' + ((isYourTurn) ? 'X' : 'O')}
                        {result.status === 'draw' && 'Result is a draw!'}
                        {(result.status === 'X' || result.status === 'O') && 'Winner: ' + result.status}
                    </h5>
                    <Row>
                        <Col xs={4}>
                            <h6>{`Room ID: ${room}`}</h6>
                        </Col>
                        <Col xs={8}>
                            <h6>{`Players: ${players[0]} versus ${players[1]}`}</h6>
                        </Col>
                    </Row>
                    <Card className='card-history'>
                        <Card.Body className='card-body'>
                            <Card.Title className='card-title'>Moves History</Card.Title>
                            <ol className='scroll-view-history'>
                                {historyMoves()}
                            </ol>
                        </Card.Body>
                    </Card>
                    <Card className='card-chat'>
                        <Card.Body className='card-body'>
                            <Card.Title className='card-title'>Chat Box</Card.Title>
                            <div className='scroll-view-chat'>
                                {messages.map((msg) => {
                                    if (msg.username === localStorage.getItem('username')) {
                                        return <p style={{textAlign: 'right'}}>{`${msg.message} :`}<mark style={{backgroundColor: 'blue', color: 'white'}}>{`${msg.username}`}</mark></p>
                                    } else {
                                        return <p style={{textAlign: 'left'}}><mark style={{backgroundColor: 'green', color: 'white'}}>{`${msg.username}`}</mark>{`: ${msg.message}`}</p>
                                    }
                                })}
                            </div>
                            <form onSubmit={e => handleChat(e)}>
                                <FormControl type='chatMessage'
                                             className='input-message'
                                             placeholder='Type and enter message'
                                             value={chatMessage}
                                             // disabled={needToDisable}
                                             onChange={e => setChatMessage(e.target.value)}>
                                </FormControl>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Game
