import { LogicalSize, appWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';

import { fs } from '@tauri-apps/api';
import { resourceDir } from '@tauri-apps/api/path';
import { useInterval } from '@/hooks/useInterval';

export default function LayoutMapPage() {
  const [currentArea, setCurrentArea] = useState<string>('');
  const [maxLayoutsPerRow, _] = useState<number>(3);
  // const [areaImages, setAreaImages] = useState<
  //   {
  //     path: string;
  //     name: string;
  //   }[]
  // >([]);

  const [areaImages, setAreaImages] = useState<Uint8Array[] | undefined>();

  useInterval(async () => {
    const guide = JSON.parse(localStorage.getItem('guide') || '{}');
    const areaId = guide.state.currentArea;

    if (!areaId) return;

    if (currentArea === areaId) return;

    setCurrentArea(areaId);
  }, 1000);

  useEffect(() => {
    const handleAreaImage = async () => {
      if (currentArea === '') return;

      const dir = await resourceDir();

      const areaDir = await fs.readDir(`${dir}\\resources\\zones`);

      const images = areaDir.filter((area) => {
        const areaId = area.name?.split(' ')[0];
        return areaId === currentArea;
        // area.name?.startsWith(currentArea)
      });

      // const imagesClean = images.map(async (image) => ({
      //   path: await dirname(image.path),
      //   name: image.name
      // }));

      const contents = images.map(async (image) => {
        const content = await fs.readBinaryFile(image.path);
        return { content };
      });

      const imagesContent = await Promise.all(contents);

      if (imagesContent.length === 0) {
        setAreaImages(undefined);
        appWindow.hide();
        return;
      }

      appWindow.show();

      console.log(imagesContent.map((image) => image.content));

      setAreaImages(imagesContent.map((image) => image.content));

      const rows = Math.ceil(imagesContent.length / maxLayoutsPerRow);

      const width =
        imagesContent.length < 3
          ? (424 / 3) * imagesContent.length
          : (424 / 3) * maxLayoutsPerRow;
      const height = (230 / 3) * rows;

      console.log(images.length);

      console.log(images?.length);

      console.log(images?.length < 3 ? images?.length : maxLayoutsPerRow);
      console.log(width);

      appWindow.setSize(
        new LogicalSize(imagesContent.length > 0 ? width : 424 / 3, height)
      );
    };

    handleAreaImage().catch(console.error);
  }, [currentArea]);

  useEffect(() => {
    const init = async () => {
      document.body.classList.add('bg-background/0');
      appWindow.setIgnoreCursorEvents(true);
      await appWindow.setSkipTaskbar(true);
    };

    init().catch(console.error);
  }, []);

  return (
    <div
      className={'gap-1 aspect-auto h-full w-full overflow-hidden'}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${
          areaImages && areaImages?.length < 3
            ? areaImages?.length
            : maxLayoutsPerRow
        }, 1fr)`
      }}
    >
      {areaImages?.map((image, index) => (
        <img
          className='opacity-70'
          key={index}
          src={URL.createObjectURL(new Blob([image]))}
        />
      ))}
    </div>
  );
}
