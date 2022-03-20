import { contextBridge, ipcRenderer, dialog } from 'electron';

const sharp = require("sharp");

const convert = async (files: File[], directoryPath: string) => {
  let errors: string[] = [];

  const results = files.map((file) => {
    const filePath = file.path;
    const extension = filePath.split('.').pop();

    let newFilePath = directoryPath == "" ? 
      filePath.replace(new RegExp(`\.${extension}$`), ".jpg") : 
      `${directoryPath}/${file.name.replace(new RegExp(`\.${extension}$`), ".jpg")}`;

    return sharp(filePath)
      .jpeg()
      .toFile(newFilePath)
      .catch ((err: any) => {
        errors.push(`${filePath}\n${err}`);
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