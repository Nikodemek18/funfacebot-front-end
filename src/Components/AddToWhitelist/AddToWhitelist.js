import React from 'react';
import { useWeb3Context } from 'web3-react';
import styles from './AddToWhitelist.module.css';

const AddToWhitelist = (props) => {
    const context = useWeb3Context();

    return(
    <React.Fragment>
        <p>Whitelist a friend!</p>
        <label>
            Space ID
        </label>
        <input
            name="spaceId"
            onChange={(event) => {props.spaceIdChanged(event)}}
        />
        <label>
            Friend's Eth Address
        </label>
        <input
            name="addressToWhitelist"
            onChange={(event) => {props.whitelistAddressChanged(event)}}
        />

        <button
            onClick={() => {props.clicked(context)}}>   
            Whitelist!!
        </button>
    </React.Fragment>

    )
}

export default AddToWhitelist;