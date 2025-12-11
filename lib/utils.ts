import path from 'path';

export const getRespectiveFilePath = (fileName: string) => {
    return path.join(process.cwd(), 'data', `${fileName}.json`);
};