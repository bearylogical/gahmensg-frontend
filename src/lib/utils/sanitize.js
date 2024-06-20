function replaceSpacesWithUnderscores(str) {
	return str.replace(/ /g, '_');
}

export function replaceWhiteSpacesForQuery(str) {
	return str.replace(/\s+/g, '%20');
}