import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

function Column({ id, children }) {
	return (
		<Droppable droppableId='id'>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.droppableProps}
					id={id}
					className='column'>
					<h3>In Progress</h3>
					<hr />
					{children}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);
}

export default Column;
