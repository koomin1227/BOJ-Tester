import axios from "axios";
import * as cheerio from 'cheerio';
import { Problem, ProblemStats } from "../types";
import { problemSet } from "../panels/problemInfoPanel";

const BASE_URL = "https://www.acmicpc.net/problem/";
const USER_AGENT = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36";

export async function getProlem(id: number): Promise<Problem> {
    if (id in problemSet) {
        return problemSet[id];
    } else {
        const problem = await parseProblem(id);
        problemSet[id] = problem;
        return problem;
    }
}

async function parseProblem(id: number): Promise<Problem> {
    const html = await fetchProblemHtml(id);

    const $ = cheerio.load(html);

    // 문제 정보 파싱
    const title = $("#problem_title").text().trim();

    // 문제 설명
    const descriptions: string[] = [];
    $('.problem-section').each((index, element) => {
        const problemText = $(element).find('.problem-text').text().trim();

        if (problemText) {
            const sectionHtml = $(element).html();
            descriptions.push(sectionHtml ?? '');
        }
    });

    // 예제 입력/출력
    const inputs: string[] = [];
    const outputs: string[] = [];

    $('section[id^="sampleinput"] pre.sampledata').each((_, el) => {
        inputs.push($(el).text().trim());
    });

    $('section[id^="sampleoutput"] pre.sampledata').each((_, el) => {
        outputs.push($(el).text().trim());
    });

    // 문제 통계 파싱
    const problemStats: ProblemStats = {
        timeLimit: $("#problem-info tbody tr td").eq(0).text().trim(),
        memoryLimit: $("#problem-info tbody tr td").eq(1).text().trim(),
        submissions: parseInt($("#problem-info tbody tr td").eq(2).text().replace(/,/g, ""), 10),
        correctSubmissions: parseInt($("#problem-info tbody tr td").eq(3).text().replace(/,/g, ""), 10),
        solvers: parseInt($("#problem-info tbody tr td").eq(4).text().replace(/,/g, ""), 10),
        correctRate: parseFloat(
            $("#problem-info tbody tr td").eq(5).text().replace("%", "").trim()
        ),
    };

    return {
        id,
        title,
        descriptions,
        inputs,
        outputs,
        DefaultTestCaseCount: inputs.length,
        problemStats,
    };
}

async function fetchProblemHtml(id: number) {
    const url = `${BASE_URL}${id}`;
    const response = await axios.get(url, {
        headers: {
            "User-Agent": USER_AGENT
        }
    });

    if (response.status === 202) {
        throw new Error('Failed to fetch problem');
    }

    return response.data;
}