"use strict";
//var Dirty = require('dirty');
//
//var db = new Dirty('user.db');
//
//db.on('load', function () {
//    db.set('john', { eyes: 'blue' });
//    console.log('Added john, he has %s eyes.', db.get('john').eyes);
//
//    db.set('bob', { eyes: 'brown' }, function () {
//        console.log('User bob is now saved on disk.')
//    });
//
//    db.forEach(function (key, val) {
//        console.log('Found key: %s, val: %j', key, val);
//    });
//});
//db.on('drain', function () {
//    console.log('All records are saved on disk now.');
//});
