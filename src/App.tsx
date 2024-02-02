import { useEffect, useState } from 'react';
import { useInterval } from './hooks/useInterval';
import { invoke } from '@tauri-apps/api';
import { IGuide } from './interfaces/guide.interface';
import { readText } from '@tauri-apps/api/clipboard';
import LevellingGuide from './components/levelling-guide';
import { getGuide, removeGuide, saveGuide } from './utilities/save-guide';
import Ajv from 'ajv';
import { guideSchema } from './utilities/guide.schema';
import { sanitizeGuide } from './utilities/guide.utilities';
import Navbar from './components/navbar';
import { useGuideStore } from './store/guide.store';

function App() {
  const [areaName, setAreaName] = useState<string>();
  const [error, setError] = useState<string>();
  // const [guide, setGuide] = useState<IGuide | null>();
  const [start, setStart] = useState<boolean>(false);
  const { guide } = useGuideStore((state) => state);

  const CLIENT_PATH =
    'C:\\Program Files (x86)\\Grinding Gear Games\\Path of Exile\\logs\\Client.txt';

  useInterval(async () => {
    if (!start) return;

    try {
      const response: any = await invoke('get_area_name', {
        fileLocation: CLIENT_PATH
      });
      setAreaName(response);
    } catch (e: any) {
      setAreaName('');
      setError(e);
    }
  }, 1000);

  useEffect(() => {
    if (!guide) return;
    sanitizeGuide(guide!);
  }, [guide]);

  return (
    <>
      <Navbar />
      <main className='flex-grow p-2'>
        {areaName ? (
          <h2>{areaName}</h2>
        ) : (
          <>
            {error ? (
              <h3 className='text-red-500'>{error}</h3>
            ) : (
              <h2>Loading...</h2>
            )}
          </>
        )}
        {guide ? <LevellingGuide levellingGuide={guide} /> : <h2>No Guide</h2>}
      </main>
    </>
  );
}

export default App;

{
  /* <header className='flex flex-row justify-between items-center min-h-12 w-full border-b-[1px] border-neutral-700 p-3 drop-shadow-md shadow-neutral-950'>
  <h1>POE Guides</h1>
  <div className='flex flex-row gap-3 justify-center'>
    <button onClick={handleOnClickClipboard}>Load from clipboard</button>
    <button onClick={handleOnClickLocalStorage}>
      Load from localstorage
    </button>
    <button
      onClick={() => {
        setGuide(null);
        removeGuide();
      }}
    >
      Discard Guide
    </button>
  </div>
</header> */
}
