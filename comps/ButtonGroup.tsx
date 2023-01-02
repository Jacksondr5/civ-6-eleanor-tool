// ripped from https://stackoverflow.com/questions/59305603/increment-and-decrement-button-via-material-ui-buttongroup
import React from "react";
import { Button, ButtonGroup } from "@mui/material";

export default function GroupedButton(props: {
  count: number;
  onCounterChange: (counter: number) => void;
}) {
  const { count, onCounterChange } = props;
  const displayCounter = count >= 0;

  return (
    <ButtonGroup size="small" aria-label="small outlined button group">
      <Button onClick={() => onCounterChange(count + 1)}>+</Button>
      {displayCounter && <Button disabled>{count}</Button>}
      {displayCounter && (
        <Button onClick={() => onCounterChange(count - 1)}>-</Button>
      )}
    </ButtonGroup>
  );
}
