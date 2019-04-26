import React from 'react';
import { useWeb3Context } from 'web3-react';
import styles from './CreateSpace.module.css';

const CreateSpace = (props) => {
    const context = useWeb3Context();

    return(

    <button
        onClick={() => {props.clicked(context)}}>   
        Create New Space
    </button>

    )
}

export default CreateSpace;