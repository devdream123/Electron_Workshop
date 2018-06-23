import React from 'react';

const Board = (props) => (
	<div className="Board">
		<textarea cols={20} rows={20} value={JSON.stringify(props.data)} />
	</div>
);

export default Board;