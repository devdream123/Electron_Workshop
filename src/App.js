import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

class App extends Component {
    constructor(props){
        super(props);
        this.state = {gso: {state: "loading"} }
        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage(msg){
        ipcRenderer.send('MSG', msg);
    }

    componentDidMount(){
        ipcRenderer.on("GSO", (event, arg) => {
            console.log("Received GSO", arg);
            this.setState({ gso: arg });
        });
        this.sendMessage("Init");
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <textarea cols={20} rows={20} value={JSON.stringify(this.state.gso)} />
        </p>
        <p>
            {["Deal","Throw", "Count", "Again", "Change"].map(x => (
                <button onClick={() => this.sendMessage(x)} key={x}>{x}</button>    
            ))}
        </p>
      </div>
    );
  }
}

export default App;
