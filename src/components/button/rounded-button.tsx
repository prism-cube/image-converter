import React, { ReactNode } from "react";

type Props = {
  onClick: () => void;
  color: "green" | "indigo" | "gray" | "transparent";
  children?: ReactNode;
};

export const RoundedButton: React.VFC<Props> = ({
  onClick,
  color,
  children,
}) => {
  let classes = "";
  switch (color) {
    case "green":
      classes =
        "bg-green-500 hover:bg-green-600 focus:ring-green-500 focus:ring-offset-green-500";
      break;
    case "indigo":
      classes =
        "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200";
      break;
    case "gray":
      classes =
        "bg-gray-700 hover:bg-gray-800 focus:ring-gray-700 focus:ring-offset-gray-700";
      break;
    case "transparent":
      classes =
        "hover:bg-gray-800 focus:ring-gray-700 focus:ring-offset-gray-700";
      break;
  }

  return (
    <button
      type="button"
      className={`${classes} py-2 px-4 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
