import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [item, setItem] = useState([]);
  const [left, setLeft] = useState(0);

  return (
    <>
      <h1>Todo List: </h1>
    <ul class="todoItems">
    <% for(let i=0; i < items.length; i++) {%>
    {items.map((item, index) => (
      <li key={index} className='item'>
        {item.completed === true ? <span className='completed'>{item.thing}</span> : <span>{item.thing}</span>
        <span class='fa fa-trash'></span>
      </li>
    ))}
    </ul>

    <h2>Left to do:{left}</h2>

    <h2>Add A Todo:</h2>

    <form action="/addTodo" method="POST">
        <input type="text" placeholder="Thing To Do" name="todoItem" />
        <input type="submit" />
    </form>
    </>
  )
}

export default App
