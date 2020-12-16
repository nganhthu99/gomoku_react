import React, {useContext, useEffect, useState} from "react";
import {calculateWinner} from "./game-service";
import Board from "./board";
import {Button, Card, FormControl, Navbar, Row, Col} from "react-bootstrap";
import queryString from 'query-string';
import {Redirect} from "react-router-dom";
import {SocketContext} from "../socket-provider";

export const boardSize = 15

const Game = ({location}) => {
    const {socket} = useContext(SocketContext)
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("token"))
    const [turn, setTurn] = useState({
        isYourTurn: true,
        letter: null
    })
    const [history, setHistory] = useState([
        {
            squares: Array(boardSize * boardSize).fill(null), //check
            step: Array(2).fill(null)
        }
    ])
    const [stepNumber, setStepNumber] = useState(0)
    const [result, setResult] = useState({status: undefined, line: []})
    const [players, setPlayers] = useState([])
    const [room, setRoom] = useState(null)
    const [messages, setMessages] = useState([])
    const [chatMessage, setChatMessage] = useState('')

    useEffect(() => {
        socket.emit('In-room', (queryString.parse(location.search)).room)
    }, [socket, location])

    useEffect(() => {
        socket.on('Room-Data', (data) => {
            if (data['players'].length < 2) {
                setHistory([
                    {
                        squares: Array(boardSize * boardSize).fill(null), //check
                        step: Array(2).fill(null)
                    }
                ])
                setResult({status: undefined, line: []})
            }

            setPlayers(data['players'])
            setRoom(data['room'])
            setTurn({
                isYourTurn: data['players'][0] === localStorage.getItem('username'),
                letter: data['players'][0] === localStorage.getItem('username') ? 'X' : 'O'
            })
        })

        socket.on('Get-Message', (data) => {
            setMessages(prevMessages => [ ...prevMessages, data ]);
        })

        socket.on('Get-Move', (data) => {
            const i = data.move
            setHistory(prevHistory => {
                let current = prevHistory[prevHistory.length - 1]
                let squares = current.squares.slice()
                squares[i] = data.letter
                return [...prevHistory, {
                    squares: squares,
                    step: [Math.floor(i / boardSize), i % boardSize]
                }]
            })
            setTurn ((prevTurn) => {
                return {
                    letter: prevTurn.letter,
                    isYourTurn: !prevTurn.isYourTurn
                }
            })
            setStepNumber(s => s + 1)
        })

        socket.on('Undo-Move', (index) => {
            setTurn(prevTurn => {
                let isYourTurn
                if (index === 0 || index % 2 === 0) {
                    isYourTurn = prevTurn.letter === 'X';
                } else {
                    isYourTurn = prevTurn.letter !== 'X';
                }
                return {
                    isYourTurn: isYourTurn,
                    letter: prevTurn.letter
                }
            })
            setStepNumber(index)
            setHistory(prevHistory => prevHistory.slice(0, index + 1))
        })
    }, [socket])

    useEffect(() => {
        let copyHistory = history.slice()
        let current = copyHistory[stepNumber]
        let squares = current.squares.slice()
        let step = current.step.slice()

        const letterState = () => {
            if (turn.isYourTurn) {
                if (turn.letter === 'X') return 'O'
                else return 'X'
            } else {
                if (turn.letter === 'X') return 'X'
                else return 'O'
            }
        }
        setResult(calculateWinner(squares, step, boardSize, letterState()))
    }, [history, turn, stepNumber])

    const handleSignOutButton = () => {
        socket.disconnect()
        localStorage.clear()
        setIsAuthenticated(localStorage.getItem("token"))
    }

    const handleClick = (i) => {
        let copyHistory = history.slice()
        let current = copyHistory[copyHistory.length - 1]
        let squares = current.squares.slice()
        let step = current.step.slice() //check

        if (!(players.length === 2) ||
            !turn.isYourTurn ||
            squares[i] ||
            calculateWinner(squares, step, boardSize, (turn.letter === 'X' ? 'O' : 'X')).status)
            return
        socket.emit('Play-Move', {
            move: i,
            letter: turn.letter
        })
    }

    /*const handleClick = (i) => {
        let copyHistory = history.slice()
        let current = copyHistory[copyHistory.length - 1]
        let squares = current.squares.slice()
        let step = current.step.slice() //check
        if (squares[i] || calculateWinner(squares, step, boardSize, (isXTurn ? 'O' : 'X')).status)
            return
        squares[i] = isXTurn ? 'X' : 'O'
        setHistory(copyHistory.concat({
            squares: squares,
            step: [Math.floor(i / boardSize), i % boardSize]
        }))
        setIsXTurn(!isXTurn)
        setStepNumber(stepNumber + 1)
    }*/

    const jumpTo = (index) => {
        socket.emit('Undo-Move', index)
    }

    const handleChat = (e) => {
        e.preventDefault();
        socket.emit('Send-Message', chatMessage);
        setChatMessage('');
    }

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

    const letterState = () => {
        if (turn.isYourTurn) {
            if (turn.letter === 'X')
                return 'X'
            else return 'O'
        } else {
            if (turn.letter === 'X')
                return 'O'
            else return 'X'
        }
    }

    if (!isAuthenticated)
        return (
            <Redirect to='/'/>
        )
    else return (
        <>
            <Navbar style={{backgroundColor: '#F27405', justifyContent: 'space-around'}}>
                <Navbar.Brand style={{color: '#F2F2F2', fontWeight: 'bold', flexGrow: 1}}>GOMOKU</Navbar.Brand>
                <Row style={{marginRight: 10}}>
                    <Button style={{backgroundColor: '#F2F2F2', color: '#F27405', width: 100}}
                            onClick={handleSignOutButton}>
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
                    {result.status === undefined && (<h5 style={{textAlign: 'center'}}>Next player: {letterState()}</h5>)}
                    {result.status === 'draw' && (<h5 style={{textAlign: 'center'}}>Result is a draw!</h5>)}
                    {(result.status === 'X' || result.status === 'O') && (
                        <Row noGutters style={{justifyContent: 'center'}}>
                            <h5 style={{textAlign: 'center'}}>
                                Winner: {result.status}
                            </h5>
                            <Button variant='clear' style={{fontSize: 13, color: 'blue', paddingTop: 0}} onClick={() => jumpTo(0)}>Restart Game</Button>
                        </Row>
                    )}

                    <Row noGutters>
                        <Col xs={3}>
                            <h6>{`Room ID: ${room}`}</h6>
                        </Col>
                        <Col xs={9}>
                            <h6>{`Players: [X]${players[0]}[X] versus [O]${players[1]}[O]`}</h6>
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
