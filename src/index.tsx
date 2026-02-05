/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { createStore } from "solid-js/store";
import * as zebar from "zebar";
// import WindowsButton from "./Buttons/WindowsButton";
// import SearchButton from "./Buttons/SearchButton";
import Workspaces from "./Workspaces/Workspaces";
import TilingBinding from "./TilingBinding/TilingBinding";
// import WindowTitle from "./WindowTitle/WindowTitle";
// import CurrentApps from "./CurrentApps/CurrentApps";
import VolumeStatus from "./VolumeStatus/VolumeStatus";
// import MediaStatus from "./Media/MediaStatus";
import CpuStatus from "./CpuStatus/CpuStatus";
import MemoryStatus from "./MemoryStatus/MemoryStatus";
import NetworkStatus from "./NetworkStatus/NetworkStatus";
import TimeStatus from "./Time/TimeStatus";
// import Systray from "./Systray/Systray";
// import WeatherStatus from "./WeatherStatus/WeatherStatus";

const providers = zebar.createProviderGroup({
  glazewm: { type: "glazewm" },
  cpu: { type: "cpu", refreshInterval: 5000 },
  memory: { type: "memory", refreshInterval: 5000 },
  weather: { type: "weather" },
  network: { type: "network", refreshInterval: 2000 },
  battery: { type: "battery", refreshInterval: 10000 },
  date: { type: "date", formatting: "HH:mm ccc d LLLL y" },
  media: { type: "media" },
  audio: { type: "audio" },
  systray: { type: "systray" },
});

render(() => <App />, document.getElementById("root")!);

function App() {
  const [output, setOutput] = createStore(providers.outputMap);

  providers.onOutput((outputMap) => setOutput(outputMap));

  return (
    <div class="app">
      <div class="left">
        {output.glazewm && <TilingBinding glazewm={output.glazewm} />}
        {/* <WindowsButton glazewm={output.glazewm} /> */}
        {/* <SearchButton glazewm={output.glazewm} /> */}
        {output.glazewm && <Workspaces glazewm={output.glazewm} />}
      </div>
      <div class="center">
        {/* {output.weather && <WeatherStatus weather={output.weather} />} */}
        {/* {output.media && <MediaStatus media={output.media} />} */}
        {/* <CurrentApps glazewm={output.glazewm} /> */}
      </div>
      <div class="right">
        {/* <CurrentApps glazewm={output.glazewm} /> */}
        {/* <Systray systray={output.systray} glazewm={output.glazewm} /> */}
        {output.network && output.glazewm && <NetworkStatus network={output.network} glazewm={output.glazewm} />}
        {output.cpu && output.glazewm && <CpuStatus cpu={output.cpu} glazewm={output.glazewm} />}
        {output.memory && <MemoryStatus memory={output.memory} />}
        {output.audio && output.glazewm && <VolumeStatus audio={output.audio} glazewm={output.glazewm} />}
        {output.date && <TimeStatus date={output.date} />}
      </div>
    </div>
  );
}
