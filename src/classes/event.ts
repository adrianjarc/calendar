import { Duration, DateTime } from 'luxon';
import { v4 } from 'uuid';
import { EventInterface } from '../interfaces';

export class Event {
    private readonly _id: string;
    private _duration: Duration;
    private _title: string;
    private _startDate: DateTime;
    private _endDate: DateTime;

    constructor(startDate: DateTime, duration: Duration, title: string) {
        this._id = v4();
        this._startDate = startDate;
        this._duration = duration;
        this._title = title;
        this._endDate = this._startDate.plus(this._duration);
    }

    get id(): string {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    set title(title: string) {
        this._title = title;
    }

    get duration(): Duration {
        return this._duration;
    }

    set duration(duration: Duration) {
        this._duration = duration;

        this._endDate = this._startDate.plus(this._duration);
    }

    get startDate(): DateTime {
        return this._startDate;
    }

    set startDate(date: DateTime) {
        this._startDate = date;

        this._endDate = this._startDate.plus(this._duration);
    }

    get endDate(): DateTime {
        return this._endDate;
    }

    get event(): EventInterface {
        return {
            id: this._id,
            title: this._title,
            duration: this._duration.toISOTime(),
            startDate: this._startDate.toISO(),
            endDate: this._endDate.toISO(),
        };
    }
}
