import React, { useState, useEffect, createContext } from 'react';
import Scrumboard from './Scrumboard';
import Forms from './Forms';

export const dragContext = createContext();

export default function MainContainer() {
	const [stories, setStories] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [dragid, setDragId] = useState(0);

	useEffect(() => {
		getData();
	}, []);

	function newDragStatus(newStatus) {
		fetch('/api/task', {
			method: 'PATCH',
			body: JSON.stringify({
				status: newStatus,
				task_id: dragid,
			}),
			headers: {
				'Content-type': 'application/json',
			},
		})
			.then(() => {
				getData();
			})
			.catch((err) => {
				console.log({ err: `Error updating task status: ${err}` });
			});
	}

	function handleOnDrag(e) {
		setDragId(e.target.id);
	}

	function handleDrop(e) {
		const id = !e.target.id ? e.currentTarget.id : e.target.id;
		if (id === 'stories') {
			return;
		}
		newDragStatus(id);
	}

	function getData() {
		fetch('/api/')
			//add team id to request here
			//make this a POST request
			// , {
			// 	method: 'POST',
			// 	body: JSON.stringify({
			// 		team_id: team_id
			// 	}),
			// 	headers: {
			// 		'Content-type': 'application/json',
			// 	},
			// }
			// //include team_id

			.then((data) => data.json())
			.then((data) => {
				console.log(data, 'this is the response from server');
				setStories(data.stories);
				console.log(data.stories);
				setTasks(data.tasks);
			})
			.catch((err) => {
				console.log({ err: `Error fetching task and story data: ${err}` });
			});
	}

	// RENDER MAINCONTAINER
	return (
		<dragContext.Provider
			value={{
				handleOnDrag,
				handleDrop,
				getData,
			}}>
			<div className='mainContainer'>
				<Forms storyList={stories} />
				<Scrumboard storyList={stories} taskList={tasks} />
			</div>
		</dragContext.Provider>
	);
}
