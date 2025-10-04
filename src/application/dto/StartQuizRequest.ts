export class StartQuizRequest {
  constructor(
    public readonly level: string,
    public readonly questionCount: number
  ) {}
}
