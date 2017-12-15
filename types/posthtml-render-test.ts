import render = require('../');

const re: string = render({}, {
    singleTags: ['img'],
    closingSingleTag: 'slash'
});
