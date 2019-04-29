import React from 'react';
import { useWeb3Context } from 'web3-react';


const CreateSpace = (props) => {
    const context = useWeb3Context();

    return(

    <button
        onClick={() => {props.clicked(context)}}>   
        Register Your Slack Group
    </button>

    )
}

export default CreateSpace;