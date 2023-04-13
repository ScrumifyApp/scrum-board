import React from 'react';
import { useContext } from 'react';
import { dragContext } from './MainContainer';

export default function Task({ task, id, color }) {
	// MAKE PATCH REQUEST TO UPDATE TASK STATUS

	const { handleOnDrag, getData } = useContext(dragContext);

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
			<button className='delete' onClick={() => deleteTask()}>
				x
			</button>
			<p>
				<span className='task-label'>Task:</span>
				{task.description}
			</p>
			<p>
				<span className='task-label'>Name:</span>
				{task.name}
			</p>
			<p>
				<span className='task-label'>Difficulty:</span>
				{task.difficulty}
			</p>
			<div
				style={{
					display: 'flex',
					width: 100 + '%',
					justifyContent: 'center',
				}}></div>
		</div>
	);
}