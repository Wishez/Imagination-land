import React from 'react';

const Loader = ({
	size,
	topPosition,
	color,
	className
}) => {
	const style = {
		backgroundColor: color ? color : '#f4f4f4'

	};
	return ( 
		<div className={`sk-cube-grid ${className}`} style={{
			top: topPosition
		}}>
			<div className="sk-cube sk-cube1" style={style} />
			<div className="sk-cube sk-cube2" style={style} />
			<div className="sk-cube sk-cube3" style={style} />
			<div className="sk-cube sk-cube4" style={style} />
			<div className="sk-cube sk-cube5" style={style} />
			<div className="sk-cube sk-cube6" style={style} />
			<div className="sk-cube sk-cube7" style={style} />
			<div className="sk-cube sk-cube8" style={style} />
			<div className="sk-cube sk-cube9" style={style} />
		</div>
	);
};

export default Loader;