import "./style.css";
import { Component, Show, createEffect, createSignal, onCleanup } from "solid-js";
import { CpuOutput } from "zebar";
import { GlazeWmOutput } from "zebar";
import * as zebar from "zebar";
import { useAnimatedClick } from "../hooks/useAnimatedClick";

interface CpuStatusProps {
  cpu: CpuOutput;
  glazewm: GlazeWmOutput;
}

const CpuStatus: Component<CpuStatusProps> = (props) => {
  const [cpuSig, setCpuSig] = createSignal(props.cpu);
  const [isHovered, setIsHovered] = createSignal(false);
  let leaveTimeout: number | undefined;

  createEffect(() => setCpuSig(props.cpu));

  const getCpuUsageRate = (usage: number) => {
    if (usage > 90) return "extreme-usage";
    else if (usage > 65) return "high-usage";
    else if (usage > 30) return "medium-usage";
    else return "low-usage";
  };

  const { isActive, handleClick } = useAnimatedClick();

  const handleCpuClick = () => {
    handleClick();
    zebar.shellExec("taskmgr");
  };

  const handleMouseEnter = () => {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
      leaveTimeout = undefined;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    leaveTimeout = window.setTimeout(() => {
      setIsHovered(false);
    }, 100);
  };

  onCleanup(() => {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
    }
  });

  return (
    <Show when={cpuSig()}>
      <div
        classList={{
          "cpu-container": true,
          [getCpuUsageRate(Math.round(cpuSig()!.usage))]: true,
          "clicked-animated": isActive(),
        }}
        onClick={handleCpuClick}
      >
        <div
          class="cpu-hover-zone"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <i class="i-cpu nf nf-oct-cpu"></i>

          <div
            classList={{
              "cpu-bar-wrapper": true,
              "hidden": isHovered()
            }}
          >
            <div
              class="cpu-bar-fill"
              style={{
                width: `${cpuSig()!.usage}%`,
              }}
            ></div>
          </div>
        </div>

        <span
          classList={{
            "cpu-percentage": true,
            "visible": isHovered()
          }}
        >
          {Math.round(cpuSig()!.usage)}%
        </span>
      </div>
    </Show>
  );
};

export default CpuStatus;