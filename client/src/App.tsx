import React, { useEffect } from "react";
import { useState, useCallback } from "react";
import "./css/App.css";

import { DndProvider } from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch";

import { DropTargetMonitor, DragObjectWithType, useDrop } from "react-dnd";
import { AudioVisualizer } from "./components/audioVisualizer";
import WaveformData from "waveform-data";
import { v4 as uuidv4 } from "uuid";
import { UserFiles, IUserUpload } from "./types";
import { NativeTypes } from "react-dnd-html5-backend";
import { PlayCircleFilledRounded } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { PlayerPage } from "./components/PlayerPage";
import { AdventureLogo } from "./components/AdventureLogo";

// @ts-ignore
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const convertBufferToWaveformData = (audioBuffer: AudioBuffer) => {
  const options = {
    audio_context: audioContext,
    audio_buffer: audioBuffer,
    scale: 128,
  };

  return new Promise<{ waveform: WaveformData; audioBuffer: AudioBuffer }>(
    (resolve, reject) => {
      WaveformData.createFromAudio(options, (err, waveform) => {
        if (err) {
          reject(err);
        } else {
          resolve({ waveform, audioBuffer });
        }
      });
    }
  );
};

const createWaveform = async (
  file: File
): Promise<{ waveform: WaveformData; audioBuffer: AudioBuffer }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const buffer = reader.result as Buffer;

      audioContext.decodeAudioData(buffer).then(async (audioBuffer) => {
        const waveformData = await convertBufferToWaveformData(audioBuffer);
        resolve(waveformData);
      });
    };
    reader.readAsArrayBuffer(file);
  });
};

export const AudioEditor: React.FC = () => {
  const [userFiles, setUserFiles] = useState<UserFiles>({});

  const onAddFile = async (file: File) => {
    const waveForm = await createWaveform(file);
    const newId = uuidv4();
    const newUserFiles = {
      ...userFiles,
      [newId]: {
        file,
        waveformData: waveForm.waveform,
        audioBuffer: waveForm.audioBuffer,
        id: newId,
      },
    };

    setUserFiles(newUserFiles);
  };

  const onClickLibraryItem = (key: string, url: string) => {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function () {
      var audioData = request.response;
      audioContext.decodeAudioData(
        audioData,
        async (buffer) => {
          const waveForm = await convertBufferToWaveformData(buffer);
          const newId = uuidv4();
          const newUserFiles = {
            ...userFiles,
            [newId]: {
              file: { name: key },
              waveformData: waveForm.waveform,
              audioBuffer: waveForm.audioBuffer,
              id: newId,
            },
          };

          setUserFiles(newUserFiles);
        },
        console.error
      );
    };
    request.send();
  };

  const handleFileDrop = useCallback(
    (item: DragObjectWithType, monitor: DropTargetMonitor) => {
      if (monitor) {
        const files = monitor.getItem().files as { [key: string]: File };

        const newFilesArr = Object.values(files).reduce(
          (acc: File[], file) => acc.concat(file),
          []
        );

        Promise.all(
          newFilesArr.map((file) => {
            return createWaveform(file);
          })
        ).then((waveformDataArr) => {
          const newUserFiles: UserFiles = Object.values(newFilesArr).reduce(
            (acc: UserFiles, file, index) => {
              const newId = uuidv4();
              acc[newId] = {
                file,
                waveformData: waveformDataArr[index].waveform,
                audioBuffer: waveformDataArr[index].audioBuffer,
                id: newId,
              };
              return acc;
            },
            {}
          );

          setUserFiles({ ...userFiles, ...newUserFiles });
        });
      }
    },
    [userFiles]
  );

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop(item, monitor) {
      handleFileDrop(item, monitor);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;

  return (
    <div
      ref={drop}
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        flexDirection: "column",
      }}
    >
      <div className="player-logo">
        <IconButton style={{ width: 50, height: 50 }} disabled={true}>
          <PlayCircleFilledRounded
            style={{ color: "orange", width: 50, height: 50 }}
          />
        </IconButton>
        player
      </div>
      {isActive && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            background: "lightblue",
            opacity: 0.7,
          }}
        />
      )}

      <AudioVisualizer
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          flex: 1,
        }}
        userFiles={userFiles}
        onAddFile={onAddFile}
        onClickLibraryItem={onClickLibraryItem}
      />
      <AdventureLogo />
    </div>
  );
};
function App() {
  const [songList, setSongList] = useState<IUserUpload[]>([]);
  useEffect(() => {
    fetch("/user-uploads")
      // .then(console.log);
      .then((res) => res.json())
      .then((_res) => {
        console.log(_res);
        const res = _res as { uploads: IUserUpload[] };
        setSongList(res.uploads);
      });
  }, []);
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/player">
            <PlayerPage uploadList={songList} />
          </Route>
          <Route path="/">
            <DndProvider options={HTML5toTouch}>
              <AudioEditor />
            </DndProvider>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
