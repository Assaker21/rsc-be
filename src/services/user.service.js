const prisma = require("../utils/prismaClient");

async function getUser(where, include) {
  return await prisma.user.findFirst({
    where: { isActive: true, ...where },
    include,
  });
}

async function getUsers(where, include) {
  return await prisma.user.findMany({
    where: { isActive: true, ...where },
    include,
  });
}

async function createUser(data) {
  return await prisma.user.create({
    data,
  });
}

async function updateUser(where, include, data) {
  return await prisma.user.updateMany({
    where: { isActive: true, ...where },
    include,
    data,
  });
}

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
};
