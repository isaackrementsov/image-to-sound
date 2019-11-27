// Generally handles the conversion from image data to an audio file

const Jimp = require('jimp');
import ImageManager from './ImageManager';
import AudioManager from './AudioManager';

export default class ConversionManager {

    filename : string;

    // Process the image in chunks to prevent heap overflows
    async convert(height: number, width: number, sideChunksX: number, sideChunksY: number, lengthPerChunk: number, transformFunction: string, cb: (string, number) => void){
        let imageProcessor = new ImageManager(sideChunksX, sideChunksY, height, width);
        let image = await Jimp.read(this.filename);

        await imageProcessor.processPixels(image, this.filename);

        let transformFunc = f => eval(transformFunction);
        let audioProcessor = new AudioManager(lengthPerChunk, imageProcessor.chunks, transformFunc);

        audioProcessor.generateAudio(cb);
    }

    constructor(filename: string){
        this.filename = filename;
    }

}
