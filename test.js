const now = new Date(Date.now());
now.setHours(now.getHours() - 2);

const targetDate = now.toISOString().split('T')[0];
const currentHour = now.toTimeString().split(' ')[0];

const doctors = [
    {
        name: 'Bruno',
        date: '2024-12-11 00:00:00.000',
        startTime: '19:00:00',
        endTime: '07:00:00',
    },
    {
        name: 'Ivan',
        date: '2024-12-12 00:00:00.000',
        startTime: '07:00:00',
        endTime: '13:00:00',
    },
]

console.log(currentHour);



