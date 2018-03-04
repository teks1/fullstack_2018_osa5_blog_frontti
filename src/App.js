import React from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
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

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  toggleLikeOf = (id) => {
    return () => {
      const blog = this.state.blogs.find(b => b.id === id)
      const changedBlog = {...blog, likes: blog.likes + 1 }

      blogService
      .update(id, changedBlog)
      .then(changedBlog => {
        this.setState({
          blogs: this.state.blogs.map(b => b.id !== id ? b : changedBlog)
        })
      })
      .catch(error => {
        this.setState({
          error: `no such blog`,
          blogs: this.state.blogs.filter(b => b.id !== id)
        })
        setTimeout(() => {
          this.setState({ error: null })
        }, 5000)
      })
    }
  }

  toggleDelete = (id) => {
    return () => {
      blogService.deleteOne(id)
      window.location.reload()
    }
  }

  render() {

    const loginForm = () => (
      <Togglable buttonLabel="login">
        <LoginForm
          visible={this.state.visible}
          username={this.state.username}
          password={this.state.password}
          handleChange={this.handleChange}
          handleSubmit={this.login}
        />
      </Togglable>
    )
    const blogForm = () => (
     
        <BlogForm
          title={this.state.title}
          author={this.state.author}
          url={this.state.url}
          handleChange={this.handleChange}
          handleSubmit={this.addBlog}
        />
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
          <h2>Blogs</h2>
          {this.state.blogs.map(blog => 
          <Blog 
          key={blog.id} 
          blog={blog}
          toggleLike={this.toggleLikeOf(blog.id)}
          toggleDelete={this.toggleDelete(blog.id)}
          />
        )}
        </div>
        }
        
        
      </div>
    )
  }
}

export default App;
