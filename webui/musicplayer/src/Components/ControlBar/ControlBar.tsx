import styled from "@emotion/styled";
import { FC } from "react";
import Next from "../Icons/Next";
import Play from "../Icons/Play";
import Previous from "../Icons/Previous";
import Repeat from "../Icons/Repeat";
import Shuffle from "../Icons/Shuffle";
import CurrentTrack from "./CurrentTrack";

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 96px;
  padding-left: 10px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  width: 200px;
`;

const Button = styled.button`
  background-color: transparent;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export type ControlBarProps = {
  nowPlaying?: {
    album: string;
    artist: string;
    title: string;
    cover: string;
    duration: number;
    progress: number;
  };
};

const ControlBar: FC<ControlBarProps> = ({ nowPlaying }) => {
  return (
    <Container>
      <Controls>
        <Button>
          <Shuffle />
        </Button>
        <Button>
          <Previous />
        </Button>
        <Button>
          <Play />
        </Button>
        <Button>
          <Next />
        </Button>
        <Button>
          <Repeat />
        </Button>
      </Controls>
      <CurrentTrack nowPlaying={nowPlaying} />
    </Container>
  );
};

export default ControlBar;