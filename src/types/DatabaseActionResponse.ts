export class DatabaseActionResponse {
    status: string;
    message: string;
    itemId: number|undefined;

    constructor(success: boolean, message: string, id: number|undefined) {
        this.status = success ? "OK" : "ERR";
        this.message = message;
        this.itemId = id;
    }
}

