import React from 'react';
import {Button, Card, Container, Navbar} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'
import randomColor from 'randomcolor'
import { useHistory } from "react-router-dom";

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
    const history = useHistory()

    const handleSignInButton = () => {
        history.push('/sign-in')
    }

    return (
        <>
            <Navbar style={{backgroundColor: '#F27405', justifyContent: 'space-around'}}>
                <Navbar.Brand style={{color: '#F2F2F2', fontWeight: 'bold'}}>GOMOKU</Navbar.Brand>
                <Button style={{backgroundColor: '#F2F2F2', color: '#F27405'}}
                        onClick={handleSignInButton}>
                    Sign In
                </Button>
            </Navbar>
            <Container style={{width: 300}}>
                <div style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
                    Online Users
                </div>
                {['thunguyen', 'tuandao', 'hongtran', 'dattruong', 'nhinguyen'].map((username) => (
                    <UserItem username={username} key={username}/>
                ))}
            </Container>
        </>
    )
};

export default Home;
