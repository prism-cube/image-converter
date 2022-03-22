import React from "react";
import { RoundedButton } from "../button/rounded-button";
import { Loading } from "../svg/loading";

type Props = {
  isConverting: boolean;
  errors: string[];
  onModalCloseButtonClick: () => void;
};

export const ConvertStateModal: React.VFC<Props> = ({
  isConverting,
  errors,
  onModalCloseButtonClick,
}) => {
  return (
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
                <h3 className="text-3xl font-semibold">変換が完了しました</h3>
              </div>
            ) : (
              <>
                <div className="flex justify-center rounded-t">
                  <h3 className="text-3xl font-semibold">
                    変換に失敗したファイルがあります
                  </h3>
                </div>
                <div className="relative flex-auto max-h-80 py-2 overflow-auto whitespace-nowrap">
                  {errors.map((error) => (
                    <p className="text-gray-400 text-sm">{error}</p>
                  ))}
                </div>
              </>
            )}
            {!isConverting && (
              <div className="flex items-center justify-end rounded-b pt-2">
                <RoundedButton color="green" onClick={onModalCloseButtonClick}>
                  OK
                </RoundedButton>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
