import React from 'react'
const Blog = ({blog, toggleLike, toggleDelete}) => {
  return (
  <div>
    {blog.title} {blog.author}
    <button onClick={toggleLike}>Like</button>
    <button onClick={toggleDelete}>Delete</button>
  </div>
  )
}

export default Blog