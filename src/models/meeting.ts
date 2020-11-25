export default class Meeting {
    name: string
    reminderRingtone: string
    ringtone: string
    private duration: number
    private reminder: number
    private onRemind: (_this: Meeting) => void = _ => { }
    private onDue: (_this: Meeting) => void = _ => { }
    private t1: NodeJS.Timeout | undefined
    private t2: NodeJS.Timeout | undefined

    constructor(
        name: string,
        duration: number,
        reminder: number,
        reminderRingtone: string,
        ringtone: string) {
        this.name = name;
        this.duration = duration;
        this.reminder = reminder;
        this.reminderRingtone = reminderRingtone;
        this.ringtone = ringtone;
    }

    on(event: "remind" | "due", callback: (_this: Meeting) => void) {
        switch (event) {
            case "remind":
                this.onRemind = callback;
                break;
            case "due":
                this.onDue = callback;
                break;
        }
    }

    start(): void {
        if (this.reminder > 0) {
            this.t1 = setTimeout(() => {
                this.onRemind(this);
                this.t2 = setTimeout(() => {
                    this.onDue(this);
                }, this.reminder * 1000);
            }, (this.duration - this.reminder) * 1000);
        } else {
            this.t1 = setTimeout(() => {
                this.onDue(this);
            }, this.duration * 1000);
        }
    }

    stop(): void {
        if (this.t1 !== undefined) clearTimeout(this.t1);
        if (this.t2 !== undefined) clearTimeout(this.t2);
    }
}