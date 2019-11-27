// Generally handles the conversion from image data to an audio file

const Jimp = require('jimp');
import ImageManager from './ImageManager';
import AudioManager from './AudioManager';

export default class ConversionManager {

    filename : string;

    // Process the image in chunks to prevent heap overflows
    async convert(height: number, width: number, sideChunksX: number, sideChunksY: number, lengthPerChunk: number, transformFunction: string){
        let imageProcessor = new ImageManager(sideChunksX, sideChunksY, height, width);
        let image = await Jimp.read(this.filename);
        imageProcessor.processPixels(image);

        let transformFunc = f => eval(transformFunction);
        let audioProcessor = new AudioManager(lengthPerChunk, imageProcessor.chunks, transformFunc);
        audioProcessor.playAudio();
    }

    constructor(filename: string){
        this.filename = filename;
    }

}
