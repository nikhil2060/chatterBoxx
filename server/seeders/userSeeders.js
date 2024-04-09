const User = require("../model/userModel");
const { faker } = require("@faker-js/faker");

const createUser = async (numUsers) => {
  try {
    const userPromise = [];

    for (let i = 0; i < numUsers; i++) {
      const userTemplate = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        bio: faker.lorem.sentence(10),
        password: "password",
        email: faker.internet.email(),
        avatar: {
          public_id: faker.system.fileName(),
          url: faker.image.avatar(),
        },
      });

      userPromise.push(userTemplate);
    }

    await Promise.all(userPromise);
  } catch (error) {}
};

module.exports = createUser;
