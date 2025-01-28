import { Problem } from "../types";

function addTestCase(input: string, output: string, problem: Problem) {
    problem.inputs.push(input);
    problem.outputs.push(output);
}