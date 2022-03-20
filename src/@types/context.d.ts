export interface ISharpAPI {
  convert: (files: File[], directoryPath: string) => Promise<string[]>;
}

export interface IDialogAPI {
  openDirectory: () => Promise<string | void | undefined>;
}

declare global {
  interface Window {
    sharp: ISharpAPI;
    dialog: IDialogAPI;
  }
}
