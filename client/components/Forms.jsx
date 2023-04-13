import { useContext, useState } from 'react';
import React from 'react';
import { dragContext } from './MainContainer';

export default function Forms({ storyList }) {
	const [taskDesc, setTaskDesc] = useState('');
	const [taskOwner, setTaskOwner] = useState('');
	const [taskDiff, setTaskDiff] = useState('');
	const [taskColor, setTaskColor] = useState('');
	const [storyDesc, setStoryDesc] = useState('');
	const [storyColor, setStoryColor] = useState('');
	const { getData } = useContext(dragContext);

	function addTask(event) {
		event.preventDefault();
		fetch('/api/task', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				taskDesc,
				taskOwner,
				taskDiff,
				taskColor,
				status: 'to-do',
			}),
		})
			.then(() => {
				setTaskDesc('');
				setTaskOwner('');
				setTaskDiff('');
				setTaskColor('');
				document.querySelector('#add-task').reset();
				getData();
			})
			.catch((err) => {
				console.log({ err: `Error adding task: ${err}` });
			});
	}

	function addStory(event) {
		event.preventDefault();
		fetch('/api/story', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				storyDesc,
				storyColor,
			}),
		})
			.then(() => {
				setStoryColor('');
				setStoryDesc('');
				document.querySelector('#add-story').reset();
				getData();
			})
			.catch((err) => {
				console.log({ err: `Error adding story: ${err}` });
			});
	}

	// ARRAY OF STORY DESCRIPTIONS
	const descArr = [];
	// iterate through storyList
	for (const story of storyList) {
		const shortDescription = story.description.slice(0, 20);
		const optionKey = `desc${story.id}`;
		descArr.push(
			<option key={optionKey} value={story.id}>
				{shortDescription}
			</option>
		);
	}

	return (
		<div className='forms'>
			<form id='add-story' onSubmit={addStory}>
				<h3>New Story</h3>
				<label htmlFor='story-desc'>Description</label>
				<textarea
					id='story-desc'
					name='story-desc'
					onChange={(e) => setStoryDesc(e.target.value)}></textarea>
				<select onChange={(e) => setStoryColor(e.target.value)}>
					<option value='' hidden>
						Choose Color
					</option>
					{/* these values should correspond to story_id in database */}
					<option value='#ed7ec8'>Thistle</option>
					<option value='#708c6c'>Zomp</option>
					<option value='#a7cff2'>Uranian Blue</option>
					<option value='#e8b168'>Atomic Tangerine</option>
					<option value='#4287f5'>Cool Blue</option>
					<option value='#dbabc6'>Pink</option>
					<option value='#d96e62'>Dry Rose</option>
					<option value='#b991db'>Lilac</option>
					<option value='gray'>Gray</option>
				</select>
				<input id='submit-story' type='submit' value='Add Story' />
			</form>

			<form id='add-task' onSubmit={addTask}>
				<h3>New Task</h3>
				<label htmlFor='task-desc'>Description</label>
				<textarea
					id='task-desc'
					name='task-desc'
					onChange={(e) => setTaskDesc(e.target.value)}></textarea>
				<select onChange={(e) => setTaskColor(e.target.value)}>
					<option value='' hidden>
						Choose Story
					</option>
					{descArr}
				</select>
				<label htmlFor='task-owner'>Task Owner</label>
				<input
					id='task-owner'
					name='task-owner'
					type='text'
					onChange={(e) => setTaskOwner(e.target.value)}></input>
				<label htmlFor='task-diff'>Difficulty</label>
				<input
					id='task-diff'
					name='task-diff'
					type='number'
					min='1'
					max='5'
					onChange={(e) => setTaskDiff(e.target.value)}></input>
				<input type='submit' value='Add Task' id='submit-task' />
			</form>
		</div>
	);
}
