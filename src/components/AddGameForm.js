import React, { Component } from 'react'
import TextInput from './TextInput' //re-usable TextInput!

export default class AddGameForm extends Component {
  state = {
    title: '',
    releaseYear: '',
    genre: '',
    price: '',
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState((prevState, props) => ({
      [name]: value,
    }))
  }

  handleSubmit = event => {
    event.preventDefault() // prevent form post
  }

  render() {
    const { title, releaseYear, genre, price } = this.state
    return (
      <div className="addGameForm">
        <form onSubmit={this.handleSubmit}>
          <TextInput
            id="title"
            name="title"
            type="text"
            label="Title "
            placeholder="Game title"
            value={title}
            onChange={this.handleChange}
          />
          <TextInput
            id="releaseYear"
            name="releaseYear"
            type="text"
            label="Release year "
            placeholder="1993"
            value={releaseYear}
            onChange={this.handleChange}
          />
          <TextInput
            id="genre"
            name="genre"
            type="text"
            label="Genre "
            placeholder="Action/Arcade/Shooter"
            value={genre}
            onChange={this.handleChange}
          />
          <TextInput
            id="price"
            name="price"
            type="text"
            label="Price "
            placeholder="13.37"
            value={price}
            onChange={this.handleChange}
          />
          <div>
            <input className="btn" type="submit" value="Add Game" />
          </div>
        </form>
      </div>
    )
  }
}
