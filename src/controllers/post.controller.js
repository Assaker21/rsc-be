const postServices = require("../services/post.service");
const prismaRecursive = require("../utils/prismaRecursive");

async function createPost(req, res, next) {
  try {
    const newPost = { ...req.body, user: { connect: { id: req.user.id } } };
    if (req.query.event) {
      newPost.event = {
        create: {
          statusId: 1,
        },
      };
    }
    await postServices.createPost(newPost);
    if (req.body.parentPostId) {
      req.params.id = req.body.parentPostId;
      await getPost(req, res, next);
    } else {
      await getPosts(req, res, next);
    }
  } catch (err) {
    next(err);
  }
}

async function getPosts(req, res, next) {
  try {
    const prismaQuery = {
      where: {
        parentPostId: null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            posts: true,
            postInteractions: {
              where: {
                type: "like",
              },
            },
          },
        },
        event: {
          select: {
            status: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    };

    console.log("req.query.event: ", req.query.event);

    if (req.query.event == "event") {
      prismaQuery.where.NOT = { eventId: null };
      prismaQuery.select.event = {
        select: {
          status: {
            select: {
              id: true,
              description: true,
            },
          },
        },
      };
    } else {
      prismaQuery.where.eventId = null;
    }

    console.log("Prisma query: ", prismaQuery);

    const likePosts = await postServices.getPosts(prismaQuery);
    if (req.user?.id) {
      var likedPosts = await postServices.getPosts({
        where: {
          postInteractions: {
            some: {
              type: "like",
              userId: req.user.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
    }

    var posts = likePosts.map((post) => {
      return {
        id: post.id,
        title: post.title,
        description: post.description,
        user: post.user,
        createdAt: post.createdAt,
        posts: post._count.posts,
        event: post.event,
        postInteractions: {
          like: post._count.postInteractions,
          liked: req.user?.id
            ? likedPosts.findIndex((p) => p.id === post.id) !== -1
            : false,
        },
      };
    });

    res.status(200).send(posts);
  } catch (err) {
    next(err);
  }
}

async function getPost(req, res, next) {
  try {
    const prismaQuery = {
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        title: true,
        description: true,
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        posts: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            description: true,
            user: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
            _count: {
              select: {
                postInteractions: {
                  where: {
                    type: "like",
                  },
                },
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            posts: true,
            postInteractions: {
              where: {
                type: "like",
              },
            },
          },
        },
        event: {
          select: {
            status: true,
          },
        },
        createdAt: true,
      },
    };

    const post = await postServices.getPost(prismaQuery);
    if (req.user?.id) {
      const orStatement = [
        ...post.posts.map((post) => {
          return { id: post.id };
        }),
        { id: post.id },
      ];

      var likedPosts = (
        await postServices.getPosts({
          where: {
            OR: orStatement,
            postInteractions: {
              some: {
                type: "like",
                userId: req.user.id,
              },
            },
          },
          select: {
            id: true,
          },
        })
      ).map(({ id }) => id);
    }

    post.postInteractions = {
      like: post._count.postInteractions,
      liked: likedPosts?.includes(post.id) ? true : false,
    };

    for (var i = 0; i < post.posts.length; i++) {
      post.posts[i].postInteractions = {
        like: post.posts[i]._count.postInteractions,
        liked: likedPosts?.includes(post.posts[i].id) ? true : false,
      };
    }

    console.log("Post: ", post);

    res.status(200).send(post);
  } catch (err) {
    next(err);
  }
}

async function uploadImage(req, res, next) {
  try {
    console.log("PATH: ", req.file.path);
    res.status(200).send(req.file.path.replaceAll("\\", "/"));
  } catch (err) {
    next(err);
  }
}

async function addInteraction(req, res, next) {
  try {
    const { id, type } = req.params;
    switch (type) {
      case "like":
        const prismaQuery = {
          where: { id: Number(id) },
          data: { postInteractions: {} },
        };

        if (req.body.like === true) {
          prismaQuery.data.postInteractions.create = {
            type: "like",
            userId: req.user.id,
          };
        } else if (req.body.like === false) {
          prismaQuery.data.postInteractions.deleteMany = {
            type: "like",
            userId: req.user.id,
          };
        }
        await postServices.updatePost(prismaQuery);

        res.status(200).send("Updated successfully");

        break;
      default:
        throw new Error("Something broke!");
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { createPost, getPosts, getPost, uploadImage, addInteraction };
