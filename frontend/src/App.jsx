import { useEffect, useState, useMemo } from "react";
import "./style.css";

function App() {
	const [items, setItems] = useState([]);

  const left = useMemo(() => items.filter(item => !item.completed).length, [items]); 

	useEffect(() => {
		fetch("/api/getTodos")
			.then(r => r.json())
			.then(({ items }) => {
				setItems(items);
			})
	}, []);


	return (
		<>
			<h1>Todo List: </h1>
			<ul className="todoItems">
				{items.map((item, index) => (
					<li key={index} className="item">
						<span 
            className={item.completed ? "completed" : null}
            onClick={async event => {
              await fetch(`/api/mark${item.completed ? 'Un' : ''}Complete`, {
                method: 'PUT',
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemFromJS: item.thing })
              })
              setItems(items.map(loopItem => loopItem._id === item.id ? { ...loopItem, completed: !loopItem.completed} : loopItem))
              
            }}
            >{item.thing}</span>
						<span
							className="fa fa-trash"
							onClick={async () => {
								await fetch("/api/deleteItem", {
									method: "DELETE",
									body: JSON.stringify({ itemFromJS: item.thing }),
									headers: {
										"Content-Type": "application/json",
									},
								});
								setItems(items.filter((loopItem) => loopItem._id !== item._id));
							}}
						></span>
					</li>
				))}
			</ul>

			<h2>Left to do:{left}</h2>

			<h2>Add A Todo:</h2>

			<form
				action="/api/addTodo"
				method="POST"
				onSubmit={async (event) => {
					event.preventDefault();
					const form = event.currentTarget;
					const response = await fetch(form.action, {
						method: form.method,
						body: JSON.stringify({
							todoItem: form.elements.todoItem.value,
						}),
						headers: {
							"Content-Type": "application/json",
						},
					})

					const newItem = await response.json();
					setItems([...items, newItem]);
				}}
			>
				<input type="text" placeholder="Thing To Do" name="todoItem" />
				<input type="submit" />
			</form>
		</>
	);
}

export default App;
