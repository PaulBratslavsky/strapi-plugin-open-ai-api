// @ts-nocheck
'use strict';
const setting = require('./setting/schema.json');
const embedding = require('./embedding/schema.json');

module.exports ={
    setting: { schema: setting },
    embedding: { schema: embedding },
}