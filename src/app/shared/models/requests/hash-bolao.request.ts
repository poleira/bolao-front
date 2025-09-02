export class HashBolaoRequest {

    HashBolao: string = '';

    constructor(params: Partial<HashBolaoRequest>) {
        this.HashBolao = params.HashBolao || '';
    }
}