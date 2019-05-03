import React, { useState } from 'react';
import { useWeb3Context } from 'web3-react';
import styles from './Connect.module.css'


const Connect = (props) => {
    const context = useWeb3Context();
    let connective;

    connective = Object.keys(props.connection).map(connectorName => (
    <button
        className={styles.MetamaskButton}
        key={connectorName}
        onClick={() => {
            context.setConnector(connectorName)
            props.clicked();
        }}
    > Connect with {connectorName}
    </button>
    
    ));
    return connective

}

export default Connect;