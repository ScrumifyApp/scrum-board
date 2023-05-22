import React, { useState, useEffect } from 'react';
import Scrumboard from './Scrumboard';
import Forms from './Forms';
import { dragContext } from '../../../context';


export default function MainContainer({user, team}) {
	const [stories, setStories] = useState([]);
	const [tasks, setTasks] = useState([]);
  const [dragid, setDragId] = useState(0);

  useEffect(() => {
    getData();
	}, []);

	function newDragStatus(newStatus) {
		// console.log('new status', newStatus, dragid);
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
			.then((data) => {
				// console.log('this should be updated task status', data);
				getData();
			})
			.catch((err) => {
				console.log({ err: `Error updating task status: ${err}` });
			});
	}

	function handleOnDrag(e) {
		setDragId(e.target.id);
		// console.log('dragging this', e.target);
	}

	function handleDrop(e) {
		const id = !e.target.id ? e.currentTarget.id : e.target.id;
		if (id === 'stories') {
			return;
		}
		newDragStatus(id);
	}

	function getData() {
		fetch('/api/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ team_id: team }),
		})
			.then((data) => {
				// console.log(data, 'raw data');
				return data.json();
			})
			.then((data) => {
				// console.log(data, 'this is the response from server');
				setStories(data.stories);
				// console.log(data.stories);
				setTasks(data.tasks);
				// // setTasks(data.status);
				// console.log(data.tasks);
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
