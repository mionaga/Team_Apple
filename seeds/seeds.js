const mongoose = require('mongoose');
const Travel = require('../models/travels');
const cities = require('./cities');
const { descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/teamApple', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFinsAndModify: false
})
.then(() => {
    console.log('mongodbコネクションok!!!!');
})
.catch(err => {
    console.log('mongodbコネクションエラー!!!!!');
    console.log(err);
});

const description = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Travel.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const randamCityIndex = Math.floor(Math.random() * cities.length);
        const travel = new Travel({
            location: `${cities[randamCityIndex].prefecture}${cities[randamCityIndex].city}`,
            title: `${description(descriptors)}`
        })
        await travel.save();
     }
}

seedDB().then(() => {
    mongoose.connection.close();
});