import Mood from "../models/Mood.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import { moodValidation } from "../middlewares/Validator.js";

export const getAllMoods = async (req, res, next) => {
  try {
    const {
      tag,
      startDate,
      endDate,
      visibility,
      page = 1,
      limit = 20,
    } = req.query;

    const skip = (page - 1) * limit;
    const filters = {};

    // Filter by tag (if provided)
    if (tag) filters.tags = { $in: [tag] };
    // if (req.query.tags) filters.tags = { $in: req.query.tags.split(',') };

    // Filter by date range (if provided)
    if (startDate && endDate) {
      filters.createdAt = {
        $gte: new Date(startDate), // start date
        $lte: new Date(endDate), // end date
      };
    }
    if (visibility) filters.visibility = visibility;

    // Total moods count for pagination
    const totalMoods = await Mood.countDocuments({});

    const moodsFeed = await Mood.find({ ...filters })
      .select("text tags createdAt likes comments")
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Add metadata to moods
    const enrichedFeed = moodsFeed.map((mood) => ({
      ...mood.toObject(),
      totalLikes: mood.likes.length,
      totalComments: mood.comments.length,
    }));

    res.json({
      status: "success",
      data: {
        moods: enrichedFeed,
        metadata: {
          totalMoods,
          page,
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMoodsByUser = async (req, res, next) => {
  try {
    const {
      tag,
      startDate,
      endDate,
      visibility,
      page = 1,
      pageSize = 20,
    } = req.query;
    const filters = {};

    // Filter by tag (if provided)
    if (tag) {
      filters.tags = { $in: [tag] };
    }

    // Filter by date range (if provided)
    if (startDate && endDate) {
      filters.createdAt = {
        $gte: new Date(startDate), // start date
        $lte: new Date(endDate), // end date
      };
    }
    if (visibility) {
      filters.visibility = visibility;
    }
    filters.user = req.user;

    const totalMoods = await Mood.countDocuments(filters);

    const moods = await Mood.find(filters)
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize))
      .sort({ createdAt: -1 })
      .populate("user", "username profilePicture");
    res.json({
      data: {
        moods,
      },
      pagination: {
        total: totalMoods,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(totalMoods / pageSize),
      },
      message: "Moods fetched successfully",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const getMoodFeeds = async (req, res, next) => {
  try {
    const {
      tag,
      startDate,
      endDate,
      visibility,
      page = 1,
      limit = 20,
    } = req.query;

    const skip = (page - 1) * limit;
    const filters = {};

    // Filter by tag (if provided)
    if (tag) filters.tags = { $in: [tag] };
    // if (req.query.tags) filters.tags = { $in: req.query.tags.split(',') };

    // Filter by date range (if provided)
    if (startDate && endDate) {
      filters.createdAt = {
        $gte: new Date(startDate), // start date
        $lte: new Date(endDate), // end date
      };
    }
    if (visibility) filters.visibility = visibility;

    const me = await User.findById(req.user).populate("following");

    if (!me) throw new Error("User not found");

    const followingIds = me.following.map((u) => u.id);

    // Total moods count for pagination
    const totalMoods = await Mood.countDocuments({
      user: { $in: followingIds },
    });

    const moodsFeed = await Mood.find({
      user: { $in: followingIds },
      ...filters,
    })
      .select("text tags createdAt likes comments")
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Add metadata to moods
    const enrichedFeed = moodsFeed.map((mood) => ({
      ...mood.toObject(),
      likedByUser: mood.likes.includes(req.user),
      totalLikes: mood.likes.length,
      totalComments: mood.comments.length,
    }));

    res.json({
      status: "success",
      data: {
        moods: enrichedFeed,
        metadata: {
          totalMoods,
          page,
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundMood = await Mood.findById(id);
    if (!foundMood) {
      return res.status(404).json({ message: "Mood not found" });
    }
    res.send(foundMood);
  } catch (error) {
    next(error);
  }
};

export const updateMood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Mood.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Mood not found" });
    }
    res.send(updated);
  } catch (error) {
    next(error);
  }
};
export const deleteMood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Mood.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Mood not found" });
    }
    res.send({ message: "Mood deleted", id: deleted.id });
  } catch (error) {
    next(error);
  }
};
export const createMood = async (req, res, next) => {
  try {
    // const {user, mood, note} = req.body
    const newMood = new Mood(req.body);
    newMood.user = req.user;
    await newMood.save();
    res.status(201).send(newMood);
  } catch (error) {
    next(error);
  }
};

export const like = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mood = await Mood.findById(id);

    if (!mood) throw new Error("Mood not found");
    await mood.toggleLike(req.user);

    res.json({
      status: "success",
      message: mood.likes.includes(req.user._id)
        ? "Mood liked"
        : "Mood unliked",
    });
  } catch (error) {
    next(error);
  }
};

//********************************************************* */
// 2. Combine Pagination with Total Count Efficiently
// Avoid running two queries (one for data and one for count) by using MongoDB’s facet for better performance:

// const results = await Mood.aggregate([
//     { $match: { user: { $in: followingIds } } },
//     {
//         $facet: {
//             metadata: [{ $count: 'totalMoods' }],
//             moods: [
//                 { $sort: { createdAt: -1 } },
//                 { $skip: skip },
//                 { $limit: limit },
//                 {
//                     $lookup: {
//                         from: 'users',
//                         localField: 'user',
//                         foreignField: '_id',
//                         as: 'user'
//                     }
//                 },
//                 { $unwind: '$user' },
//                 { $project: { 'user.password': 0 } }
//             ]
//         }
//     }
// ]);

// const moods = results[0].moods;
// const totalMoods = results[0].metadata[0]?.totalMoods || 0;

// res.json({
//     status: 'success',
//     data: {
//         moods,
//         metadata: { totalMoods, page, limit }
//     }
// });

//redis

// import redis from 'redis';
// const redisClient = redis.createClient();

// const cacheKey = `feed:${req.user._id}:page:${page}:limit:${limit}`;
// const cachedFeed = await redisClient.get(cacheKey);

// if (cachedFeed) {
//     return res.json(JSON.parse(cachedFeed));
// }

// const moodsFeed = await Mood.find({ user: { $in: followingIds }, ...filters })
//     .populate('user', 'username profilePicture')
//     .sort(sortOrder)
//     .skip(skip)
//     .limit(limit);

// redisClient.setex(cacheKey, 3600, JSON.stringify({ moods: moodsFeed, metadata }));
