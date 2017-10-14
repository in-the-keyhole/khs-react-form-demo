This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

The code for this walkthrough is available here [React Forms Demo] (https://github.com/in-the-keyhole/khs-react-form-demo)

# The Joy of Forms with React and Formik

React is a JavaScript library for building user interfaces.  That's it.  It's a way to use javascript to define UI elements based on user-defined properties and internal state.

![React website header](/assets/react_title.PNG "That's all there is to it...")

It has a clean, functional style.  You can create simple components and compose very well into larger components, which you can then use to compose pages and entire applications.  This simple composability is one of the main reasons I enjoy working with it.  But, it is not an application framework.  It doesn't pretend to be.  And that can be a problem.

> Note: I will be assuming some familiarity with React in general, including lifecycle hooks and props/state.  If you need a refresher, checkout this great article here (TODO LINK TO DAVES REACTION) and the offical [React docs](https://reactjs.org/).

React applications can start simply - maybe you want to list that long list of todos you created the last time you did a coding tutorial, a list of movies from a demo application,  or maybe all the Steam games you own but haven't played yet.  In the latter case, you could end up with way to many to deal with, so you need to be able to search for them.

![Search bar](/assets/search_bar.PNG "Rocket League is life.")

Here's a simple component that will let us find our long-lost games.

```javascript
import React, { Component } from 'react'

export default class SimpleForm extends Component {
  state = {
    searchTerm: '',
  }

  handleSubmit = event => {
    event.preventDefault() // prevent form post
    this.props.onSearch(this.state.searchTerm)
  }

  handleSearch = event => {
    const searchTerm = event.target.value
    this.setState((prevState, props) => ({
      searchTerm,
    }))
  }

  render = () => (
    <div>
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Search games"
          value={this.state.searchTerm}
          onChange={this.handleSearch}
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}


```

Not too bad, but a bit tedious.  React ~~makes you~~ allows you to control the data flow explicitly in your application.  This is great and does what we want in this case.  

But the Steam Autumn Sale is coming up soon, and I want to make sure I can add some games to my collection.  Let's add a small form to let me do this.

