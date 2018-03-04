import React from 'react'

const BlogForm = ({handleSubmit, handleChange, title, author, url}) => {
    return (
        <div>
        <h2>Add new blog</h2>
        <form onSubmit={handleSubmit}>
        <div>
            Title
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              />
          </div>
          <div>
            Author
            <input
              type="text"
              name="author"
              value={author}
              onChange={handleChange}
            />
          </div>
          <div>
            Url
            <input
              type="text"
              name="url"
              value={url}
              onChange={handleChange}
            />
          </div>
          <button type="submit">save</button>
        </form>
        </div>
    )
}

export default BlogForm
