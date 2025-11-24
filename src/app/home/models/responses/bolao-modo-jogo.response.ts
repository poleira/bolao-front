export class ModoJogoResponse {
    id: number | null;
    nomeModoJogo: string | null;

    constructor(params: Partial<ModoJogoResponse>) {
        this.id = params.id ?? null;
        this.nomeModoJogo = params.nomeModoJogo ?? null;
    }
}