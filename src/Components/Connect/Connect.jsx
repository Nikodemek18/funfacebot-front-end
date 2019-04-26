import React, { useState } from 'react';
import { useWeb3Context } from 'web3-react';

const Connect = (props) => {
    const context = useWeb3Context();
    let connective = Object.keys(props.connection).map(connectorName => (
        <button
            key={connectorName}
            onClick={() => {
                context.setConnector(connectorName)
                props.clicked();
            }}
        
        > Connect with {connectorName}
        </button>
        
    ))
    return connective

}

export default Connect;