export class DatabaseActionResponse {
    status: string;
    message: string;

    constructor(success: boolean, message: string) {
        this.status = success ? "OK" : "ERR";
        this.message = message;
    }
}

