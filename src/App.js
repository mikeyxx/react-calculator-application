import { useReducer } from "react";
import "./styles.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOutput: payload.digit,
          previousOutput: null,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOutput === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOutput.includes(".")) {
        return state;
      }
      if (state.previousOutput === state.currentOutput && state.operation)
        return { ...state, currentOutput: `${payload.digit}` };
      return {
        ...state,
        currentOutput: `${state.currentOutput || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOutput === null && state.previousOutput === null) {
        return state;
      }
      if (state.currentOutput == null) {
        return { ...state, operation: payload.operation };
      }

      if (state.previousOutput == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOutput: state.currentOutput,
          currentOutput: null,
        };
      }

      return {
        ...state,
        previousOutput: evaluate(state),
        operation: payload.operation,
        currentOutput: payload.digit,
      };
    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.DELETE_DIGIT:
      if (state.currentOutput > 0) {
        return {
          ...state,
          currentOutput: state.currentOutput.slice(0, -1),
        };
      }
      if (state.overwrite) {
        return { ...state, previousOutput: null, overwrite: false };
      }

    case ACTIONS.EVALUATE:
      if (
        state.currentOutput == null ||
        state.previousOutput == null ||
        state.operation == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        currentOutput: evaluate(state),
        operation: null,
        previousOutput: `${formatOutput(state.previousOutput)}${
          state.operation
        }${formatOutput(state.currentOutput)}`,
      };
  }
}

function evaluate({ previousOutput, currentOutput, operation }) {
  const prev = parseFloat(previousOutput);
  const current = parseFloat(currentOutput);
  if (isNaN(prev) || isNaN(current)) return "";
  let result = "";
  switch (operation) {
    case "+":
      result = prev + current;
      break;
    case "*":
      result = prev * current;
      break;
    case "÷":
      result = prev / current;
      break;
    case "-":
      result = prev - current;
  }

  return result.toString();
}

const INTEGER_FORMATER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOutput(output) {
  if (output == null) return;
  const [integer, decimal] = output.split(".");
  if (decimal == null) return INTEGER_FORMATER.format(integer);
}

const App = () => {
  const [{ currentOutput, previousOutput, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calc-container">
      <div className="output">
        <div className="previous-output">
          {previousOutput} {operation}
        </div>
        <div className="current-output">{currentOutput || "0"}</div>
      </div>
      <button
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        className="span-2"
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        className="span-2"
      >
        =
      </button>
    </div>
  );
};

export default App;
