import React from 'react';
import { useContext } from 'react';
import { dragContext } from './MainContainer';

export default function Task({ task, id, color }) {
	// MAKE PATCH REQUEST TO UPDATE TASK STATUS

	const { handleOnDrag, getData } = useContext(dragContext);

	function changeStatus(newStatus) {
		fetch('/api/task', {
			method: 'PATCH',
			body: JSON.stringify({
				status: newStatus,
				task_id: task.id,
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

	// MAKE DELTE REQUEST TO DELETE TASK
	function deleteTask() {
		fetch(`/api/task/${id}`, {
			method: 'DELETE',
		})
			.then(() => {
				getData();
			})
			.catch((err) => {
				console.log({ err: `Error deleting task: ${err}` });
			});
	}

	// const classes = `task ${task.color}`;
	const classes = 'task';
	const styles = { backgroundColor: color };
	// RENDER TASK COMPONENT
	//
	return (
		<div
			draggable
			onDragStart={(e) => handleOnDrag(e)}
			id={id}
			className={classes}
			style={styles}>
			<p>
				<span className='task-label'>Task</span>
				{task.description}
			</p>
			<p>
				<span className='task-label'>Name</span>
				{task.name}
			</p>
			<p>
				<span className='task-label'>Difficulty</span>
				{task.difficulty}
			</p>
			<select onChange={(e) => changeStatus(e.target.value)}>
				<option value='' hidden>
					Change status
				</option>
				<option value='backlog'>Backlog</option>
				<option value='todo'>To Do</option>
				<option value='inProgress'>In Progress</option>
				<option value='toVerify'>To Verify</option>
				<option value='done'>Done</option>
			</select>
			<div
				style={{ display: 'flex', width: 100 + '%', justifyContent: 'center' }}>
				<button type='button' onClick={() => deleteTask()}>
					Delete
				</button>
			</div>
		</div>
	);
}
