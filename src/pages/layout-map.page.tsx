import { LogicalSize, appWindow } from '@tauri-apps/api/window';
import { dirname, resourceDir } from '@tauri-apps/api/path';
import { useEffect, useState } from 'react';

import { BaseDirectory } from '@tauri-apps/api/fs';
import { fs } from '@tauri-apps/api';
import { useInterval } from '@/hooks/useInterval';

export default function LayoutMapPage() {
  const [currentArea, setCurrentArea] = useState<string>('');
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

      const images = areaDir.filter((area) =>
        area.name?.startsWith(currentArea)
      );

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

      const width = (424 / 3) * imagesContent.length;

      appWindow.setSize(new LogicalSize(width, 230 / 3));
    };

    handleAreaImage().catch(console.error);
  }, [currentArea]);

  return (
    <div className='flex flex-row gap-1 aspect-auto h-full w-full'>
      {areaImages?.map((image, index) => (
        <img key={index} src={URL.createObjectURL(new Blob([image]))} />
      ))}
    </div>
  );
}
