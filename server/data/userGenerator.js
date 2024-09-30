const { faker } = require('@faker-js/faker');
const seedrandom = require('seedrandom');
const { v4: uuidv4 } = require('uuid');

const generateUserData = (region, errors, seed, count) => {
  const data = [];
  const rng = seedrandom(seed);

  for (let i = 0; i < count; i++) {
    let user = {
      id: uuidv4(), 
      name: generateName(region, rng),
      address: generateAddress(region, rng),
      phone: generatePhone(region, rng)
    };

    user = applyErrors(user, errors, rng);
    data.push(user);
  }
  
  return data;
};

const generateName = (region, rng) => {
  return `${faker.person.firstName()} ${faker.person.lastName()}`;
};

const generateAddress = (region, rng) => {
  return `${faker.location.streetAddress()}, ${faker.location.city()}`;
};

const generatePhone = (region, rng) => {
  return faker.phone.number();
};

const applyErrors = (user, errorCount, rng) => {
  for (let i = 0; i < errorCount; i++) {
    const errorType = Math.floor(rng() * 3);
    const field = rng() < 0.5 ? 'name' : (rng() < 0.5 ? 'address' : 'phone');
    
    switch (errorType) {
      case 0:
        user[field] = deleteCharacter(user[field], rng);
        break;
      case 1:
        user[field] = addRandomCharacter(user[field], rng);
        break;
      case 2:
        user[field] = swapCharacters(user[field], rng);
        break;
    }
  }
  return user;
};

const deleteCharacter = (str, rng) => {
  const index = Math.floor(rng() * str.length);
  return str.slice(0, index) + str.slice(index + 1);
};

const addRandomCharacter = (str, rng) => {
  const char = String.fromCharCode(Math.floor(rng() * 26) + 97);
  const index = Math.floor(rng() * (str.length + 1));
  return str.slice(0, index) + char + str.slice(index);
};

const swapCharacters = (str, rng) => {
  if (str.length < 2) return str;
  const index = Math.floor(rng() * (str.length - 1));
  const swapped = str.split('');
  [swapped[index], swapped[index + 1]] = [swapped[index + 1], swapped[index]];
  return swapped.join('');
};

module.exports = { generateUserData };
