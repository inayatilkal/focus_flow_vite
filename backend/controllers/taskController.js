const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// GET ALL TASKS
const getTasks = async (req, res) => {
  try {

    const db = getDB();

    // Delete expired tasks

    await db.collection("tasks").deleteMany({
    completed: false,
    expiresAt: {
        $ne: null,
        $lte: new Date(),
    },
});

    const tasks = await db
      .collection("tasks")
      .find({
        userId: req.user.id
      })
      .sort({
        completed: 1,
        expiresAt: 1
      })
      .toArray();

    res.status(200).json(tasks);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch tasks"
    });

  }
};

// ADD TASK
const addTask = async (req, res) => {
  try {
    const {
      content,
      priority,
      expiresAt
    } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Task content is required"
      });
    }

    const db = getDB();

    const task = {
      content,
      completed: false,

      priority: priority || "Medium",

      expiresAt: expiresAt
        ? new Date(expiresAt)
        : null,

      createdAt: new Date(),

      updatedAt: new Date(),

      userId: req.user.id
    };

    const result =
      await db.collection("tasks")
      .insertOne(task);

    res.status(201).json({
      success: true,
      insertedId: result.insertedId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create task"
    });

  }
};

// TOGGLE COMPLETE
const updateTask = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      content,
      completed,
      priority,
      expiresAt
    } = req.body;

    const updateData = {
      updatedAt: new Date()
    };

    if (content !== undefined)
      updateData.content = content;

    if (completed !== undefined)
      updateData.completed = completed;

    if (priority !== undefined)
      updateData.priority = priority;

    if (expiresAt !== undefined)
      updateData.expiresAt =
        expiresAt
          ? new Date(expiresAt)
          : null;

    const db = getDB();

    await db.collection("tasks")
      .updateOne(

        {
          _id: new ObjectId(id),
          userId: req.user.id
        },

        {
          $set: updateData
        }

      );

    res.json({
      success: true,
      message: "Task Updated"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Update Failed"
    });

  }

};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const db = getDB();

    await db.collection("tasks").deleteOne({
      _id: new ObjectId(id),
      userId: req.user.id,
    });

    res.status(200).json({
      message: "Task deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete task",
    });
  }
};

module.exports = {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
};
