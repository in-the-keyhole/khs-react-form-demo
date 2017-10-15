import React, { Component } from 'react'

export default class GameList extends Component {
  state = {
    games: [],
  }

  componentDidMount = async () => {
    const games = await fetch('http://localhost:1337/games')
      .then(response => response.json())
      .catch(error => {
        console.error(error)
      })
    this.setState((prevState, props) => ({ games }))
  }

  render() {
    const { searchTerm } = this.props
    const { games } = this.state

    if (!games) return null

    const filtered = games.filter(({ name }) =>
      name.toUpperCase().includes(searchTerm.toUpperCase())
    )

    return filtered
      .sort()
      .map((game, index) => (
        <div key={index}>{`${index + 1}: ${game.name}`}</div>
      ))
  }
}
