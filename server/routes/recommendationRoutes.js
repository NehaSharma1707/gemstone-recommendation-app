const express = require("express");
const Recommendation = require("../models/Recommendation");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      name,
      zodiac,
      concern,
      budget,
      budgetRange,
      gemstone,
      reason,
      concernReason,
      metal,
      wearingDay,
      date,
    } = req.body;

    if (!name || !zodiac || !concern || !gemstone) {
      return res.status(400).json({
        message: "Name, zodiac, concern, and gemstone are required",
      });
    }

    const recommendation = new Recommendation({
      name,
      zodiac,
      concern,
      budget,
      budgetRange,
      gemstone,
      reason,
      concernReason,
      metal,
      wearingDay,
      date,
    });

    const savedRecommendation = await recommendation.save();

    res.status(201).json({
      message: "Recommendation saved successfully",
      data: savedRecommendation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const recommendations = await Recommendation.find().sort({ createdAt: -1 });
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedRecommendation = await Recommendation.findByIdAndDelete(
      req.params.id
    );

    if (!deletedRecommendation) {
      return res.status(404).json({
        message: "Recommendation not found",
      });
    }

    res.status(200).json({
      message: "Recommendation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Recommendation.deleteMany({});
    res.status(200).json({
      message: "All recommendations deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;