import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Clear } from "./components/svg/clear";
import { Loading } from "./components/svg/loading";

const { sharp, dialog } = window;

export const App = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [directoryPath, setDirectoryPath] = useState<string>("");

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null || isConverting) return;
    setFiles([...files, ...e.target.files]);
  };

  const onChoiceFileButtonClick = () => {
    if (inputRef.current == null || isConverting) return;
    inputRef.current.click();
  };

  const onConvertButtonClick = async () => {
    if (files.length == 0 || isConverting) return;
    setIsConverting(true);
    const errors = await sharp.convert(files, directoryPath);
    errors.length == 0
      ? alert("変換が完了しました")
      : alert("変換に失敗しました\n\n" + errors.join("\n\n"));
    setIsConverting(false);
  };

  const onClearButtonClick = () => {
    if (isConverting) return;
    setFiles([]);
  };

  const onChoiceDirectoryButtonClick = async () => {
    const directoryPath = await dialog.openDirectory();
    if (typeof directoryPath === "string") {
      setDirectoryPath(directoryPath);
    }
  };

  const onDirectoryPathClearButtonClick = () => {
    setDirectoryPath("");
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles == null || isConverting) return;
    setFiles([...files, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-4 flex justify-between">
        <button
          type="button"
          className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
          onClick={onChoiceFileButtonClick}
        >
          画像を選択
        </button>
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={onFileInputChange}
          ref={inputRef}
        />
        <button
          type="button"
          className="py-2 px-4 hover:bg-gray-800 focus:ring-gray-700 focus:ring-offset-gray-700 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
          onClick={onClearButtonClick}
        >
          クリア
        </button>
      </div>

      <div
        {...getRootProps()}
        className="h-96 bg-gray-800 text-gray-400 overflow-scroll cursor-default whitespace-nowrap"
      >
        <input {...getInputProps()} />
        {files.length == 0 && (
          <span className="block pt-44 text-center">
            画像ファイルをドロップして追加
          </span>
        )}
        <table>
          <tbody>
            {files.map((file) => (
              <tr>
                <td className="px-2 py-0.5 text-sm">{file.path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 overflow-scroll whitespace-nowrap max-w-full">
        <button
          type="button"
          className="py-2 px-4 bg-gray-700 hover:bg-gray-800 focus:ring-gray-700 focus:ring-offset-gray-700 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
          onClick={onChoiceDirectoryButtonClick}
        >
          保存先フォルダを選択
        </button>
        <div className="inline ml-4 text-gray-400">
          {directoryPath == "" ? (
            <span>元ファイルと同じフォルダに保存</span>
          ) : (
            <>
              <span>{directoryPath}</span>
              <button
                type="button"
                className="w-5 h-5 ml-2 text-base rounded-full text-white bg-gray-600"
                onClick={onDirectoryPathClearButtonClick}
              >
                <Clear />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="pb-4 text-center">
        {isConverting ? (
          <button
            type="button"
            disabled
            className="py-2 px-4 bg-green-600 transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-full cursor-not-allowed"
          >
            <Loading />
          </button>
        ) : (
          <button
            type="button"
            className="py-2 px-4 bg-green-500 hover:bg-green-600 focus:ring-green-500 focus:ring-offset-green-500 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
            onClick={onConvertButtonClick}
          >
            変換
          </button>
        )}
      </div>
    </div>
  );
};
