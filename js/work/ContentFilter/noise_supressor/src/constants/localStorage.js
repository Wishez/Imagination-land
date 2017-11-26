export const setData = (name, value) => {
	localStorage[name] = JSON.stringify(value);
}

export const getData  = name => localStorage[name];

