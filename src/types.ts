export interface IRank {
    scores: [number, number]
    icon: string
    name: string
    description: string
}

export interface ITest {
    title: string
    description?: string
    subtitle?: string
    score_unit?: string
    questions: string[]
    ranks: IRank[]
}

export interface IResult {
    checkboxes: string[]
}

export type ICalculateScore = (test: ITest, result: IResult) => number
