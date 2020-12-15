import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Navbar, Row, Modal, FormControl} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import { io } from 'socket.io-client';
import { FaPlusCircle } from 'react-icons/fa';
import randomColor from 'randomcolor'

export const UserItem = (props) => {
    return (
        <Card style={{backgroundColor: 'orange', margin: 3}}>
            <Card.Header style={{color: '#F2F2F2', textAlign: 'center', fontWeight: 'bold', height: 50}}>
                {props.username}
            </Card.Header>
        </Card>
    )
}

export const RoomItem = (props) => {
    return (
        <Card style={{backgroundColor: randomColor({hue: 'purple'}), margin: 3}}>
            <Card.Header style={{color: '#F2F2F2', textAlign: 'center', fontWeight: 'bold', height: 50}}>
                <Row style={{justifyContent: 'space-around'}}>
                    <Col xs={6}>
                        <Card.Text>
                            {`#room_id_${props.id}`}
                        </Card.Text>
                    </Col>
                    <Col xs={4}>
                        <Card.Text>
                            {`${props.numPlayers} / 2 players`}
                        </Card.Text>
                    </Col>
                    <Col xs={2}>
                        <Button onClick={() => {props.handleJoin(props.id)}}
                                style={{fontSize: 12, height: 26, padding: 2, paddingLeft: 5, paddingRight: 5}}>
                            Join
                        </Button>
                    </Col>
                </Row>
            </Card.Header>
        </Card>
    )
}

export const ENDPOINT='http://localhost:5034?username='
export const socket = io(ENDPOINT + localStorage.getItem("username"), {
    transports: ['websocket']
});

const Home = (props) => {
    const [userList, setUserList] = useState([])
    const [roomList, setRoomList] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("token"))
    const history = useHistory()
    const [show, setShow] = useState(false);
    const [roomId, setRoomId] = useState('')

    useEffect(() => {
        if (isAuthenticated) {
            // socket = io(ENDPOINT + localStorage.getItem("username"), {
            //     transports: ['websocket']
            // });
            socket.on('connect', () => {
                console.log(socket.id)
            })
            socket.on('Online-users', (data) => {
                setUserList(data["Online"])
            });
            socket.on('Get-rooms', (data) => {
                setRoomList(data["Rooms"])
            });
            // return () => {
            //     socket.disconnect()
            // }
            // socket.on('Room-Data', (data) => {
            //     console.log(data)
            //     // setPlayers(data['Players'])
            // })
        }
    }, [isAuthenticated])

    const handleSignInButton = () => {
        history.push('/sign-in')
    }

    const handleSignOutButton = () => {
        localStorage.clear()
        setIsAuthenticated(localStorage.getItem("token"))
        setUserList([])
    }

    const handleClose = () => {
        setShow(false);
    }

    const handleShow = () => {
        setShow(true);
    }

    const handleCreate = () => {
        socket.emit('Create-room', roomId, function (result) {
            if (result.success) {
                handleClose()
                history.push('/game?room='+roomId)
            } else {
                alert(result.message)
            }
        });
    }

    const handleJoin = (id) => {
        socket.emit('Join-room', id, function (result) {
            if (result.success) {
                history.push('/game?room='+id)
            } else {
                alert(result.message)
            }
        });
    }

    return (
        <>
            <Navbar style={{backgroundColor: '#F27405', justifyContent: 'space-around'}}>
                <Navbar.Brand style={{color: '#F2F2F2', fontWeight: 'bold', flexGrow: 1}}>GOMOKU</Navbar.Brand>
                <Row style={{marginRight: 10}}>
                    <Button style={{backgroundColor: '#F2F2F2', color: '#F27405', width: 100}}
                            disabled={isAuthenticated ? true : false}
                            onClick={handleSignInButton}>
                        Sign In
                    </Button>
                    <Button style={{backgroundColor: '#F2F2F2', color: '#F27405', width: 100}}
                            disabled={isAuthenticated ? false : true}
                            onClick={handleSignOutButton}>
                        Sign Out
                    </Button>
                </Row>
            </Navbar>
            <Row noGutters style={{marginTop: 3, justifyContent: 'space-around'}}>
                <Col xs={12} sm={5} style={{margin: 5}}>
                    <Row style={{height: 30, justifyContent: 'center'}}>
                        <p style={{fontSize: 20, fontWeight: 'bold'}}>
                            Online Users
                        </p>
                    </Row>
                        {userList.map((username) => (
                            <UserItem username={username} key={username}/>
                        ))}
                </Col>
                <Col xs={12} sm={5} style={{margin: 5}}>
                    <Row style={{height: 30, justifyContent: 'center'}}>
                        <p style={{fontSize: 20, fontWeight: 'bold', marginRight: 10}}>
                            Active Rooms
                        </p>
                        <Button variant='outline-primary'
                                style={{height:30, width: 30, padding: 0}}
                                onClick={handleShow}>
                            <FaPlusCircle />
                        </Button>
                        <Modal show={show} onHide={handleClose} animation={false}>
                            <Modal.Header closeButton>
                                <Modal.Title>Create Room</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <FormControl className='input-message'
                                             placeholder='Type and enter room ID'
                                             value={roomId}
                                             onChange={e => setRoomId(e.target.value)}>
                                </FormControl>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleCreate}>
                                    Create
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Row>
                    {roomList.map((room) => (
                        <RoomItem key={room[0]}
                                  id={room[0]}
                                  numPlayers={room[1].length}
                                  handleJoin={handleJoin}/>
                    ))}
                </Col>
            </Row>
        </>
    )
};

export default Home;
