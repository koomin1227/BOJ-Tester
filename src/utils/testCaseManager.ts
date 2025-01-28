import { Problem } from "../types";

function addTestCase(input: string, output: string, problem: Problem) {
    problem.inputs.push(input);
    problem.outputs.push(output);
}

function deleteTestCase(testCaseIndex: number, problem: Problem) {
    if (testCaseIndex >= problem.DefaultTestCaseCount) {
        problem.inputs.splice(testCaseIndex, 1);
    }
}