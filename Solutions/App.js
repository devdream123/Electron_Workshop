import React, { Component } from 'react';

// Import components
import Player from './Player';
import Board from './Board';

// Reference CSS file for styles
import './App.css';

// Import electron and establis connection to use app.js as Renderer
const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

class App extends Component {

    // Set the initial state, before contacting backend.
    // Bind the function to send messages
    constructor(props){
        super(props);
        this.state = {gso: {state: "loading"} }
        this.sendMessage = this.sendMessage.bind(this);
    }

    // Using electron Renderer send message to Main process.
    sendMessage(msg){
        ipcRenderer.send('MSG', msg);
    }

    // When the page loads, get GSO from backend, save it to state.
    componentDidMount(){
        ipcRenderer.on("GSO", (event, arg) => {
            this.setState({ gso: arg });
        });
        this.sendMessage("Init");
    }

    // Separate function to render our game table
    renderTable(){
        return  (
            <div className="Table">
                <div className="Column">
                    <h2 className = {this.state.gso.players[0].active ? "Active" : "Inactive"}>Player 1</h2> 
                    <Player data={this.state.gso.players[0]} state={this.state.gso.state} send={this.sendMessage}/>
                </div>
                <div className="Column">
                    <Board data={this.state.gso.board} state={this.state.gso.state}/>
                </div>
                <div className="Column">
                    <h2 className = {this.state.gso.players[1].active ? "Active" : "Inactive"}>Player 2</h2> 
                    <Player data={this.state.gso.players[1]} state={this.state.gso.state} send={this.sendMessage}/>
                </div>
            </div>
        )
    }

    // Render the application
    render() {
        return (
          <div className="App">
            <div>
                {this.state.gso.state==="loading" ? <i>Loading...</i> : this.renderTable()}
            </div>
          </div>
        );
    }
}

export default App;
