# Calendar

This is a simple implementation of calendar. It stores all events in memory.

This implementation uses [Luxon](https://moment.github.io/luxon/) as internal time and date parsing library. So types prepended with `luxon.` refer to types inside this library.

## Usage
 
### Install with command: 

npm: `npm i calendar`

yarn: `yarn add calendar`

### API

To get calendar in your application use it as global variable like this:

Typescript: 
```typescript
import { Calendar } from 'calendar';

const calendar = new Calendar();
```

Javascript:
```javascript
const { Calendar } = require('calendar');

const calendar = new Calendar();
```

#### Create event

To create new event you call a function `createEvent`.

This function takes the following parameters:

| name        | type                                      | description                        | default | required |
|-------------|-------------------------------------------|------------------------------------|---------|----------|
| `title`     | `string`                                  | Title of the event                 |         | yes      |
| `startDate` | `Date`                                    | Start date and time of event       |         | yes      |
| `options`   | `{ duration, endDate, allowOverlapping }` | Additional configuration for event | `{}`    | yes      |

`options` parameter:

In options one of `duration` or `endDate` is required. If both are present, only duration will be taken into account.

| name               | type                 | description                            | default | required             |
|--------------------|----------------------|----------------------------------------|---------|----------------------|
| `duration`         | `luxon.DurationLike` | Duration of the event                  |         | yes if no `endDate`  |
| `endDate`          | `Date`               | End date and time of event             |         | yes if no `duration` |
| `allowOverlapping` | `boolean`            | Do you want to allow events to overlap | `false` | no                   |

this function returns `string` representing id of an event.

Example call:
```typescript
calendar.createEvent(
    'Title',
    new Date(),
    {
        duration: {
            minutes: 45,
        },
    },
)
```

#### Update event

To update event you call the function `updateEvent`.

This function takes the following parameters:

| name      | type                             | description                            | default | required |
|-----------|----------------------------------|----------------------------------------|---------|----------|
| `id`      | `string`                         | Id of the event you want to update     |         | yes      |
| `update`  | `{ title, startDate, duration }` | Which properties do you want to update |         | yes      |
| `options` | `{ allowOverlapping }`           | Additional configuration for event     | `{}`    | no       |

`update` parameter: 

| name        | type                 | description                                                       | default | required |
|-------------|----------------------|-------------------------------------------------------------------|---------|----------|
| `title`     | `string`             | If you want to change the title of event, include this parameter  |         | no       |
| `startDate` | `Date`               | If you want to change start date of event, include this parameter |         | no       |
| `duration`  | `luxon.DurationLike` | If you want to change duration of event, include this parameter   |         | no       |

on updating event `endDate` is automatically calculated based on `startDate` and `duration`.

`options` parameter:

| name               | type      | description                            | default | required |
|--------------------|-----------|----------------------------------------|---------|----------|
| `allowOverlapping` | `boolean` | Do you want to allow events to overlap | `false` | no       |

this function returns `Event` representing updated event

Example call:
```typescript
calendar.updateEvent(
    'uuid',
    {
        title: 'New title',
    },
)
```

#### List events

To list events inside time range you call the function `listEvents`.

This function takes the following parameters:

| name        | type   | description                      | default | required |
|-------------|--------|----------------------------------|---------|----------|
| `startDate` | `Date` | Date on which to start the range |         | yes      |
| `endDate`   | `Date` | Date on which to end the range   |         | yes      |

this function returns `Event[]` representing all events inside selected range.

Example call:
```typescript
calendar.listEvents(
    new Date('2023-03-01T00:00:00.000Z'),
    new Date('2023-03-31T23:59:59.999Z')
)
```

#### Delete event

To delete an event you call the function `deleteEvent`.

This function takes the following parameters:

| name | type     | description                    | default | required |
|------|----------|--------------------------------|---------|----------|
| `id` | `string` | Id of event you want to delete |         | yes      |

this function does not return anything.

Example call: 
```typescript
calendar.deleteEvent('uuid')
```
