import React, {useEffect, useState} from 'react';
import {Button, Card, Container, Navbar, Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'
import randomColor from 'randomcolor'
import { useHistory } from "react-router-dom";
//
import { io } from 'socket.io-client';
//

const UserItem = (props) => {
    return (
        <Card style={{backgroundColor: randomColor(), margin: 3}}>
            <Card.Header style={{color: '#F2F2F2', textAlign: 'center', fontWeight: 'bold'}}>
                {props.username}
            </Card.Header>
        </Card>
    )
}

const Home = (props) => {
    const [userList, setUserList] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("token"))

    useEffect(() => {
        const socket = io('https://caro-user-api-2.herokuapp.com?userName='
            + localStorage.getItem("username"));
        socket.on('connect', () => {
            console.log(socket.id)
            console.log(socket)
        })
        socket.on('Online-users', (data) => {
            console.log(socket.id)
            console.log(socket)
            console.log(data)
            setUserList(data["Online"])
        });
        return () => {
            socket.disconnect()
        }
    }, [])

    // const [socket, setSocket] = useState(null);
    //
    // useEffect(() => {
    //     setSocket(io('https://caro-user-api-2.herokuapp.com?userName='
    //         + localStorage.getItem("username")));
    //     socket.on('connect', () => {
    //         console.log(socket.id)
    //         console.log(socket)
    //     })
    //     return () => {
    //         if (!socket) socket.close()
    //     }
    // }, []);
    //
    // useEffect(() => {
    //     if (!socket) return;
    //     socket.on('Online-users', (data) => {
    //         setUserList(data["Online"]);
    //     });
    // }, [socket]);

    const history = useHistory()

    const handleSignInButton = () => {
        history.push('/sign-in')
    }

    const handleSignOutButton = () => {
        localStorage.clear()
        setIsAuthenticated(localStorage.getItem("token"))
    }

    return (
        <>
            <Navbar style={{backgroundColor: '#F27405', justifyContent: 'space-around'}}>
                <Navbar.Brand style={{color: '#F2F2F2', fontWeight: 'bold'}}>GOMOKU</Navbar.Brand>
                <Row>
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
            <Container style={{width: 300}}>
                <div style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
                    Online Users
                </div>
                {userList.map((username) => (
                    <UserItem username={username} key={username}/>
                ))}
            </Container>
        </>
    )
};

export default Home;
