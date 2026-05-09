import { useState } from "react";
import { TUTORIAL_SCRIPTS } from "../data/tutorialScripts.js";

export function useTutorial(gameId) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const script = TUTORIAL_SCRIPTS[gameId];
  const steps = script?.steps || [];
  const totalSteps = steps.length;
  const isComplete = active && stepIndex >= totalSteps;
  const currentStep = active && stepIndex < totalSteps ? steps[stepIndex] : null;

  function start() {
    setActive(true);
    setStepIndex(0);
  }

  function exit() {
    setActive(false);
    setStepIndex(0);
  }

  function advance() {
    setStepIndex((i) => i + 1);
  }

  return {
    active,
    currentStep,
    stepIndex,
    totalSteps,
    isComplete,
    start,
    exit,
    advance,
    highlightMove: currentStep?.move ?? null,
    aiMove: currentStep?.aiMove ?? null,
    preAiMove: currentStep?.preAiMove ?? null,
    text: currentStep?.text ?? "",
    title: script?.title ?? "",
  };
}
