import React, { Component } from 'react';
import './App.css';
import { ethers } from 'ethers';
import Web3Provider from 'web3-react';
import { Connectors } from 'web3-react';
import Connect from './Components/Connect/Connect.jsx';
import contracts from './Contracts';
import CreateSpace from './Components/CreateSpace/CreateSpace';
import AddToWhitelist from './Components/AddToWhitelist/AddToWhitelist';
import Spinner from './Components/ImageUploads/Spinner/Spinner';
import Images from './Components/ImageUploads/Images/Images';
import Buttons from './Components/ImageUploads/Buttons/Buttons';
import BoxStore from './Components/BoxStore/BoxStore';
import EthCrypto from 'eth-crypto';
import Box from '3box';



class App extends Component{

  state = {
    context: null,
    contextFlag: false,
    spaceId: null,
    whitelistAddress: null,
    uploading: false,
    images: []
  }

  connectHandler = (context) =>{
    this.setState({contextFlag: true})
  }

  createSpaceHandler = async (context) => {
    console.log(context.account)
    let accessControlContract = new ethers.Contract(contracts.accessControls.address, contracts.accessControls.ABI, context.library.getSigner())
    await accessControlContract.createSpace();
    accessControlContract.once('newSpaceCreated', res => {
      this.setState({spaceId: res.toNumber()})
      })
  }

  spaceIdChangeHandler = (event) => {
    this.setState({spaceId: event.target.value});
  }

  whitelistAddressChangeHandler = (event) => {
    this.setState({whitelistAddress: event.target.value});
  }

  addToWhitelistClickHandler = async (context) => {
    let accessControlContract = new ethers.Contract(contracts.accessControls.address, contracts.accessControls.ABI, context.library.getSigner())
    console.log(this.state.whitelistAddress)
    console.log(this.state.spaceId)
    
    await accessControlContract.addToWhiteList(this.state.whitelistAddress, this.state.spaceId);
    accessControlContract.once('spaceMemberAdded', res => {
      this.setState({spaceMemberAdded: res.toNumber()});
      console.log(res.toString());
      })
    accessControlContract.once('whitelisted', res => {
      this.setState({newSpaceMemberAdded: res.toString()})
      console.log(res.toString());
    })
  }

  fileUploadHandler = context => async e => {
    const files = Array.from(e.target.files)
    // this.setState({uploading: true});
    let publicKey = '4a187d21eaed110584c7b534dda1bd030e6b0cdf47c700fb48ea4bbad7e40908025299137f44db8708b8e015c4143cbab9f403e716b936af2b35a31606aacbd2';

    //will need to convert to FormData object once decrypted server-side.
    //unfortunately, cannot directly encrypt FormData object client-side
    let encryptedFiles = [];

    await files.forEach(async (file, i) => {
      let msg = [i, file];
      let encryptedFile = await EthCrypto.encryptWithPublicKey(publicKey, msg);
      encryptedFiles.push(encryptedFile);
    })
    // console.log(encryptedFiles);
    let box = await Box.openBox(context.account, window.ethereum);
    box.onSyncDone(async () => {
      const workSpace = await box.openSpace(contracts.accessControls.address.toString() + this.state.spaceId.toString());
      let temp = await workSpace.public.get('files');
      if (temp === undefined){
        temp = [];
      }
      console.log(temp);
        let newEncryptedFiles = temp.concat(encryptedFiles);
      await workSpace.public.set('files', newEncryptedFiles);
    })
  }

  removeImageHandler = async (id) => {
    this.setState({
      images: this.state.images.filter(image => image.public_id !== id)
    })
  }

  boxHandler = async (context) => {
    // console.log(context.account);
    let box = await Box.openBox(context.account, window.ethereum);
    box.onSyncDone(async () => {
      const workSpace = await box.openSpace(contracts.accessControls.address.toString() + this.state.spaceId.toString());
      let x = await workSpace.public.get('files');
      console.log(x);
    })



  }
  newContextHandler = async (context) => {
    this.setState({context: context})
  }

  render(){

    const {InjectedConnector} = Connectors;
    const MetaMask = new InjectedConnector({ supportedNetworks: [ 4 ] });

    const connectors = {MetaMask};

    let spaceRender;

    const {uploading, images} = this.state;

    let imageContent = (context) => {
      switch (true){
        case uploading:
          return <Spinner />
        case images.length >0:
          return(
            <Images 
              images={images}
              removeImage={this.removeImageHandler}
            />
          )
        default: return <Buttons addImage={this.fileUploadHandler}/>
      }
    }

    if(this.state.spaceId !== null){
      spaceRender = <p>Your Space ID is {this.state.spaceId}</p>;
    }

    if (this.state.contextFlag === false){
      return(
        <Web3Provider
        connectors = {connectors}
        libraryName={'ethers.js'}
        >
          <Connect
            clicked={this.connectHandler}
            connection={connectors}
          />
        
        </Web3Provider>
      )
    }
    else {
      return (
        <Web3Provider
          connectors={connectors}
          libraryName={'ethers.js'}
          >
            <CreateSpace
              clicked={this.createSpaceHandler}
            />
            <br/>
            {spaceRender}
            <br/>
            <AddToWhitelist
              spaceIdChanged={this.spaceIdChangeHandler}
              whitelistAddressChanged={this.whitelistAddressChangeHandler}
              clicked={this.addToWhitelistClickHandler}
            />
            <br/>
            <br/>
            {imageContent()}
            <br/>
            <br/>
          <BoxStore
            clicked={this.boxHandler}
          />
      </Web3Provider>



      );
    }
  }
}

export default App;
