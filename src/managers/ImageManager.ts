const Jimp = require('jimp');

export default class ImageManager {

    counter : number = 0;
    chunks : FrequencyChunk[][];
    divisions : {x: number, y: number} = {x: 0, y: 0};
    dimensions : {x: number, y: number} = {x: 0, y: 0};
    sideLengths : {x: number, y: number} = {x: 0, y: 0};

    // Convert RGB to a light frequency
    private getFrequency(r: number, g: number, b: number) : number {
        // Change to 0-1 scale
        r /= 255;
        g /= 255;
        b /= 255;

        // First convert RGB to hue (http://www.javascripter.net/faq/rgb2hsv.htm)
        let minRGB = Math.min(r, Math.min(g, b));
        let maxRGB = Math.max(r, Math.max(g, b));
        let hue = 0;

        if(minRGB != maxRGB){
            let d = (r == minRGB) ? g - b : ((b == minRGB) ? r - g : b - r );
            let h = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5 );
            hue = 60*(h - d/(maxRGB - minRGB));
        }

        let l =  620 - 170 / 270 * hue;
        let c = 2.99792458;

        // f = c/l, but f*10^-17, multiply by 10^5 to get THZ
        return c / l;
    }

    assignToChunk(freq: number, x: number, y: number){
        let i = Math.floor(x / this.divisions.x);
        let j = Math.floor(y / this.divisions.y);

        this.chunks[j][i].avg = (this.chunks[j][i].avg * this.chunks[j][i].length + freq) / (this.chunks[j][i].length + 1);
        this.chunks[j][i].length++;
    }

    processPixels(image){
        for(let x = 0; x < this.dimensions.x; x++){
            for(let y = 0; y < this.dimensions.y; y++){
                // Get RGB triplet
                let {r, g, b} = Jimp.intToRGBA(image.getPixelColor(x, y));
                let freq = this.getFrequency(r, g, b);

                // Put the frequency in a frequency subdivision, where it will be averaged
                this.assignToChunk(freq, x, y);
            }
        }
    }

    constructor(sideChunksX: number, sideChunksY: number, height: number, width: number){
        this.chunks = [];

        for(let i = 0; i < sideChunksY; i++){
            this.chunks.push([]);

            for(let k = 0; k < sideChunksX; k++){
                this.chunks[i].push({length: 0, avg: 0});
            }
        }
        this.sideLengths.x = sideChunksX;
        this.sideLengths.y = sideChunksY;
        this.divisions.x = width/this.sideLengths.x;
        this.divisions.y = height/this.sideLengths.y;

        this.dimensions = {x: width, y: height};
    }
}

type FrequencyChunk = {avg: number, length: number};
