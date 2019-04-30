import React from 'react';
import { useWeb3Context } from 'web3-react';
import Web3 from 'web3';


const CreateSpace = (props) => {
    const context = useWeb3Context();
    const web3 = new Web3(Web3.givenProvider);

    return(
    <button
        onClick={() => {props.clicked(context, web3)}}>   
        Register Your Slack Group
    </button>

    )
}

export default CreateSpace;