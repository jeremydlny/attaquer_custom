import "./style.css";
import { Component, createSignal, onMount, onCleanup } from "solid-js";
import { NetworkOutput } from "zebar";
import { GlazeWmOutput } from "zebar";
import { useAnimatedClick } from "../hooks/useAnimatedClick";

interface NetworkStatusProps {
  network: NetworkOutput;
  glazewm: GlazeWmOutput;
}

interface PingStatus {
  isOnline: boolean;
  latency: number | null;
}

const NetworkStatus: Component<NetworkStatusProps> = (props) => {
  const { isActive, handleClick } = useAnimatedClick();
  const [pingStatus, setPingStatus] = createSignal<PingStatus>({
    isOnline: false,
    latency: null,
  });
  const [publicIp, setPublicIp] = createSignal<string | null>(null);
  const [showIpPanel, setShowIpPanel] = createSignal(false);
  const [showPublicIp, setShowPublicIp] = createSignal(false);

  const pingAndGetIp = async () => {
    const startTime = performance.now();
    try {
      const response = await fetch("https://api.ipify.org?format=json", {
        method: "GET",
        cache: "no-store",
      });
      if (response.ok) {
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);
        setPingStatus({ isOnline: true, latency });

        const data = await response.json();
        if (data.ip) {
          setPublicIp(data.ip);
        }
      } else {
        setPingStatus({ isOnline: false, latency: null });
      }
    } catch {
      setPingStatus({ isOnline: false, latency: null });
    }
  };

  onMount(() => {
    pingAndGetIp();
    const interval = setInterval(pingAndGetIp, 5000);
    onCleanup(() => clearInterval(interval));
  });

  const handlePingEnter = () => {
    setShowIpPanel(true);
  };

  const handlePingLeave = () => {
    setShowIpPanel(false);
    setShowPublicIp(false);
  };

  const handleEyeClick = (e: MouseEvent) => {
    e.stopPropagation();
    setShowPublicIp(!showPublicIp());
  };

  const getLocalIp = () => {
    const defaultInterface = props.network?.defaultInterface;
    if (defaultInterface?.ipv4Addresses?.[0]) {
      return defaultInterface.ipv4Addresses[0];
    }
    return "...";
  };

  const handleOpenActionCenterClick = () => {
    handleClick();
    props.glazewm.runCommand(
      "shell-exec %userprofile%/.glzr/zebar/attaquer-solid-ts/dist/assets/scripts/OpenActionCenter.ahk",
      // "shell-exec %userprofile%/AppData/Roaming/zebar/downloads/iattaquer.attaquer@1.0.1/dist/assets/scripts/OpenActionCenter.ahk",
    );
  };

  const getPingIndicator = () => {
    const status = pingStatus();
    const color = status.isOnline ? "#75ea07" : "#db1e1d";

    return (
      <div
        class="ping-container"
        onMouseEnter={handlePingEnter}
        onMouseLeave={handlePingLeave}
      >
        {showIpPanel() ? (
          <div class="ip-panel">
            <span class="ip-local">{getLocalIp()}</span>
            <span class="ip-separator">|</span>
            <span class="ip-public-container">
              <span class="ip-eye" onClick={handleEyeClick}>
                {showPublicIp() ? "󰈈" : "󰈉"}
              </span>
              {showPublicIp() && <span class="ip-public">{publicIp() || "..."}</span>}
            </span>
          </div>
        ) : (
          <div class="ping-indicator">
            <span class="ping-dot" style={{ background: color }}></span>
            <span class="ping-ms">
              {status.latency !== null ? `${status.latency}ms` : "--"}
            </span>
          </div>
        )}
      </div>
    );
  };
  return (
    <button
      class={`network ${isActive() ? "clicked-animated" : ""}`}
      onClick={handleOpenActionCenterClick}
    >
      <span class="content">
        {getPingIndicator()}
        <div class="labels">
          <span class="label">
            <span class="ii">󰇚</span>
            <span class="net-line">
              {props.network?.traffic?.received.siValue}{" "}
              {props.network?.traffic?.received.siUnit}
            </span>
          </span>
          <span class="label">
            <span class="ii">󰕒</span>
            <span class="net-line">
              {props.network?.traffic?.transmitted.siValue}{" "}
              {props.network?.traffic?.transmitted.siUnit}
            </span>
          </span>
        </div>
      </span>
    </button>
  );
};

export default NetworkStatus;
