export const cookiesHandler = {
	setUsernameAndPasswordToCookies: ({
		username,
		password
	}) => {
		localStorage.setItem(`supressorPassword`, password);
		localStorage.setItem(`supressorUsername`, username);
	},
	getUsernameAndPasswordFromCookies: () => (
		{
			username: localStorage.getItem(`supressorUsername`),
			password: localStorage.getItem(`supressorPassword`)
			
	
		}
	),
	clearCookies: () => {
		localStorage.removeItem(`supressorUsername`);
		localStorage.removeItem(`supressorPassword`);
	}

};

export const convertDate = date => {
	return new Date(date).toLocaleDateString('ru-RU', {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	});	
};

