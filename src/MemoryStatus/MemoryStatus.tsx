import "./style.css";
import { Component, Show, createEffect, createSignal, onCleanup } from "solid-js";
import { MemoryOutput } from "zebar";
import * as zebar from "zebar";
import { useAnimatedClick } from "../hooks/useAnimatedClick";

interface MemoryStatusProps {
  memory: MemoryOutput;
}

const MemoryStatus: Component<MemoryStatusProps> = (props) => {
  const [memorySig, setMemorySig] = createSignal(props.memory);
  const [isHovered, setIsHovered] = createSignal(false);
  let leaveTimeout: number | undefined;

  createEffect(() => setMemorySig(props.memory));

  const getMemoryUsageRate = (usage: number) => {
    if (usage > 90) return "extreme-usage";
    else if (usage > 65) return "high-usage";
    else if (usage > 30) return "medium-usage";
    else return "low-usage";
  };

  const { isActive, handleClick } = useAnimatedClick();

  const handleMemoryClick = (e: MouseEvent) => {
    handleClick();
    zebar.shellExec("C:\\Program Files\\Mem Reduct\\memreduct.exe");
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
    }, 100); // Petit délai de 100ms
  };

  onCleanup(() => {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
    }
  });

  return (
    <Show when={memorySig()}>
      <div
        classList={{
          "memory-container": true,
          [getMemoryUsageRate(Math.round((memorySig()!.usedMemory / memorySig()!.totalMemory) * 100))]: true,
          "clicked-animated": isActive(),
        }}
        onClick={handleMemoryClick}
      >
        <div 
          class="memory-hover-zone"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <i class="i-memory nf nf-fa-memory"></i>
          
          {/* Barre de progression */}
          <div 
            classList={{
              "memory-bar-wrapper": true,
              "hidden": isHovered()
            }}
          >
            <div
              class="memory-bar-fill"
              style={{
                width: `${(memorySig()!.usedMemory / memorySig()!.totalMemory) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* GB utilisés qui apparaissent au hover */}
        <span 
          classList={{
            "memory-usage": true,
            "visible": isHovered()
          }}
        >
          {(memorySig()!.usedMemory / 1000000000).toFixed(0)}GB
        </span>
      </div>
    </Show>
  );
};

export default MemoryStatus;