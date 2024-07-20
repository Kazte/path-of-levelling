import { LogicalSize, appWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';

import { getImagesWithPattern } from '@/utilities/tauri.utilities';
import { useInterval } from '@/hooks/useInterval';

export default function LayoutMapPage() {
  const [currentArea, setCurrentArea] = useState<string>('');
  const [maxLayoutsPerRow, _] = useState<number>(3);

  const [areaImages, setAreaImages] = useState<string[] | undefined>(undefined);

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

      const images = await getImagesWithPattern(currentArea);

      if (images.length === 0) {
        setAreaImages(undefined);
        appWindow.hide();
        return;
      }

      appWindow.show();

      setAreaImages(images);

      const rows = Math.ceil(images.length / maxLayoutsPerRow);

      const width =
        images.length < 3
          ? (424 / 3) * images.length
          : (424 / 3) * maxLayoutsPerRow;
      const height = (230 / 3) * rows;

      appWindow.setSize(
        new LogicalSize(images.length > 0 ? width : 424 / 3, height)
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
        <img className='opacity-70' key={index} src={image} />
      ))}
    </div>
  );
}
