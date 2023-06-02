import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

function Column({ status, children }) {
	return (
		<Droppable droppableId={status}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.droppableProps}
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
