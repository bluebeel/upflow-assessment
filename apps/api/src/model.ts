const faker = require('faker');
import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize({
  // The `host` parameter is required for other databases
  // host: 'localhost'
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export const Invoice = sequelize.define(
  'invoices',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    customer: DataTypes.STRING,
    status: DataTypes.STRING,
    due: DataTypes.DATE,
    amount: DataTypes.FLOAT,
    currency: DataTypes.STRING,
  },
  {
    indexes: [
      {
        fields: ['customer'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['due'],
      },
    ],
  }
);
/* 
(async function () {
  await sequelize.sync({ force: true });
  const items = ['Unsent', 'Paid', 'Due', 'Overdue'];

  const output = [];
  for (let i = 0; i < 100000; i++) {
    output.push({
      customer: faker.name.firstName(),
      status: items[Math.floor(Math.random() * items.length)],
      due: faker.date.past(),
      amount: faker.finance.amount(),
      currency: faker.finance.currencyCode(),
    });
  }

  await Invoice.bulkCreate(output);
  console.log(`Database seeded!`);
})(); */
