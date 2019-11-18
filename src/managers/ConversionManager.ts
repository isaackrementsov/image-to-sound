import {FileStream} from 'busboy';

export default class ConversionManager {

    file : FileStream;
    filename : string;

    convert = () => {

    }

    constructor(file, filename){
        this.file = file;
        this.filename = filename;
    }

}
