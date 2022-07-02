import {useCallback, useEffect, useState} from "react"
import {createWorker} from 'tesseract.js';
import './index.css'

function App() {
	const [imageBase64, setImageBase64] = useState()
	const [fileLoaded, setFileLoaded] = useState()
	const [dataImage, setDataImage] = useState();

	useEffect(() => {
		if (fileLoaded && dataImage) {
			const numberOccupied = dataImage.lines[4].words[2].text
			const canvas = document.getElementById('viewport');
			const context = canvas.getContext('2d');
			const img = new Image()
			const f = fileLoaded
			const url = window.URL || window.webkitURL
			img.src = url.createObjectURL(f);

			createImageBitmap(fileLoaded).then(imageBitmap => {
				const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
				context.drawImage(imageBitmap, 0, 0, img.width * scale, img.height * scale);
				context.beginPath();
				context.fillStyle = '#08944F';
				context.fillRect(170, 820, 350, 50);
				context.stroke();

				context.beginPath();
				context.fillStyle = 'white';
				context.fillRect(414, 667, 50, 40);
				context.stroke();

				context.fillStyle = 'white';
				context.font = "24px sans-serif";
				context.fillText('mavrick jean raymond duchamp', 212, 853);

				context.fillStyle = '#3F3F3F';
				context.font = "27px sans-serif";
				context.fillText(`${Number.parseInt(numberOccupied) + 1}`, 418, 697);
			})

		}
	}, [fileLoaded, dataImage])

	const worker = createWorker();

	const doOCR = useCallback(async () => {
		try {
			await worker.load();
			await worker.loadLanguage('eng');
			await worker.initialize('eng');
			const {data} = await worker.recognize(imageBase64);
			setDataImage(data);
		} catch (e) {
			console.log(`BOX e`, e.message);
		}
	}, [imageBase64, worker])

	useEffect(() => {
		if (imageBase64) {
			doOCR();
		}
	}, [imageBase64, doOCR]);

	const handleChange = event => {
		const file = event.target.files[0];


		const reader = new FileReader();
		reader.onloadend = function () {
			setImageBase64(reader.result);
			setFileLoaded(file)
		}
		reader.readAsDataURL(file);
	};

	const handleDownload = useCallback(() => {
		const canvas = document.getElementById("viewport");
		const img = canvas.toDataURL("image/png");
		document.write('<img src="' + img + '"/>');
	}, [])

	return (
		<div style={{display: 'flex', flexDirection: 'column'}}>
			<div>
				<input type="file" id="myFile" name="filename" onChange={handleChange}/>
				<button onClick={handleDownload}>Download</button>
			</div>
			<canvas id="viewport" height={'1600'} width={'739'}/>

		</div>
	);
}

export default App;
