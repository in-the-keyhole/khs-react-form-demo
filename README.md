This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

The code for this walkthrough is available here [React Forms Demo] (https://github.com/in-the-keyhole/khs-react-form-demo)

# The Joy of Forms with React and Formik

React is a JavaScript library for building user interfaces.  That's it.  It's a way to use javascript to define UI elements based on user-defined properties and internal state.

![React website header](/assets/react_title.PNG "That's all there is to it...")

It has a clean, functional style.  You can create simple components that compose very well into larger components, which you can then use to compose pages and entire applications.  This simple composability is one of the main reasons I enjoy working with it.  But, it is not an application framework.  It doesn't pretend to be.  And that can be a problem.

> Note: I will be assuming some familiarity with React in general, including lifecycle hooks and props/state.  If you need a refresher, checkout this great article [here](https://keyholesoftware.com/2017/06/29/my-reaction-to-react/) and the offical [React docs](https://reactjs.org/).

### A Simple Search

React applications can start simply - maybe you want to list that long list of todos you created the last time you did a coding tutorial, a list of movies from a demo application,  or maybe all the Steam games you bought on sale but haven't played yet.  In the latter case, you could end up with way too many to deal with, so you need to be able to search for them.

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

Not too bad..  React ~~makes you~~ allows you to control the data flow explicitly in your application.  This is great in that the data-flow is unidirectional, which helps cut down on side-effects in large applications.  It does what we want in this case.  

### A *Small* Addition

The Steam Autumn Sale is coming up soon, and I want to make sure I can add some games to my collection.  Let's add a small form we can accomplish this.

```javascript
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
    // handle add here
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
```

Here we can see multiple custom TextInput controls in their natural habitat.  We can continue to grow the number of inputs if necessary, and we've added a nice ES6 feature to assign to the appropriate part of our `state`.  

```javascript
this.setState((prevState, props) => ({
  const { name, value } = event.target // destructure properties
  [name]: value, // ES6 computed property key
}))
```

But wait... What about different types of inputs?  Checkboxes?  Dropdowns?  What about validating each of those form inputs?  What about only validating after the user has left a field to promote good UX?  What about asynchronous validation?  What about disabling inputs and changes while asynchronous submission is occuring?  How do we handle nested form values?  How about checking for changes and dirty fields?  

As you can see, there are many concerns when developing a user experience for forms.  These are the types of things that separate a frustrating experience from a quality one.  Over time, it would be great to abstract out many of the concerns above and develop a library that we could use to address these issues.  Luckily for us, [Formik](https://github.com/jaredpalmer/formik) already has.

### Formik

