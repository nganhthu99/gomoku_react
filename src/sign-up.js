import React, {useState} from 'react';
import {Container, Form, Button, Card, Row} from "react-bootstrap";
import axios from "axios";

export const api = 'https://caro-admin-api.herokuapp.com'

const SignUp = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleOnChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const handleOnChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSignUpButton = () => {
        // axios.get(api + '/users/check?username=' + username)
        //     .then((response) => {
        //         if (response.status === 200 && response.data.User.length === 0) {
        //             axios.post(api + '/users/create', {
        //                 username,
        //                 password
        //             })
        //                 .then((response) => {
        //                     alert('Signing Up Succeeds')
        //                 })
        //                 .catch((error) => {
        //                     alert(error)
        //                 })
        //         } else {
        //             alert('ERROR: Username existed')
        //         }
        //     })
        //     .catch((error) => {
        //         alert(error)
        //     })
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
