const Generator = require('audio-generator/stream');
import * as wavConverter from 'wav-converter';
import * as fs from 'fs';
import * as shortId from 'shortid';
import { writeFile, unlink } from '../util/promises';

export default class AudioManager {

    chunks : FrequencyChunk[];
    lengthPerChunk : number;

    getFrequency(t: number) : number {
        // Find the image chunk frequency to play at this point in time
        let k = Math.floor(t / this.lengthPerChunk);
        return this.chunks[k].avg;
    }

    generateAudio(cb: (string, number) => void){
        let partialPath = '/img/uploads/' + shortId.generate();
        let saveTo = __dirname + '../../../public' + partialPath;
        let pcmPath = saveTo + '.pcm';
        let duration = this.chunks.length * this.lengthPerChunk;

        // Generation pcm audio file
        let gen = Generator(
            // Create a sine wave to play a sound over time with a varying frequency, 0.182 is because frequencies are off by a factor of 0.182
            t =>  Math.sin(Math.PI * 2 / 0.182 * this.getFrequency(t) * t),
            {duration}
        ).on('error', e => {
            console.log(e);
        }).on('end', async () => {
            let pcmData = fs.readFileSync(pcmPath);
            let wavData = wavConverter.encodeWav(pcmData, {
                numChannels: 1,
                sampleRate: 16000,
                byteRate: 16
            });
            let wavPath = saveTo + '.wav';

            await writeFile(wavPath, wavData);
            await unlink(pcmPath);

            cb(partialPath + '.wav', duration / 0.182);
        }).pipe(fs.createWriteStream(pcmPath));
    }

    constructor(lengthPerChunk: number, chunks: FrequencyChunk[][], transformFunc: (f: number) => number){
        // As with frequency, duration is off by a factor of 0.182
        this.lengthPerChunk = lengthPerChunk * 0.182;

        let newChunks : FrequencyChunk[] = [];

        // Convert chunk matrix to array
        for(let i = 0; i < chunks.length; i++){
            for(let j = 0; j < chunks[i].length; j++){
                newChunks.push(chunks[i][j]);
            }
        }

        // Multiply chunk avg frequency by 10^5 to get THZ, apply custom frequency to sound wave transformation function
        newChunks.map(c => {c.avg = transformFunc(c.avg * Math.pow(10, 5))});
        this.chunks = newChunks;
    }
}

type FrequencyChunk = {avg: number, length: number};
