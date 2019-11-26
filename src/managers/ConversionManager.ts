// Generally handles the conversion from image data to an audio file

let Jimp = require('jimp2');
import ImageManager from './ImageManager';

export default class ConversionManager {

    filename : string;

    // Process the image in chunks to prevent heap overflows
    async convert(height: number, width: number, sideChunksX: number, sideChunksY: number){
        let imageProcessor = new ImageManager(sideChunksX, sideChunksY, height, width);
        let image = await Jimp.read(this.filename);
        imageProcessor.processPixels(image);

        console.log(imageProcessor.chunks);
    }

    constructor(filename: string){
        this.filename = filename;
    }

}
