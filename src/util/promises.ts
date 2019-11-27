import { promisify } from 'util';
import * as fs from 'fs';

export const unlink = promisify(fs.unlink);
export const writeFile = promisify(fs.writeFile);
