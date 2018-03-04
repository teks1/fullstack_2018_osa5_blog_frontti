import React from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      title:'',
      author:'',
      url:'',
      error: null,
      info: null,
      username:'',
      password: '',
      user: null
    }
  }

  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({user})
      blogService.setToken(user.token)
    }
  } 

  addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: this.state.title,
      author: this.state.author,
      url: this.state.url
    }
    
    blogService
    .create(blogObject)
    .then(newBlog => {
      this.setState({
        blogs: this.state.blogs.concat(newBlog),
        title:'',
        author:'',
        url:''  
      })
    })
    this.setState({
      info: 'new blog added'
    })
    setTimeout(() => {
      this.setState({ info: null })
    }, 5000)
  }

  login = async (event) => {
    event.preventDefault()
    console.log('login in with', this.state.username, this.state.password)
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      this.setState({ username: '', password: '', user})
    } catch (exception) {
      this.setState({
        error: 'username or/and password wrong'
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }

  logout = async (event) => {
    //event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload()
  }

  handleLoginFieldChange = (event) => {
    //console.log(event.target.name)
    this.setState({ [event.target.name]: event.target.value })
  }

  handleNewBlogFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {

    const loginForm = () => (
      <div>
        <h2>Log in</h2>
        <form onSubmit={this.login}>
          <div>
            Username
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleLoginFieldChange}
              />
          </div>
          <div>
            Password
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleLoginFieldChange}
            />
          </div>
          <button type="submit">login</button>
          </form>
      </div>
    )

    const blogForm = () => (
      <div>
        <h2>Add new blog</h2>
        <form onSubmit={this.addBlog}>
        <div>
            Title
            <input
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleNewBlogFieldChange}
              />
          </div>
          <div>
            Author
            <input
              type="text"
              name="author"
              value={this.state.author}
              onChange={this.handleNewBlogFieldChange}
            />
          </div>
          <div>
            Url
            <input
              type="text"
              name="url"
              value={this.state.url}
              onChange={this.handleNewBlogFieldChange}
            />
          </div>
          <button type="submit">save</button>
        </form>
      </div>
    )

    return (
      <div>
        <h1>Topic</h1>
        
        <Notification message={this.state.error} />
        <Notification message={this.state.info} />
        {this.state.user === null ?
        loginForm() :
        <div>
          <p>{this.state.user.name} logged in <button onClick={this.logout}>logout</button></p>
          {blogForm()}
        </div>
        }
        <h2>Blogs</h2>
        {this.state.blogs.map(blog => 
          <Blog key={blog._id} blog={blog}/>
        )}
      </div>
    )
  }
}

export default App;
