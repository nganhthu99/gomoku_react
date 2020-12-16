import React, {createContext} from "react";
import {useState} from "react";

const SocketContext = createContext()

const SocketProvider = (props) => {
    const [socket, setSocket] = useState(null)

    return(
        <SocketContext.Provider value={{socket, setSocket}}>
            {props.children}
        </SocketContext.Provider>
    )
};

export { SocketProvider, SocketContext };
