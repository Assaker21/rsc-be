function prismaRecursive(level, func) {
  if (level === 0) {
    return func(false);
  }
  return func(prismaRecursive(level - 1, func));
}

module.exports = prismaRecursive;
