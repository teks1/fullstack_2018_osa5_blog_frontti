import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog'

describe.only('<SimpleBlog />', () => {
  it('renders content', () => {
    const blog = {
      title: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
      author: 'fullstack',
      url: 'nope'
    }
    
    const blogComponent = shallow(<SimpleBlog blog={blog} />)
    const contentDiv = blogComponent.find('.content')
    
    expect(contentDiv.text()).toContain(blog.title)
  })
  it('clicking the button calls event handler twice', () => {
    const blog = {
        title: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
        author: 'fullstack',
        url: 'nope'
      }
  
    const mockHandler = jest.fn()
  
    const blogComponent = shallow(<SimpleBlog blog={blog} onClick={mockHandler} />)
  
    const button = blogComponent.find('button')
    button.simulate('click')
    button.simulate('click')
  
    expect(mockHandler.mock.calls.length).toBe(2)
  })
})
