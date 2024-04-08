//create a function to export a svg to a png file
export const exportSvg = (svg, filename) => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	const data = new XMLSerializer().serializeToString(svg);
	const DOMURL = window.URL || window.webkitURL || window;
	const img = new Image();
	const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
	const url = DOMURL.createObjectURL(svgBlob);
	img.onload = () => {
		context.drawImage(img, 0, 0);
		DOMURL.revokeObjectURL(url);
		const imgURI = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
		const evt = new MouseEvent('click', {
			view: window,
			bubbles: false,
			cancelable: true
		});
		const a = document.createElement('a');
		a.setAttribute('download', `${filename}.png`);
		a.setAttribute('href', imgURI);
		a.setAttribute('target', '_blank');
		a.dispatchEvent(evt);
	};
	img.src = url;
};

export const getDateTimeString = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const day = now.getDate().toString().padStart(2, '0');
	const hours = now.getHours().toString().padStart(2, '0');
	const minutes = now.getMinutes().toString().padStart(2, '0');
	const seconds = now.getSeconds().toString().padStart(2, '0');

	return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
};
