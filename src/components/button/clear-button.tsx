import React from "react";
import { Clear } from "../svg/clear";

type Props = {
  onClick: () => void;
};

export const ClearButton: React.VFC<Props> = ({ onClick }) => {
  return (
    <button
      type="button"
      className="w-5 h-5 ml-2 text-base rounded-full text-white bg-gray-600"
      onClick={onClick}
    >
      <Clear />
    </button>
  );
};
