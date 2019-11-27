let height;
let width;
let validFunc = false;
let chunksX = document.getElementById('numberChunksX');
let chunksY = document.getElementById('numberChunksY');

try {
    parseFunction();
}catch(e){ }

function recordDimensions(){
    let input = document.getElementById('file');

    if(input.files && input.files[0]){
        let image = new Image();

        image.src = window.URL.createObjectURL(input.files[0]);

        let preview = document.getElementById('preview');
        preview.style.display = 'block';
        preview.style.backgroundImage = `url('${image.src}')`;

        image.onload = () => {
            height = image.naturalHeight;
            width = image.naturalWidth;

            document.getElementById('width').value = image.naturalWidth;
            document.getElementById('width-info').innerHTML = image.naturalWidth;

            document.getElementById('height').value = image.naturalHeight;
            document.getElementById('height-info').innerHTML = image.naturalHeight;

            preview.style.width = `${image.naturalWidth * 200 / image.naturalHeight}px`;

            if(chunksX.value && chunksY.value){
                drawGrid();
            }
        }
    }
}

function drawGrid(){
    if(height && width && chunksX.value && chunksY.value){
        let preview = document.getElementById('preview');
        let ctx = preview.getContext('2d');
        ctx.clearRect(0, 0, preview.width, preview.height);
        ctx.beginPath();
        ctx.strokeStyle = 'white';

        let yChunkSize = preview.height / chunksY.value;
        let xChunkSize = preview.width / chunksX.value;

        for(let i = 0; i < chunksX.value + 1; i++){
            let posX = xChunkSize * i;

            ctx.moveTo(posX, 0);
            ctx.lineTo(posX, preview.height);
            ctx.stroke();
        }

        for(let i = 0; i < chunksY.value + 1; i++){
            let posY = yChunkSize * i;

            ctx.moveTo(0, posY);
            ctx.lineTo(preview.width, posY);
            ctx.stroke();
        }
    }
}

function parseFunction(){
    let statement = document.getElementById('mappingFunction').value;

    statement = statement.replace(' ','');
    statement = statement.replace(/([1-9]|[a-z])\^([1-9]|[a-z])/g, p => `Math.pow(${p[0]}, ${p[2]})`);
    statement = statement.replace(/log|cos|sin|tan/gi, f => `Math.${f}`);
    statement = statement.replace(/e|pi/gi, k => `Math.${k.toUpperCase()}`);
    validFunc = true;

    try {
        let func = f => eval(statement);
        func(1);
    }catch(e){
        validFunc = false;
        document.getElementById('mappingFunction').style.borderColor = 'coral';
    }

    if(validFunc){
        document.getElementById('mappingFunction').style.borderColor = 'initial';
    }

    document.getElementById('mappingFunctionParsed').value = statement;
}

function validateFunc(){
    document.getElementById('form').display = 'none';
    document.getElementById('loading').display = 'block';

    return validFunc;
}
