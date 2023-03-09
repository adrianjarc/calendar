import { Event } from './event';
import { DateTime, Duration, DurationLike, Interval } from 'luxon';

export class Calendar {
    private readonly _events: Event[];

    constructor() {
        this._events = [];
    }

    private calculateDuration(
        startDate: DateTime,
        options: { duration?: DurationLike; endDate?: DateTime },
    ): Duration {
        if (
            Object.entries(options).filter((entry) => entry[1] !== undefined)
                .length === 0
        ) {
            throw new Error('You need to provide duration or end date');
        }

        let duration;

        if (!options.duration) {
            if (startDate > options.endDate) {
                throw new Error("Start date can't be after end date");
            }

            duration = options.endDate.diff(startDate);
        } else {
            duration = Duration.fromDurationLike(options.duration);
        }

        return duration;
    }

    private checkOverlapping(
        startDate: DateTime,
        endDate: DateTime,
        allow: boolean = false,
    ): void {
        if (!allow) {
            const overlapping = this._events.find((event) => {
                const interval = Interval.fromDateTimes(
                    event.startDate,
                    event.endDate,
                );
                return (
                    interval.contains(startDate) || interval.contains(endDate)
                );
            });

            if (overlapping) {
                throw new Error(
                    `This event overlaps with id ${overlapping.id}`,
                );
            }
        }
    }

    private addEvent(event: Event, allowOverlapping: boolean = false): void {
        this.checkOverlapping(event.startDate, event.endDate, allowOverlapping);
        this._events.push(event);

        this._events.sort((a, b) =>
            a.startDate.diff(b.startDate).as('milliseconds'),
        );
    }

    private getEventIndexById(id: string): number {
        const index = this._events.findIndex((event) => event.id === id);

        if (index === -1) {
            throw new Error('Event does not exist');
        }

        return index;
    }

    createEvent(
        title: string,
        startDate: Date,
        options: {
            duration?: DurationLike;
            endDate?: Date;
            allowOverlapping?: boolean;
        } = {},
    ): string {
        try {
            const start = DateTime.fromJSDate(startDate);

            const duration = this.calculateDuration(start, {
                duration: options.duration,
                endDate: options.endDate
                    ? DateTime.fromJSDate(options.endDate)
                    : undefined,
            });

            const event = new Event(start, duration, title);

            this.addEvent(event, options.allowOverlapping);

            return event.id;
        } catch (e) {
            console.log(e.message);
        }
    }

    listEvents(startDate: Date, endDate: Date): Event[] {
        const start = DateTime.fromJSDate(startDate);
        const end = DateTime.fromJSDate(endDate);

        if (start > end) {
            console.log("Start date can't be after end date");
            return [];
        } else {
            const interval = Interval.fromDateTimes(start, end);

            return this._events.filter((event) => {
                return (
                    interval.contains(event.startDate) ||
                    interval.contains(event.endDate)
                );
            });
        }
    }

    updateEvent(
        id: string,
        update: {
            startDate?: Date;
            title?: string;
            duration?: DurationLike;
        },
        options: { allowOverlapping?: boolean } = {},
    ): Event {
        try {
            const index = this.getEventIndexById(id);

            const event = this._events.splice(index, 1)[0];

            if (update.title) {
                event.title = update.title;
            }

            if (update.startDate) {
                event.startDate = DateTime.fromJSDate(update.startDate);
            }

            if (update.duration) {
                event.duration = Duration.fromDurationLike(update.duration);
            }

            this.addEvent(event, options.allowOverlapping);

            return event;
        } catch (e) {
            console.log(e.message);
        }
    }

    deleteEvent(id: string): void {
        try {
            const index = this.getEventIndexById(id);

            this._events.splice(index, 1);
        } catch (e) {
            console.log(e.message);
        }
    }
}
