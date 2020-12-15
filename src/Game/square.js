import React from 'react';
import {Button} from "react-bootstrap";
import { IoEllipseOutline , IoCloseOutline} from "react-icons/io5";

const Square = ({value, onClickHandle, isColored}) => {
    return (
        <Button variant="outline-primary"
                style={isColored ? {
                    height: 30,
                    width: 30,
                    borderRadius: 0,
                    fontSize: 15,
                    padding: 0,
                    margin: 0,
                    backgroundColor: "yellow"
                } : {
                    height: 30,
                    width: 30,
                    borderRadius: 0,
                    fontSize: 15,
                    padding: 0,
                }}
                onClick={onClickHandle}>
            {value === 'X' && <IoCloseOutline color= 'green' size={26}/>}
            {value === 'O' && <IoEllipseOutline color='red' size={22}/>}
        </Button>
    )
}

export default Square;
