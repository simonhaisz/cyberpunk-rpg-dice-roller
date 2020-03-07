import React from "react";
import styled from "styled-components";
import { generateDiceRollTable } from "../dice/dice-tables";

const Root = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    max-width: 600px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
`;

const Die = styled.span`
    margin: 5px;
`;

type Props = {
    poolSize: number;
}

const DiceTable: React.FC<Props> = (props: Props) => {
    const { poolSize } = props;
    const table = generateDiceRollTable(poolSize);
    if (poolSize > 3) {
        return (
            <div>Dice pool size {poolSize} is too large for table</div>
        );
    }
    return (
        <Root>
            {
                table.results.map((result, r) => (
                    <Row key={r}>
                        {
                            result.map((die, d) => (
                                <Die key={d}>{die}</Die>
                            ))
                        }
                    </Row>
                ))
            }
        </Root>
    );
}

export default DiceTable;