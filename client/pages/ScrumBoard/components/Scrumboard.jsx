import React, { useContext } from 'react';
import Story from './Story';
import Task from './Task';
import { dragContext } from '../../../context';
import Column from './Column';

export default function Scrumboard({ stories, tasks }) {
	// TASKS BY STATUS
	const { handleDrop } = useContext(dragContext);
	const colorCode = {};

	stories?.forEach((story) => {
		colorCode[story.id] = story.color;
	});

	// RENDER SCRUMBOARD
	return (
		<div className='scrumboard'>
			<div
				id='backlog'
				className='column'
				onDrop={handleDrop}
				onDragOver={(e) => e.preventDefault()}>
				<h3>Backlog</h3>
				<hr />
				{/* {tasks?.backlog?.map((task) => {
					return (
						<Task
							key={task.id}
							task={task}
							id={task.task_id}
							color={colorCode[task.story_id]}
						/>
					);
				})} */}
			</div>
			<div
				id='stories'
				className='column'
				onDrop={handleDrop}
				onDragOver={(e) => e.preventDefault()}>
				<h3>Stories</h3>
				<hr />
				{stories.map((story) => {
					return <Story key={story.id} story={story} />;
				})}
			</div>
			<div
				id='todo'
				className='column'
				onDrop={handleDrop}
				onDragOver={(e) => e.preventDefault()}>
				<h3>To Do</h3>
				<hr />
				{/* {tasks?.inProgress?.map((task, index) => {
					return (
						<Task
							key={task.id}
							task={task}
							id={task.task_id}
							color={colorCode[task.story_id]}
							index={index}
						/>
					);
				})} */}
			</div>

			<Column>
				{tasks?.inProgress?.map((task, index) => {
					return (
						<Task
							key={task.id}
							task={task}
							id={task.task_id}
							color={colorCode[task.story_id]}
							index={index}
						/>
					);
				})}
			</Column>

			<div
				id='toVerify'
				className='column'
				onDrop={handleDrop}
				onDragOver={(e) => e.preventDefault()}>
				<h3>To Verify</h3>
				<hr />
				{/* {tasks?.toVerify?.map((task) => {
					return (
						<Task
							key={task.id}
							task={task}
							id={task.task_id}
							color={colorCode[task.story_id]}
						/>
					);
				})} */}
			</div>
			<div
				id='done'
				className='column'
				onDrop={handleDrop}
				onDragOver={(e) => e.preventDefault()}>
				<h3>Done</h3>
				<hr />
				{/* {tasks?.done?.map((task) => {
					return (
						<Task
							key={task.id}
							task={task}
							id={task.task_id}
							color={colorCode[task.story_id]}
						/>
					);
				})} */}
			</div>
		</div>
	);
}
