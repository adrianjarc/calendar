import { Calendar } from './calendar';
import { describe } from 'node:test';
import { v4 } from 'uuid';

let calendar: Calendar;

const consoleSpy = jest.spyOn(console, 'log');
describe('Calendar', () => {
    beforeAll(() => {
        calendar = new Calendar();
    });

    test('Create event no duration or end date', () => {
        const id = calendar.createEvent(
            'Event',
            new Date('2023-03-01T00:00:00.000Z'),
            {},
        );

        expect(consoleSpy).toHaveBeenCalledWith(
            'You need to provide duration or end date',
        );
    });

    test('Create event with end date', () => {
        const id = calendar.createEvent(
            'Event',
            new Date('2023-03-01T00:00:00.000Z'),
            {
                endDate: new Date('2023-03-01T01:00:00.000Z'),
            },
        );

        expect(id).toBeDefined();
        expect(typeof id).toEqual('string');

        calendar.deleteEvent(id);
    });

    test('Create event start date after end date', () => {
        const id = calendar.createEvent(
            'Event',
            new Date('2023-03-01T04:00:00.000Z'),
            {
                endDate: new Date('2023-03-01T01:00:00.000Z'),
            },
        );

        expect(consoleSpy).toHaveBeenCalledWith(
            "Start date can't be after end date",
        );
    });

    test('Create event', () => {
        const id = calendar.createEvent(
            'Event',
            new Date('2023-03-01T00:00:00.000Z'),
            {
                duration: {
                    minute: 45,
                },
            },
        );

        expect(id).toBeDefined();
        expect(typeof id).toEqual('string');
    });

    test('Create overlapping event (allowOverlapping = false)', () => {
        const id = calendar.createEvent(
            'Overlapping',
            new Date('2023-03-01T00:00:00.000Z'),
            {
                duration: {
                    minute: 45,
                },
            },
        );

        expect(consoleSpy.mock.calls[0][0]).toContain(
            'This event overlaps with id',
        );
        expect(id).toBeUndefined();
    });

    test('Create overlapping event (allowOverlapping = true)', () => {
        const id = calendar.createEvent(
            'Overlapping',
            new Date('2023-03-01T00:00:00.000Z'),
            {
                duration: {
                    minute: 45,
                },
                allowOverlapping: true,
            },
        );

        expect(id).toBeDefined();
        expect(typeof id).toEqual('string');
    });

    test('Create non overlapping event', () => {
        const id = calendar.createEvent(
            'New Event',
            new Date('2023-03-02T00:00:00.000Z'),
            {
                duration: {
                    minute: 45,
                },
                allowOverlapping: true,
            },
        );

        expect(id).toBeDefined();
        expect(typeof id).toEqual('string');
    });

    test('List events (with events)', () => {
        const list = calendar.listEvents(
            new Date('2023-03-01T00:00:00.000Z'),
            new Date('2023-03-31T23:59:59.000Z'),
        );

        expect(list).toBeDefined();
        expect(list).toHaveLength(3);
    });

    test('List events (without events)', () => {
        const list = calendar.listEvents(
            new Date('2023-04-01T00:00:00.000Z'),
            new Date('2023-04-30T23:59:59.000Z'),
        );

        expect(list).toBeDefined();
        expect(list).toHaveLength(0);
    });

    test('List events start date after end date', () => {
        const list = calendar.listEvents(
            new Date('2023-05-01T00:00:00.000Z'),
            new Date('2023-04-30T23:59:59.000Z'),
        );

        expect(list).toBeDefined();
        expect(list).toHaveLength(0);
    });

    test('Update event', () => {
        const toUpdate = calendar.createEvent(
            'Update me',
            new Date('2023-06-01T07:00:00.000Z'),
            { duration: { minute: 30 } },
        );

        const updated = calendar.updateEvent(toUpdate, {
            title: 'Updated',
            startDate: new Date('2023-05-01T08:00:00.000Z'),
        });

        expect(updated).toBeDefined();
        expect(updated.startDate.toUTC().toISO()).toEqual(
            '2023-05-01T08:00:00.000Z',
        );
        expect(updated.title).toEqual('Updated');

        calendar.deleteEvent(updated.id);
    });

    test('Update event (overlap allowOverlapping = false)', () => {
        const toUpdate = calendar.createEvent(
            'Update me',
            new Date('2023-06-01T07:00:00.000Z'),
            { duration: { minute: 30 } },
        );

        const updated = calendar.updateEvent(toUpdate, {
            title: 'Updated',
            startDate: new Date('2023-03-02T00:00:00.000Z'),
        });

        expect(consoleSpy.mock.calls[0][0]).toContain(
            'This event overlaps with id',
        );
        expect(updated).toBeUndefined();

        calendar.deleteEvent(toUpdate);
    });

    test('Update event (overlap allowOverlapping = true)', () => {
        const toUpdate = calendar.createEvent(
            'Update me',
            new Date('2023-06-01T07:00:00.000Z'),
            { duration: { minute: 30 } },
        );

        const updated = calendar.updateEvent(
            toUpdate,
            {
                title: 'Updated',
                startDate: new Date('2023-03-02T00:00:00.000Z'),
            },
            {
                allowOverlapping: true,
            },
        );

        expect(updated).toBeDefined();
        expect(updated.startDate.toUTC().toISO()).toEqual(
            '2023-03-02T00:00:00.000Z',
        );
        expect(updated.title).toEqual('Updated');

        calendar.deleteEvent(updated.id);
    });

    test('Update event (event does not exist)', () => {
        const updated = calendar.updateEvent(v4(), {
            title: 'Updated',
            startDate: new Date('2023-03-02T00:00:00.000Z'),
        });

        expect(consoleSpy).toHaveBeenCalledWith('Event does not exist');
        expect(updated).toBeUndefined();
    });

    test('Delete event (event does not exist)', () => {
        calendar.deleteEvent(v4());

        expect(consoleSpy).toHaveBeenCalledWith('Event does not exist');
    });
});
