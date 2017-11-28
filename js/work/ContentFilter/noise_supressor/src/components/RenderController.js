import React from 'react';

const RenderController = ({
	input,
	meta: {
		touched,
		error,
		warning
	},
	block,
	label,
	...rest
}) => (
	<div className={block}>
		{label ? 
			<label className={`${block}__label`}>{label}</label> : 
			''
		}
		<input {...input}
			{...rest}
			className={`${block}__input`} />
		 {touched && 
		 	((error && 
		 		<span className={`${block}__error formError`}>{error}</span>) || 
		 		(warning && <span className={`${block}__error formError`}>{warning}</span>))}
	</div>
);

export default RenderController;