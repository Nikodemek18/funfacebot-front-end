import React from 'react';
import { useWeb3Context } from 'web3-react';

const BoxStore = (props) => {
    const context = useWeb3Context();
    return(
    <React.Fragment>
        <button
            onClick={() => {props.clicked(context)}}>   
            3Box!!
        </button>
    </React.Fragment>

    )
}

export default BoxStore;