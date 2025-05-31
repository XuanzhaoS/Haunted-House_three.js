import * as THREE from 'three'

export const bgm = (path, volume = 0.05) => {
    const sound = new Audio(path);
    sound.volume = volume;
    sound.play();
  };