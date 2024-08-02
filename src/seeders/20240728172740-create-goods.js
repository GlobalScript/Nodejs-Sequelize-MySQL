'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('goods', [
      // Dishes
      {
        title: 'Spaghetti Carbonara',
        price: 12.95,
        finalPrice: 11.95,
        discount: 1,
        description: 'Classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.',
        image: 'carbonara.jpg',
        category: 'dishes',
        popular: true,
        isNew: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Sushi',
        price: 15.95,
        finalPrice: 14.95,
        discount: 1,
        description: 'Traditional Japanese dish consisting of vinegared rice, seafood, and vegetables.',
        image: 'sushi.jpg',
        category: 'dishes',
        popular: true,
        isNew: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Tacos',
        price: 10.95,
        finalPrice: 9.95,
        discount: 1,
        description: 'Mexican dish made with folded tortillas filled with meat, cheese, and various toppings.',
        image: 'tacos.jpg',
        category: 'dishes',
        popular: true,
        isNew: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Drinks
      {
        title: 'Coca-Cola',
        price: 2.95,
        finalPrice: 2.95,
        discount: 0,
        description: 'Popular carbonated soft drink known worldwide for its refreshing taste.',
        image: 'coca_cola.jpg',
        category: 'drinks',
        popular: true,
        isNew: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Green Tea',
        price: 3.95,
        finalPrice: 3.95,
        discount: 0,
        description: 'Healthy and refreshing beverage with a delicate taste, enjoyed hot or cold.',
        image: 'green_tea.jpg',
        category: 'drinks',
        popular: false,
        isNew: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Espresso',
        price: 4.95,
        finalPrice: 4.95,
        discount: 0,
        description: 'Strong and rich coffee shot, a staple in Italian cafes and around the world.',
        image: 'espresso.jpg',
        category: 'drinks',
        popular: true,
        isNew: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Desserts
      {
        title: 'Cheesecake',
        price: 7.95,
        finalPrice: 7.95,
        discount: 0,
        description: 'Creamy dessert made with cream cheese, sugar, and a graham cracker crust.',
        image: 'cheesecake.jpg',
        category: 'desserts',
        popular: true,
        isNew: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Tiramisu',
        price: 8.95,
        finalPrice: 8.95,
        discount: 0,
        description: 'Italian dessert made of layers of coffee-soaked ladyfingers, mascarpone cheese, and cocoa.',
        image: 'tiramisu.jpg',
        category: 'desserts',
        popular: true,
        isNew: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Chocolate Lava Cake',
        price: 6.95,
        finalPrice: 6.95,
        discount: 0,
        description: 'Decadent chocolate cake with a gooey molten center, served warm.',
        image: 'lava_cake.jpg',
        category: 'desserts',
        popular: true,
        isNew: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('goods', null, {});
  }
};
