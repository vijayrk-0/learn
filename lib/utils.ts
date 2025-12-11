import path from 'path';
import { promises as fs } from 'fs';

// Get file path
export const getRespectiveFilePath = (fileName: string) => {
    return path.join(process.cwd(), 'data', `${fileName}.json`);
};

// Read from file function  
export async function readFile(dataFile: string): Promise<any> {
    const raw = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(raw);
}

// Write to file function
export async function writeFile(data: any, dataFile: string) {
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf-8");
}