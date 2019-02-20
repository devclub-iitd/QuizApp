import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    data: null
  };
  componentDidMount() {
    this.call()
    .then(body => this.setState({ data: body.data }))
    .catch(err => console.log(err));
  }

  call = async () => {
    const response = await fetch('/abc', {
	accept: 'application/json', mode: 'cors',
  });
    return response.json();
  }

  render() {
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
	{this.state.data}
	</a>
        </header>
      </div>
    );
  }
}

export default App;
