This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

The code for this walkthrough is available [here](https://github.com/in-the-keyhole/khs-react-form-demo).

Instructions for use: `yarn install && yarn start`

# The Joy of Forms with React and Formik

React is a JavaScript library for building user interfaces.  That's it.  It's a way to use javascript to define UI elements based on user-defined properties and internal state.

![React website header](/assets/react_title.PNG "That's all there is to it...")

It has a clean, functional style.  You can create simple components that compose very well into larger components, which you can then use to compose pages and entire applications.  This simple composability is one of the main reasons I enjoy working with it.  But, it is not an application framework.  It doesn't pretend to be.  This can be useful when all you want is some quick UI.  But, as the application grows, you will need to depend on outside libraries for things like state-management, routing, and forms.  In this article, I will be covering how an application can and should handle user input with Formik.

> Note: I will be assuming some familiarity with React in general, including lifecycle hooks and props/state.  If you need a refresher, checkout this great article [here](https://keyholesoftware.com/2017/06/29/my-reaction-to-react/) and the offical [React docs](https://reactjs.org/).

## A Simple Search

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

## A *Small* Addition

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

Here we can see multiple custom `TextInput` controls in their natural habitat.  We can continue to grow the number of inputs if necessary, and we've added a nice ES6 feature to assign to the appropriate part of our `state`.  

```javascript
this.setState((prevState, props) => ({
  const { name, value } = event.target // destructure properties
  [name]: value, // ES6 computed property key
}))
```

But wait... What about different types of inputs?  Checkboxes?  Dropdowns?  What about validating each of those form inputs?  What about only validating after the user has left a field to promote good UX?  What about asynchronous validation?  What about disabling inputs and changes while asynchronous submission is occuring?  How do we handle nested form values?  How about checking for changes and dirty fields?  

As you can see, there are many concerns when developing a user experience for forms.  These are the types of things that separate a frustrating experience from a quality one.  We could definitely handle all these cases with some work, and over time, it would be great to abstract out many of the concerns above and develop a library that we could use to address these issues.  Luckily for us, [Formik](https://github.com/jaredpalmer/formik) already has.

## Formik

As a basic example, let's look at what Formik gives us.  You can use it as a [higher-order component](http://reactpatterns.com/#higher-order-component) or a [render callback](http://reactpatterns.com/#render-callback) (also applicable as a [child function](http://reactpatterns.com/#function-as-children)).  This allows for greater flexibility in the props and state as well as enhanced composability.  There is also no need to track the state of the form elements explicity.  You can allow your form to handle itself, which is one of the key elements of React and a component-based architecture.  

Here is a basic version of the Add Game form using Formik (with a render callback).

```javascript
import React, { Component } from 'react'
import TextInput from './TextInputFormik'
import { Formik, Form, Field } from 'formik'
import Yup from 'yup'
import isEmpty from 'lodash/isEmpty'

export default class AddGameForm extends Component {
  render() {
    return (
      <div className="addGameForm">
        <Formik
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .min(3, 'Title must be at least 3 characters long.')
              .required('Title is required.'),
          })}
          initialValues={{
            title: 'asdf',
            releaseYear: '',
            genre: '',
            price: '12',
          }}
          onSubmit={(values, actions) => {
            // this could also easily use props or other
            // local state to alter the behavior if needed
            // this.props.sendValuesToServer(values)

            setTimeout(() => {
              alert(JSON.stringify(values, null, 2))
              actions.setSubmitting(false)
            }, 1000)
          }}
          render={({ values, touched, errors, dirty, isSubmitting }) => (
            <Form>
              <Field
                type="text"
                name="title"
                label="Title"
                component={TextInput}
              />
              <Field
                type="text"
                name="releaseYear"
                label="Release Year"
                component={TextInput}
              />
              <Field
                type="text"
                name="genre"
                label="Genre"
                component={TextInput}
              />
              <Field
                type="text"
                name="price"
                label="Price"
                component={TextInput}
              />
              <button
                type="submit"
                className="btn btn-default"
                disabled={isSubmitting || !isEmpty(errors) || !dirty}
              >
                Add Game
              </button>
            </Form>
          )}
        />
      </div>
    )
  }
}
```

The Formik component gives us access to numerous props that we can use to get the behavior we want.  Any of these can be extracted to their own contants or adjusted based on internal state or props passed down to it.  Let's break down some key features that Formik provides.

#### Validation
Formik leans on [Yup](https://github.com/jquense/yup) for validation.  This provides a simple, yet powerful, way to validate an object schema for your form controls.

```javascript
validationSchema={Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters long.')
    .required('Title is required.'),
})}
```

The `validationSchema` prop takes a `Yup` schema or a function that returns one.  There are many times of validators, such as for objects, strings, numbers, dates, etc.  You can also create your own.  The validators can be chained to allow precise contraints for acceptable values.

You also do not need to use Yup - you can write your own validation functions with plain javascript by providing a `validation` prop instead of a validationSchema.

```javascript
validate={values => {
  let errors = {}
  if (!values.price) {
    errors.price = 'Required'
  } else if (values.price > 60) {
    errors.price = 'Costs too much, wait for the sale!'
  }
  return errors
}}
```

The `errors` object simply has a matching key for each value in the form values object.

#### Form Layout

Formik provides `Form` and `Field` components as well, which are merely helping components to take care of basic `<form>` and `<input>` tags.  These follow established conventions which are outlined more in the [documentation](https://github.com/jaredpalmer/formik#field-).  In these cases we're passing a custom `TextInput` component that lets us control how the labels, inputs, and error messages are laid out.  Below is a basic example.

```javascript
import React from 'react'
import classnames from 'classnames'

const InputFeedback = ({ children }) => (
  <span className="text-danger">{children}</span>
)

const Label = ({ error, children, ...props }) => {
  return <label {...props}>{children}</label>
}

const TextInput = ({
  field: { name, ...field }, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  className,
  label,
  ...props
}) => {
  const error = errors[name]
  const touch = touched[name]
  const classes = classnames(
    'form-group',
    {
      'animated shake error': !!error,
    },
    className
  )
  return (
    <div className={classes}>
      <Label htmlFor={name} error={error}>
        {label}
      </Label>
      <input
        id={name}
        className="form-control"
        type="text"
        {...field}
        {...props}
      />
      {touch && error && <InputFeedback>{error}</InputFeedback>}
    </div>
  )
}

export default TextInput
```

We create a `div` that holds our label, input, and error output.  Here we're using stateless functional components for our elements.  This keeps our templates simple without the need for hooking into the React lifecycle or keeping track of internal state.  This is a great pattern to use because it means that they are truly just javascript functions that transform data into markup.  With a little work, this would make a great addition to anyone's component library!

More great examples can be found on [codesandbox](https://codesandbox.io/s/q8yRqQMp).

#### Form State and Submission

If you have developed line-of-business applications like I have, you know that form state and submission handling is sometimes annoying and prone to repitition.  Formik lets us handle this by creating a convention that lets us easily handle submitting the form, setting state, and tracking whether the form is dirty.  

```javascript
onSubmit={(values, actions) => {
  // this could also easily use props or other
  // local state to alter the behavior if needed
  // this.props.sendValuesToServer(values)

  setTimeout(() => {
    alert(JSON.stringify(values, null, 2))
    actions.setSubmitting(false)
  }, 1000)
}}
```

Here we're just faking a server delay and then `alert`ing the values.  We also have `actions` that formik provides to make our UX dynamic and more pleasant for the user.  We can disable the submit button while the form is submitting, dirty, or otherwise not in a state that we want, as shown below.

```html
<button
  type="submit"
  className="btn btn-default"
  disabled={isSubmitting || !isEmpty(errors) || !dirty}
>
  Add Game
</button>
```

No more explicit state handling for disabling inputs, and no more saving copies of objects to check on dirty state!  Huzzah!

## Conclusion

React has come a long way - it has a thriving community of developers and many great libraries to choose from.  I think Formik is one of them.  It takes a lot of the pain and tedium out of developing forms by giving you concise conventions and solid patterns to follow.  

If you haven't used React or Formik in the past, I encourage you to give it a try.  It has been a joy to work with so far, with a development cycle that is top-notch and a true lack of ceremony around creating reusable, composable components.  This dynamic nature (after all, it is *just* Javascript) grants great power and flexibility.  

If you want to learn more about React or Formik, check out the source code for these samples [here](https://github.com/in-the-keyhole/khs-react-form-demo), our "Now Playing" [reference application](https://github.com/in-the-keyhole/khs-react-course), or contact Keyhole for access to our React training course!