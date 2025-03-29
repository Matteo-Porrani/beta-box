type NotifType = "ERROR" | "WARNING" | "SUCCESS" | "INFO"


export class AppNotification {
    id: number
    status: NotifType
    message: string
    duration: number

    constructor(
        status: NotifType,
        message: string,
        duration = 3000,
    ) {
        this.id = new Date().getTime();
        this.status = status;
        this.message = message;
        this.duration = duration;
    }

    getIcon() {
        return {
            ERROR: "error",
            INFO: "info",
            WARNING: "alert",
            SUCCESS: "success",
        }[this.status]
    }

    getTextColorClass() {
        return {
            INFO: "text-stone-400",
            WARNING: "text-yellow-400",
            SUCCESS: "text-lime-600",
            ERROR: "text-rose-700",
        }[this.status]
    }
}
