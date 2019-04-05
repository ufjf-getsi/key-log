import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = { nome: "Fulano", pessoas:[]};
  }
  noClick(){
    this.state.pessoas.push(this.state.nome);

    this.setState({ nome: "", pessoas: this.state.pessoas });
    console.log(this.state.pessoas);
    
  }

  render() {
    let liPessoas = [];
    for (let index = 0; index < this.state.pessoas.length; index++) {
      const element = this.state.pessoas[index];
      liPessoas.push(<li key={index+element}>{element}</li>)
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          
          </a>
          <input value={this.state.nome} onChange={(e)=>{
            this.setState({nome:e.target.value, pessoas:this.state.pessoas})
          }}/>
          <button onClick={this.noClick.bind(this)}>Enviar</button>
          <ul>
            {liPessoas}
          </ul>
        </header>
      </div>
    );
  }
}

export default App;
