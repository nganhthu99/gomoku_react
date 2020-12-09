import React, {useState} from 'react';
import {Container, Form, Button, Card, Row} from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {api} from "./sign-in";

const SignUp = (props) => {
    const history = useHistory()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleOnChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const handleOnChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSignUpButton = () => {
        axios.post(api + '/users/signup', {
            username,
            password
        })
            .then((response) => {
                if (response.status === 201 && response.data.success) {
                    alert('Signing up succeeds')
                    history.push('/sign-in')
                } else if (!response.data.success) {
                    alert('Username already existed')
                }
            })
            .catch((error) => {
                alert('Error signing up. Please try again later')
            })
    }

    return (
        <Container>
            <Card style={{backgroundColor: '#F27405', padding: 20, margin: 30, height: 300}}>
                <Form>
                    <Form.Group>
                        <Form.Label style={{color: '#F2F2F2'}}>Username</Form.Label>
                        <Form.Control onChange={(e) => handleOnChangeUsername(e)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{color: '#F2F2F2'}}>Password</Form.Label>
                        <Form.Control type="password"
                                      onChange={(e) => handleOnChangePassword(e)}/>
                    </Form.Group>
                    <Row style={{justifyContent: 'center', paddingTop: 30}}>
                        <Button
                            onClick={handleSignUpButton}
                            style={{backgroundColor: '#F2F2F2', color: '#F27405', width: 200}}>Sign Up
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    )
};

export default SignUp;
