import React, { useState } from "react";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import { rollDice } from "../dice/dice-pool";
import DiceTable from "./DiceTable";

const Root = styled.div`
    display: flex;
    flex-flow: column;
    align-items: stretch;
    justify-content: stretch;
    max-width: 600px;
`;

const StyledSliderPanel = styled.div`
    display: flex;
    flex-flow: row;
    align-items: flex-end;
    justify-content: flex-start;
    margin-top: 40px;
`;

const StyledLabel = styled(Typography)`
    flex-grow: 0;
    min-width: 100px;
    padding-bottom: 3px;
`;

const StyledSlider = styled(Slider)`
    flex-grow: 1;
`;

const HitCountText = styled(TextField)`
    & input {
        color: black;
    }
`;

const Separator = styled.div`
    margin-top: 5px;
    margin-bottom: 5px;
`;

const DiceRoller: React.FC = () => {
    const [dicePoolSize, setDicePoolSize] = useState(6);
    const [threshold, setThreshold] = useState(0);
    const [hitCount, setHitCount] = useState(0);
    const [glitch, setGlitch] = useState(false);

    const handleDicePoolChange = (_event: React.ChangeEvent<{}>, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            throw new Error(`Dice pool size cannot be an array`);
        }
        setDicePoolSize(newValue);
    };

    const handleThresholdChange = (_event: React.ChangeEvent<{}>, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            throw new Error(`Threshold cannot be an array`);
        }
        setThreshold(newValue);
    };

    const handleButtonClick = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const result = rollDice(dicePoolSize);
        setHitCount(result.hitCount);
        setGlitch(result.glitch);
    };

    let glitchComponent: JSX.Element | null = null;
    if (glitch) {
        const critical = hitCount === 0;
        glitchComponent = <Typography color="error" variant={critical ? "h2" : "h3"}>{critical ? "CRITICAL GLITCH" : "GLITCH"}</Typography>
    }

    return (
        <Root>
            <StyledSliderPanel>
                <StyledLabel>Dice Pool</StyledLabel>
                <StyledSlider
                    id="dice-pool-slider"
                    value={dicePoolSize}
                    onChange={handleDicePoolChange}
                    step={1}
                    min={1}
                    max={12}
                    valueLabelDisplay="on"
                    />
            </StyledSliderPanel>
            <Separator />
            <StyledSliderPanel>
                <StyledLabel>Threshold</StyledLabel>
                <StyledSlider
                    value={threshold}
                    onChange={handleThresholdChange}
                    step={1}
                    min={0}
                    max={12}
                    valueLabelDisplay="on"
                    />
            </StyledSliderPanel>
            <Separator />
            <DiceTable poolSize={dicePoolSize} />
            <Separator />
            <Button size="large" onClick={handleButtonClick} variant="outlined">Roll Dice</Button>
            <Separator />
            <HitCountText
                label="Hits"
                variant="outlined"
                value={hitCount}
                disabled
                />
            <Separator />
            {glitchComponent}
        </Root>
    );
};

export default DiceRoller;