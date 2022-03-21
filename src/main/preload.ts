import { contextBridge, ipcRenderer } from 'electron';
import path from 'path';
import sharp from 'sharp';

const convert = async (files: File[], directoryPath: string) => {
  let errors: string[] = [];

  const results = files.map((file) => {
    const inputPath = file.path;
    const inputFile = path.parse(inputPath);
    const outputPath = directoryPath == "" ? path.join(inputFile.dir, `${inputFile.name}.jpg`) : path.join(directoryPath, `${inputFile.name}.jpg`);

    return sharp(inputPath)
      .jpeg()
      .toFile(outputPath)
      .catch ((err: any) => {
        errors.push(`[${inputPath}] ${err}`);
      });
  });
  await Promise.all(results);

  return errors;
};

contextBridge.exposeInMainWorld('sharp', {
  convert : (files: File[], directoryPath: string) => convert(files, directoryPath),
});

contextBridge.exposeInMainWorld('dialog', {
  openDirectory: () => ipcRenderer.invoke('open-directory'),
});