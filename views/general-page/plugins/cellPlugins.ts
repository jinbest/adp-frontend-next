import type { CellPlugin } from '@react-page/editor';

// The background plugin
import background, { ModeEnum } from '@react-page/plugins-background';

// The image plugin
import type { ImageUploadType } from '@react-page/plugins-image';
import { imagePlugin } from '@react-page/plugins-image';

import { defaultSlate, customizedSlate } from './slate';
import codeSnippet from './codeSnippet';

// CSS import
import '@react-page/editor/lib/index.css';
import '@react-page/plugins-slate/lib/index.css';
import '@react-page/plugins-image/lib/index.css';
import '@react-page/plugins-background/lib/index.css';


const fakeImageUploadService: (url: string) => ImageUploadType = () => (file, reportProgress) => {
  return new Promise((resolve) => {
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      reportProgress(counter * 10);
      if (counter > 9) {
        clearInterval(interval);
        resolve({ url: URL.createObjectURL(file) });
      }
    }, 100);
  });
};

// Define which plugins we want to use.

const cellPlugins = [
  defaultSlate,
  customizedSlate,
  imagePlugin({ imageUpload: fakeImageUploadService('https://storage.googleapis.com/adp_assets/images/5/northtech-banner.webp') }),
  codeSnippet,

  background({
    imageUpload: fakeImageUploadService('https://storage.googleapis.com/adp_assets/images/5/northtech-banner.webp'),
    enabledModes:
      ModeEnum.COLOR_MODE_FLAG |
      ModeEnum.IMAGE_MODE_FLAG |
      ModeEnum.GRADIENT_MODE_FLAG,
  }),
] as CellPlugin[];

export {
  cellPlugins
}
