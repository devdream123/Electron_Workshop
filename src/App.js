import React, { Component } from 'react';
import logo from './logo.svg';
import Player from './Player';
import Board from './Board';
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

    renderTable(){
        return  (
            <div>
                {/*<textarea cols={20} rows={20} value={JSON.stringify(this.state.gso)} />*/}
                <div style={{display:"inline-block", width:"33%"}}>
                    <h2>Player 1</h2> 
                    <Player data={this.state.gso.players[0]} state={this.state.gso.state} send={this.sendMessage}/>
                </div>
                <div style={{display:"inline-block", width:"33%"}}>
                    <Board data={this.state.gso.board} state={this.state.gso.state}/>
                </div>
                <div style={{display:"inline-block", width:"33%"}}>
                    <h2>Player 2</h2> 
                    <Player data={this.state.gso.players[1]} state={this.state.gso.state} send={this.sendMessage}/>
                </div>
            </div>
        )
    }

  render() {
    return (
      <div className="App">
        <div>
         {this.state.gso.state==="loading" ? <i>Loading...</i> : this.renderTable()}
        </div>
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
