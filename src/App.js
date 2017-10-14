import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import SimpleForm from './components/SimpleForm'
import TediousForm from './components/TediousForm'
import GameList from './components/GameList'

class App extends Component {
  state = {
    formType: 'simple',
    searchTerm: '',
  }

  handleSearchTerm = searchTerm => {
    this.setState((prevState, props) => ({
      searchTerm,
    }))
  }

  handleChangeForm = formType => {
    console.log(formType)
    this.setState((prevState, props) => ({
      formType,
    }))
  }

  render() {
    const { formType, searchTerm } = this.state

    // this will do in a pinch, but use a router instead
    let form = null
    switch (formType) {
      case 'simple':
        form = <SimpleForm onSearch={this.handleSearchTerm} />
        break
      case 'tedious':
        form = <TediousForm onSearch={this.handleSearchTerm} />
        break
      case 'formik':
        form = <SimpleForm onSearch={this.handleSearchTerm} />
        break

      default:
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
          <div>
            <span
              className="form-link"
              onClick={() => this.handleChangeForm('simple')}
            >
              Simple
            </span>
            <span
              className="form-link"
              onClick={() => this.handleChangeForm('tedious')}
            >
              Tedious
            </span>
            <span
              className="form-link"
              onClick={() => this.handleChangeForm('formik')}
            >
              Formik
            </span>
          </div>
        </header>
        <div style={{ padding: 20 }}>{form}</div>

        <GameList searchTerm={searchTerm} />
      </div>
    )
  }
}

export default App
