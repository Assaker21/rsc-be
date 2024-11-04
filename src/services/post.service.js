const prisma = require("../utils/prismaClient");

async function getPost(prismaQuery) {
  prismaQuery.where = { ...prismaQuery.where, isActive: true };

  return await prisma.post.findUnique(prismaQuery);
}

async function getPosts(prismaQuery) {
  prismaQuery.where = { ...prismaQuery.where, isActive: true };

  return await prisma.post.findMany(prismaQuery);
}

async function createPost(data, include, select) {
  const prismaQuery = { data };
  if (include) prismaQuery.include = include;
  if (select) prismaQuery.select = select;

  return await prisma.post.create(prismaQuery);
}

async function updatePost(prismaQuery) {
  prismaQuery.where = { ...prismaQuery.where, isActive: true };
  return await prisma.post.update(prismaQuery);
}

module.exports = {
  getPost,
  getPosts,
  createPost,
  updatePost,
};
