import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { RoundedButton } from "./components/button/rounded-button";
import { ClearButton } from "./components/button/clear-button";
import { ConvertStateModal } from "./components/modal/convert-state-modal";

const { sharp, dialog } = window;

export const App = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [directoryPath, setDirectoryPath] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null || isConverting) return;
    setFiles([...files, ...e.target.files]);
  };

  const onChoiceFilesButtonClick = () => {
    if (inputRef.current == null || isConverting) return;
    inputRef.current.click();
  };

  const onConvertButtonClick = async () => {
    if (files.length == 0 || isConverting) return;
    setIsConverting(true);
    setShowModal(true);
    const convertErrors = await sharp.convert(files, directoryPath);
    setErrors(convertErrors);
    setIsConverting(false);
  };

  const onClearFilesButtonClick = () => {
    if (isConverting) return;
    setFiles([]);
  };

  const onChoiceDirectoryButtonClick = async () => {
    const directoryPath = await dialog.openDirectory();
    if (typeof directoryPath === "string") {
      setDirectoryPath(directoryPath);
    }
  };

  const onClearDirectoryPathButtonClick = () => {
    setDirectoryPath("");
  };

  const onModalCloseButtonClick = () => {
    setShowModal(false);
    setErrors([]);
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
        <RoundedButton color="indigo" onClick={onChoiceFilesButtonClick}>
          画像を選択
        </RoundedButton>
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={onFileInputChange}
          ref={inputRef}
        />
        <RoundedButton color="transparent" onClick={onClearFilesButtonClick}>
          クリア
        </RoundedButton>
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
        <RoundedButton color="gray" onClick={onChoiceDirectoryButtonClick}>
          保存先フォルダを選択
        </RoundedButton>
        <div className="inline ml-4 text-gray-400">
          {directoryPath == "" ? (
            <span>元ファイルと同じフォルダに保存</span>
          ) : (
            <>
              <span>{directoryPath}</span>
              <ClearButton onClick={onClearDirectoryPathButtonClick} />
            </>
          )}
        </div>
      </div>

      <div className="pb-4 text-center">
        <RoundedButton color="green" onClick={onConvertButtonClick}>
          変換
        </RoundedButton>
      </div>

      {showModal && (
        <ConvertStateModal
          isConverting={isConverting}
          errors={errors}
          onModalCloseButtonClick={onModalCloseButtonClick}
        />
      )}
    </div>
  );
};
