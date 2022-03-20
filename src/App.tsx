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
  const [errors, setErrors] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

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
    setShowModal(true);
    setIsConverting(true);
    const convertErrors = await sharp.convert(files, directoryPath);
    setIsConverting(false);
    setErrors(convertErrors);
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
        <button
          type="button"
          className="py-2 px-4 bg-green-500 hover:bg-green-600 focus:ring-green-500 focus:ring-offset-green-500 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
          onClick={onConvertButtonClick}
        >
          変換
        </button>
      </div>

      {showModal && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-10/12 my-6 mx-auto max-w-3xl">
              <div className="p-6 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-900 outline-none focus:outline-none">
                {isConverting ? (
                  <>
                    <div className="flex justify-center rounded-t">
                      <h3 className="text-3xl font-semibold">変換中</h3>
                    </div>
                    <div className="flex justify-center pt-2">
                      <Loading />
                    </div>
                  </>
                ) : errors.length == 0 ? (
                  <div className="flex justify-center rounded-t">
                    <h3 className="text-3xl font-semibold">
                      変換が完了しました
                    </h3>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center rounded-t">
                      <h3 className="text-3xl font-semibold">
                        変換に失敗しました
                      </h3>
                    </div>
                    <div className="relative flex-auto max-h-80 py-2 overflow-scroll whitespace-nowrap">
                      {errors.map((error) => (
                        <p className="text-gray-400 text-sm">{error}</p>
                      ))}
                    </div>
                  </>
                )}
                {!isConverting && (
                  <div className="flex items-center justify-end rounded-b pt-2">
                    <button
                      type="button"
                      className="py-2 px-4 bg-green-500 hover:bg-green-600 focus:ring-green-500 focus:ring-offset-green-500 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
                      onClick={() => {
                        setShowModal(false);
                        setErrors([]);
                      }}
                    >
                      OK
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </div>
  );
};
