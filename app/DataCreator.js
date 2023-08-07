const firstNames = [
  'Nancy',
  'Andrew',
  'Janet',
  'Margaret',
  'Steven',
  'Michael',
  'Robert',
  'Laura',
  'Anne',
  'Nige',
];

const lastNames = [
  'Davolio',
  'Fuller',
  'Leverling',
  'Peacock',
  'Buchanan',
  'Suyama',
  'King',
  'Callahan',
  'Dodsworth',
  'White',
];

const cities = [
  'Seattle',
  'Tacoma',
  'Kirkland',
  'Redmond',
  'London',
  'Philadelphia',
  'New York',
  'Seattle',
  'London',
  'Boston',
];

const titles = [
  'Accountant',
  'Vice President, Sales',
  'Sales Representative',
  'Technical Support',
  'Sales Manager',
  'Web Designer',
  'Software Developer',
];

export default class DataCreator {
  static createUser(index) {
    return {
      id: `id_${index + 1}`,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      index,
    };
  }

  static createRandomData(length, startIndex = 0) {
    return Array(length)
      .fill({})
      .map((_, index) => DataCreator.createUser(startIndex + index));
  }
}
