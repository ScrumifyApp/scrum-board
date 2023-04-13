import React from 'react';
import { useContext } from 'react';
import { dragContext } from './MainContainer';

export default function Story({ story }) {
	const { getData } = useContext(dragContext);
	// MAKE DELTE REQUEST TO DELETE STORY
	function deleteStory(id) {
		console.log('sending deleteStory from Story.jsx');
		fetch(`/api/story/${id}`, {
			method: 'DELETE',
		})
			.then(() => {
				getData();
			})
			.catch((err) => {
				console.log({ err: `Error deleting story: ${err}` });
			});
	}

	// const classes = `story ${story.color}`;
	const classes = 'story';
	const styles = { backgroundColor: story.color };

	//<div className={classes} style={styles}>
	return (
		<div className={classes} style={styles}>
			<button
				type='button'
				onClick={() => deleteStory(story.id)}
				className='delete div-delete'>
				x
			</button>
			<p>{story.description}</p>
		</div>
	);
}
