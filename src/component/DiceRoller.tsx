import React, { useState } from "react";
import Input from "@material-ui/core/Input";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import { rollDice } from "../dice/dice-pool";

const Root = styled.div`
    display: flex;
    flex-flow: column;
    align-items: stretch;
    justify-content: stretch;
    max-width: 400px;
`;

const DicePoolPanel = styled.div`
    display: flex;
    flex-flow: row;
    align-items: stretch;
    justify-content: start;
`;

const DiceSlider = styled(Slider)``;

const DiceInput = styled(Input)`
    max-width: 40px;
    margin-left: 5px;
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
    const [hitCount, setHitCount] = useState(0);
    const [glitch, setGlitch] = useState(false);

    const handleSliderChange = (_event: React.ChangeEvent<{}>, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            throw new Error(`Dice pool size cannot be an array`);
        }
        setDicePoolSize(newValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value);
        if (isNaN(newValue)) {
            alert(`Dice pool size must be a number - ignoring '${event.target.value}'`);
        } else {
            setDicePoolSize(newValue);
        }
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const result = rollDice(dicePoolSize);
        setHitCount(result.hitCount);
        setGlitch(result.glitch);
    };

    let glitchComponent: JSX.Element | null = null;
    if (glitch) {
        glitchComponent = <Typography color="error" variant="h3">{hitCount === 0 ? "CRITICAL GLITCH" : "GLITCH"}</Typography>
    }

    return (
        <Root>
            <Typography id="dice-pool-size-slider" gutterBottom>Dice Pool</Typography>
            <DicePoolPanel>
                <DiceSlider
                    value={dicePoolSize}
                    onChange={handleSliderChange}
                    step={1}
                    min={1}
                    max={36}
                    />
                    <DiceInput
                        value={dicePoolSize}
                        margin="dense"
                        onChange={handleInputChange}
                        inputProps={{
                            step: 1,
                            min: 1,
                            max: 36,
                            type: "number"
                        }}
                    />
            </DicePoolPanel>
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