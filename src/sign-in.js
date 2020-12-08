import React, {useState} from 'react';
import {Container, Form, Button, Card, Row} from "react-bootstrap";
import GoogleLogin from "react-google-login";
import FacebookLogin from 'react-facebook-login';
import { useHistory } from "react-router-dom";

export const api = 'https://caro-admin-api.herokuapp.com/'

const SignIn = (props) => {
    const history = useHistory()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleOnChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const handleOnChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSignInButton = () => {

    }

    const handleSignUpButton = () => {
        history.push('/sign-up')
    }

    const responseGoogle = (response) => {
        const user = response.profileObj
        console.log(user)
    }

    const responseFacebook = (response) => {
        console.log(response)
    }

    return (
        <Container>
            <Card style={{backgroundColor: '#F27405', padding: 20, margin: 30, height: 400}}>
                <Form style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Form.Group>
                        <Form.Label style={{color: '#F2F2F2'}}>Username</Form.Label>
                        <Form.Control onChange={(e) => handleOnChangeUsername(e)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{color: '#F2F2F2'}}>Password</Form.Label>
                        <Form.Control type="password"
                                      onChange={(e) => handleOnChangePassword(e)}/>
                    </Form.Group>
                    <Row style={{justifyContent: 'flex-end', paddingBottom: 20}}>
                        <Button onClick={handleSignUpButton} variant="link" style={{color: '#F2F2F2', textDecoration: 'underline'}}>
                            Don't have an account? Sign Up
                        </Button>
                    </Row>
                    <Row style={{justifyContent: 'space-evenly'}}>
                        <Button
                            onClick={handleSignInButton}
                            style={{backgroundColor: '#F2F2F2', color: '#F27405', width: 200}}>
                            Sign In
                        </Button>
                    </Row>
                </Form>
                <Row style={{justifyContent: 'space-evenly', paddingTop: 20, alignItems: 'center'}}>
                    <GoogleLogin
                        clientId="373788081790-9ukqs91r6ofjfvkggh2ea9ul9p3oisji.apps.googleusercontent.com"
                        buttonText='LOGIN WITH GOOGLE'
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                    />
                    <FacebookLogin
                        appId="2439172963055789"
                        icon="fa-facebook"
                        size='small'
                        callback={responseFacebook}
                    />
                </Row>
            </Card>
        </Container>
    )
};

export default SignIn;
