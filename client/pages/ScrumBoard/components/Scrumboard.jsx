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
			<Column status='backlog'>
				{tasks?.backlog?.map((task, index) => {
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
			<Column status='todo'>
				{tasks?.todo?.map((task, index) => {
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

			<Column status='inProgress'>
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

			<Column status='toVerify'>
				{tasks?.toVerify?.map((task, index) => {
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
			<Column status='done'>
				{tasks?.done?.map((task, index) => {
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
		</div>
	);
}
