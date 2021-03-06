import { ITrack, UserFiles } from "./types";
import audioBufferToWav from "./audioBufferToWav";
import { useLocation } from "react-router-dom";
// @ts-ignore
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

export function concatBuffer(buffers: AudioBuffer[]) {
  const buffLength = buffers.length;
  const channels = [];
  let totalDuration = 0;

  for (var a = 0; a < buffLength; a++) {
    channels.push(buffers[a].numberOfChannels); // Store all number of channels to choose the lowest one after
    totalDuration += buffers[a].duration; // Get the total duration of the new buffer when every buffer will be added/concatenated
  }

  var numberOfChannels = channels.reduce(function (a, b) {
    return Math.min(a, b);
  }); // The lowest value contained in the array channels
  var tmp = audioContext.createBuffer(
    numberOfChannels,
    audioContext.sampleRate * totalDuration,
    audioContext.sampleRate
  ); // Create new buffer

  for (var b = 0; b < numberOfChannels; b++) {
    var channel = tmp.getChannelData(b);
    var dataIndex = 0;

    for (var c = 0; c < buffers.length; c++) {
      try {
        channel.set(buffers[c].getChannelData(b), dataIndex);
      } catch (e) {
        console.log(buffers[c].getChannelData(b));
        console.log(dataIndex);
        console.log(buffers.length);
        console.log(c);
        console.error(e);
      }
      dataIndex += buffers[c].length; // Next position where we should store the next buffer values
    }
  }
  return tmp;
}

export const convertAudioBufferToBlob = (buffers: AudioBuffer[]) => {
  const concat = concatBuffer(buffers);
  // const buff = concat.getChannelData(1);

  const blob = new Blob([audioBufferToWav(concat)], {
    type: "audio/wav",
  });

  return blob;
};

export const convertTracksToBlob = (tracks: ITrack[], userFiles: UserFiles) => {
  const toConcatFiles: AudioBuffer[] = tracks.map(
    (track) => userFiles[track.referenceId].audioBuffer
  );
  const blob = convertAudioBufferToBlob(toConcatFiles);

  return blob;
};

export function downloadFromUrl(url: string) {
  // Construct the <a> element
  var link = document.createElement("a");
  link.download = "adventure-audio.wav";
  // Construct the uri
  //   var uri = 'data:text/csv;charset=utf-8;base64,' + someb64data
  link.href = url;
  document.body.appendChild(link);
  link.click();
  // Cleanup the DOM
  document.body.removeChild(link);
}

export const TRACK_LENGTH_MODIFIDER = 3;

export function useParam(paramName: string) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  return params.get(paramName);
}

export const bucketData = [
  {
    key: "Ain't No Mountain High Enough_Chorus.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Ain't+No+Mountain+High+Enough_Chorus.wav",
  },
  {
    key: "Ain't No Mountain High Enough_If you need me call me.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Ain't+No+Mountain+High+Enough_If+you+need+me+call+me.wav",
  },
  {
    key: "Ain't No Mountain High_Listen Baby.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Ain't+No+Mountain+High_Listen+Baby.wav",
  },
  {
    key: "Alesso - Heroes (we could be) ft. Tove Lo_Everyday people do.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Alesso+-+Heroes+(we+could+be)+ft.+Tove+Lo_Everyday+people+do.wav",
  },
  {
    key: "Alesso - Heroes (we could be) ft. Tove Lo_Intro.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Alesso+-+Heroes+(we+could+be)+ft.+Tove+Lo_Intro.wav",
  },
  {
    key: "Alesso - Heroes (we could be) ft. Tove Lo_Pre-Chorus.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Alesso+-+Heroes+(we+could+be)+ft.+Tove+Lo_Pre-Chorus.wav",
  },
  {
    key: "Avicii - Levels_Bridge.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Avicii+-+Levels_Bridge.wav",
  },
  {
    key: "Avicii - Levels_Intro.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Avicii+-+Levels_Intro.wav",
  },
  {
    key: "Avicii - Levels_Never never never had.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Avicii+-+Levels_Never+never+never+had.wav",
  },
  {
    key: "Bill Withers - Ain't No Sunshine (Official Audio)_When shes gone.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Bill+Withers+-+Ain't+No+Sunshine+(Official+Audio)_When+shes+gone.wav",
  },
  {
    key: "Billie Eilish - bad guy_Im the bad guy.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Billie+Eilish+-+bad+guy_Im+the+bad+guy.wav",
  },
  {
    key: "Billie Eilish - bad guy_Intro.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Billie+Eilish+-+bad+guy_Intro.wav",
  },
  {
    key: "Billie Eilish - bad guy_Outro Drums.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Billie+Eilish+-+bad+guy_Outro+Drums.wav",
  },
  {
    key: "Billie Eilish - bad guy_duh.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Billie+Eilish+-+bad+guy_duh.wav",
  },
  {
    key: "Billie Eilish - bury a friend_Billie.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Billie+Eilish+-+bury+a+friend_Billie.wav",
  },
  {
    key: "Billie Eilish - bury a friend_Eerie Bass.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Billie+Eilish+-+bury+a+friend_Eerie+Bass.wav",
  },
  {
    key: "Billie Eilish - bury a friend_I wanna end me.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Billie+Eilish+-+bury+a+friend_I+wanna+end+me.wav",
  },
  {
    key:
      "Billie Eilish - bury a friend_when we all fall asleep where do we go.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Billie+Eilish+-+bury+a+friend_when+we+all+fall+asleep+where+do+we+go.wav",
  },
  {
    key: "Billie Eilish - idontwannabeyouanymore (Vertical Video)_Anymore.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Billie+Eilish+-+idontwannabeyouanymore+(Vertical+Video)_Anymore.wav",
  },
  {
    key:
      "Billie Eilish - idontwannabeyouanymore (Vertical Video)_Chorus-end.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Billie+Eilish+-+idontwannabeyouanymore+(Vertical+Video)_Chorus-end.wav",
  },
  {
    key:
      "Billie Eilish - idontwannabeyouanymore (Vertical Video)_If tear drops could be bottled.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Billie+Eilish+-+idontwannabeyouanymore+(Vertical+Video)_If+tear+drops+could+be+bottled.wav",
  },
  {
    key:
      "Billie Eilish - idontwannabeyouanymore (Vertical Video)_Intro Vocal.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Billie+Eilish+-+idontwannabeyouanymore+(Vertical+Video)_Intro+Vocal.wav",
  },
  {
    key:
      "Daft Punk - Get Lucky (Official Audio) ft. Pharrell Williams, Nile Rodgers_Intro.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Daft+Punk+-+Get+Lucky+(Official+Audio)+ft.+Pharrell+Williams,+Nile+Rodgers_Intro.wav",
  },
  {
    key:
      "Daft Punk - Get Lucky (Official Audio) ft. Pharrell Williams, Nile Rodgers_We're up all night to get.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Daft+Punk+-+Get+Lucky+(Official+Audio)+ft.+Pharrell+Williams,+Nile+Rodgers_We're+up+all+night+to+get.wav",
  },
  {
    key: "David Guetta - Titanium ft. Sia (Official Video)_Fire Away.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/David+Guetta+-+Titanium+ft.+Sia+(Official+Video)_Fire+Away.wav",
  },
  {
    key: "David Guetta - Titanium ft. Sia (Official Video)_I am Titanium.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/David+Guetta+-+Titanium+ft.+Sia+(Official+Video)_I+am+Titanium.wav",
  },
  {
    key:
      "David Guetta - Titanium ft. Sia (Official Video)_I can't hear a word you say.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/David+Guetta+-+Titanium+ft.+Sia+(Official+Video)_I+can't+hear+a+word+you+say.wav",
  },
  {
    key: "David Guetta - Titanium ft. Sia (Official Video)_Intro.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/David+Guetta+-+Titanium+ft.+Sia+(Official+Video)_Intro.wav",
  },
  {
    key: "Eminem - Lose Yourself [HD]_Chorus.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Eminem+-+Lose+Yourself+[HD]_Chorus.wav",
  },
  {
    key: "Eminem - Lose Yourself [HD]_Intro.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Eminem+-+Lose+Yourself+[HD]_Intro.wav",
  },
  {
    key: "Eminem - Lose Yourself [HD]_Mom's Spaghetti.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Eminem+-+Lose+Yourself+[HD]_Mom's+Spaghetti.wav",
  },
  {
    key: "Eminem - Lose Yourself [HD]_Pre-Verse.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Eminem+-+Lose+Yourself+[HD]_Pre-Verse.wav",
  },
  {
    key: "Eminem - Lose Yourself [HD]_Pre-Verse.wav.asd",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Eminem+-+Lose+Yourself+[HD]_Pre-Verse.wav.asd",
  },
  {
    key: "Eminem - Without Me (Official Video)_Shady's Back.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Eminem+-+Without+Me+(Official+Video)_Shady's+Back.wav",
  },
  {
    key: "Eminem - Without Me (Official Video)_We've got a bogie.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Eminem+-+Without+Me+(Official+Video)_We've+got+a+bogie.wav",
  },
  {
    key: "Eminem - Without Me (Official Video)_Well I'm back.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Eminem+-+Without+Me+(Official+Video)_Well+I'm+back.wav",
  },
  {
    key: "Foster The People - Pumped up Kicks (Official Music Video)_Intro.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Foster+The+People+-+Pumped+up+Kicks+(Official+Music+Video)_Intro.wav",
  },
  {
    key: "Foster The People - Pumped up Kicks_Chorus.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Foster+The+People+-+Pumped+up+Kicks_Chorus.wav",
  },
  {
    key: "Gotye - Somebody That I Used To Know (feat. Kimbra)_Chorus.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Gotye+-+Somebody+That+I+Used+To+Know+(feat.+Kimbra)_Chorus.wav",
  },
  {
    key: "Gotye - Somebody That I Used To Know (feat. Kimbra)_Intro.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Gotye+-+Somebody+That+I+Used+To+Know+(feat.+Kimbra)_Intro.wav",
  },
  {
    key: "Green Day - 21 Guns_Chorus.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Green+Day+-+21+Guns_Chorus.wav",
  },
  {
    key: "Green Day - 21 Guns_Verse.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Green+Day+-+21+Guns_Verse.wav",
  },
  {
    key: "Heads Will Roll (A-Trak Remix)_Chorus.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Heads+Will+Roll+(A-Trak+Remix)_Chorus.wav",
  },
  {
    key: "Heads Will Roll (A-Trak Remix)_Instrumental Stabs.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Heads+Will+Roll+(A-Trak+Remix)_Instrumental+Stabs.wav",
  },
  {
    key: "Holiday _ Boulevard of Broken Dreams_Guitar Drone.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Holiday+_+Boulevard+of+Broken+Dreams_Guitar+Drone.wav",
  },
  {
    key: "Holiday _ Boulevard of Broken Dreams_Verse.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Holiday+_+Boulevard+of+Broken+Dreams_Verse.wav",
  },
  {
    key: "Young Dumb & Broke _ Khalid_Chorus .wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Young+Dumb+&+Broke+_+Khalid_Chorus+.wav",
  },
  {
    key: "Young Dumb & Broke _ Khalid_Chorus .wav.asd",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Young+Dumb+&+Broke+_+Khalid_Chorus+.wav.asd",
  },
  {
    key: "Young Dumb & Broke _ Khalid_Chorus Vocals.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Young+Dumb+&+Broke+_+Khalid_Chorus+Vocals.wav",
  },
  {
    key: "Young Dumb & Broke _ Khalid_Drums.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/Young+Dumb+&+Broke+_+Khalid_Drums.wav",
  },
  {
    key: "when the party's over_Chorus.wav",
    url:
      "https://audio-player-clips.s3-us-west-1.amazonaws.com/when+the+party's+over_Chorus.wav",
  },
];
