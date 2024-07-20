import { FileEntry, readDir } from '@tauri-apps/api/fs';
import { join, resourceDir } from '@tauri-apps/api/path';

import { convertFileSrc } from '@tauri-apps/api/tauri';

export async function getImagesWithPattern(pattern: string): Promise<string[]> {
  const appDir = await resourceDir();
  const resourcePath = await join(appDir, 'resources', 'zones');

  const entires = await readDir(resourcePath, { recursive: false });

  return entires
    .filter((area) => {
      const areaId = area.name?.split(' ')[0];
      return areaId === pattern;
    })
    .map((area: FileEntry) => {
      const cleanPath = convertFileSrc(area.path);

      return `${cleanPath}`;
    });
}
