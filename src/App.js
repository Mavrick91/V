import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import { createWorker } from 'tesseract.js';
import './index.css';

const imagesTypes = ['jpeg', 'png', 'svg', 'gif'];

function App() {
  const [imageBase64, setImageBase64] = useState();
  const [fileLoaded, setFileLoaded] = useState();
  const [dataImage, setDataImage] = useState();
  const [imageModifiedLoading, setImageModifiedLoading] = useState(true);
  const [finalImage, setFinalImage] = useState();

  useEffect(() => {
    function dragOverFn(event) {
      event.preventDefault();

      dropZoon.classList.add('drop-zoon--over');
    }

    const dropZoon = document.querySelector('#dropZoon');

    if (dropZoon) dropZoon.addEventListener('dragover', dragOverFn);
    return () => {
      dropZoon.removeEventListener('dragover', dragOverFn);
    };
  }, []);

  useEffect(() => {
    function dragLeaveFn() {
      dropZoon.classList.remove('drop-zoon--over');
    }

    const dropZoon = document.querySelector('#dropZoon');

    dropZoon.addEventListener('dragleave', dragLeaveFn);
    return () => {
      dropZoon.removeEventListener('dragleave', dragLeaveFn);
    };
  }, []);

  const fileValidate = useCallback((fileType, fileSize) => {
    const uploadedFileIconText = document.querySelector('.uploaded-file__icon-text');
    let isImage = imagesTypes.filter((type) => fileType.indexOf(`image/${type}`) !== -1);

    if (isImage[0] === 'jpeg') {
      uploadedFileIconText.innerHTML = 'jpg';
    } else {
      // else
      uploadedFileIconText.innerHTML = isImage[0];
    }

    if (isImage.length !== 0) {
      if (fileSize <= 2000000) {
        // 2MB :)
        return true;
      } else {
        return alert('Please Your File Should be 2 Megabytes or Less');
      }
    } else {
      return alert('Please make sure to upload An Image File Type');
    }
  }, []);

  // const progressMove = useCallback(() => {
  //   const uploadedFileCounter = document.querySelector('.uploaded-file__counter');
  //   setTimeout(() => {
  //     let counterIncrease = setInterval(() => {
  //       if (progressImageModifed * 100 === 100) {
  //         clearInterval(counterIncrease);
  //       } else {
  //         uploadedFileCounter.innerHTML = `${progressImageModifed * 100}%`;
  //       }
  //     }, 100);
  //   }, 600);
  // }, [progressImageModifed]);

  const uploadFile = useCallback(
    (file) => {
      const fileReader = new FileReader();
      const fileType = file.type;
      const fileSize = file.size;
      const dropZoon = document.querySelector('#dropZoon');
      const loadingText = document.querySelector('#loadingText');
      const previewImage = document.querySelector('#previewImage');
      const uploadedFile = document.querySelector('#uploadedFile');
      const uploadedFileInfo = document.querySelector('#uploadedFileInfo');
      const uploadArea = document.querySelector('#uploadArea');
      const fileDetails = document.querySelector('#fileDetails');
      const uploadedFileName = document.querySelector('.uploaded-file__name');

      if (fileValidate(fileType, fileSize)) {
        dropZoon.classList.add('drop-zoon--Uploaded');
        loadingText.style.display = 'block';
        previewImage.style.display = 'none';

        uploadedFile.classList.remove('uploaded-file--open');
        uploadedFileInfo.classList.remove('uploaded-file__info--active');

        fileReader.addEventListener('load', function () {
          setTimeout(function () {
            uploadArea.classList.add('upload-area--open');

            loadingText.style.display = 'none';
            previewImage.style.display = 'block';

            fileDetails.classList.add('file-details--open');
            uploadedFile.classList.add('uploaded-file--open');
            uploadedFileInfo.classList.add('uploaded-file__info--active');
          }, 500); // 0.5s

          previewImage.setAttribute('src', fileReader.result);

          uploadedFileName.innerHTML = file.name;

          setImageBase64(fileReader.result);
          setFileLoaded(file);
          // progressMove();
        });

        fileReader.readAsDataURL(file);
      }
    },
    [fileValidate],
  );

  useEffect(() => {
    function dropFn(event) {
      event.preventDefault();

      dropZoon.classList.remove('drop-zoon--over');

      const file = event.dataTransfer.files[0];

      uploadFile(file);
    }

    const dropZoon = document.querySelector('#dropZoon');

    dropZoon.addEventListener('drop', dropFn);
    return () => {
      dropZoon.removeEventListener('drop', dropFn);
    };
  }, [uploadFile]);

  useEffect(() => {
    function clickFn() {
      const fileInput = document.querySelector('#fileInput');
      fileInput.click();
    }

    const dropZoon = document.querySelector('#dropZoon');

    dropZoon.addEventListener('click', clickFn);
    return () => dropZoon.removeEventListener('click', clickFn);
  }, []);

  useEffect(() => {
    function changeFn(event) {
      const file = event.target.files[0];

      uploadFile(file);
    }

    const fileInput = document.querySelector('#fileInput');

    fileInput.addEventListener('change', changeFn);
    return () => {
      fileInput.removeEventListener('change', changeFn);
    };
  }, [uploadFile]);

  useEffect(() => {
    if (fileLoaded && dataImage) {
      const numberOccupied = dataImage.lines[4].words[2].text;
      const canvas = document.getElementById('viewport');
      const context = canvas.getContext('2d');
      const img = new Image();
      const f = fileLoaded;
      const url = window.URL || window.webkitURL;
      img.src = url.createObjectURL(f);

      createImageBitmap(fileLoaded).then((imageBitmap) => {
        const hours1 = moment().format('HH:mm');
        const hours2 = moment().format('HH.mm');
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
        context.font = '24px sans-serif';
        context.fillText('mavrick jean raymond duchamp', 212, 853);

        context.beginPath();
        context.fillStyle = 'white';
        context.fillRect(480, 725, 100, 50);
        context.stroke();

        context.fillStyle = '#181818';
        context.font = '27px sans-serif';
        context.fillText(hours1, 491, 760);

        context.beginPath();
        context.fillStyle = 'white';
        context.fillRect(34, 20, 80, 50);
        context.stroke();

        context.fillStyle = '#0D0D0D';
        context.font = '28px sans-serif';
        context.fillText(hours2, 45, 54);

        context.fillStyle = '#3F3F3F';
        context.font = '27px sans-serif';
        context.fillText(`${Number.parseInt(numberOccupied) + 1}`, 418, 697);

        setImageModifiedLoading(false);
      });
    }
  }, [fileLoaded, dataImage]);

  const worker = useMemo(() => {
    return createWorker({
      logger(m) {
        return console.log(m);
      },
    });
  }, []);

  const doOCR = useCallback(async () => {
    try {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data } = await worker.recognize(imageBase64);
      setDataImage(data);
    } catch (e) {
      console.log(`BOX e`, e.message);
    }
  }, [imageBase64, worker]);

  useEffect(() => {
    if (imageBase64) {
      doOCR();
    }
  }, [doOCR, imageBase64]);

  useEffect(() => {
    if (!imageModifiedLoading) {
      const canvas = document.getElementById('viewport');
      const img = canvas.toDataURL('image/png');
      setFinalImage(img);
    }
  }, [imageModifiedLoading]);

  return (
    <div>
      {imageModifiedLoading ? (
        <div id="uploadArea" className="upload-area">
          <div className="upload-area__header">
            <h1 className="upload-area__title">Upload your file</h1>
            <p className="upload-area__paragraph">File should be an image</p>
          </div>

          <div id="dropZoon" className="upload-area__drop-zoon drop-zoon">
            <span className="drop-zoon__icon">
              <i className="bx bxs-file-image" />
            </span>
            <p className="drop-zoon__paragraph">Drop your file here or Click to browse</p>
            <span id="loadingText" className="drop-zoon__loading-text">
              Please Wait
            </span>
            <img src="" alt="" id="previewImage" className="drop-zoon__preview-image" draggable="false" />
            <input type="file" id="fileInput" className="drop-zoon__file-input" accept="image/*" />
          </div>
          <div id="fileDetails" className="upload-area__file-details file-details">
            <h3 className="file-details__title">Uploaded File</h3>

            <div id="uploadedFile" className="uploaded-file">
              <div className="uploaded-file__icon-container">
                <i className="bx bxs-file-blank uploaded-file__icon" />
                <span className="uploaded-file__icon-text" />
              </div>

              <div id="uploadedFileInfo" className="uploaded-file__info">
                <span className="uploaded-file__name">Proejct 1</span>
                <span className="uploaded-file__counter">
                  <ClipLoader color={'fff'} loading={imageModifiedLoading} size={15} />
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="uploadArea" className="upload-area" style={{ display: 'flex', flexDirection: 'column' }}>
          <img src={finalImage} alt={''} />
          <button className={'button-retry'} onClick={() => window.location.reload()}>
            retry
          </button>
        </div>
      )}

      <canvas id="viewport" height={'1600'} width={'739'} />
    </div>
  );
}

export default App;
