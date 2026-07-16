const express = require("express");
const axios = require("axios");
const Prediction = require("../models/prediction");
const  isAuthenticated  = require("../middlewares/isAuthenticated");

const router = express.Router();

const FASTAPI_URL = process.env.FASTAPI_URL;

// Diabetes
router.post("/diabetes", isAuthenticated, async (req, res) => {
    try {
        const response = await axios.post(
            `${FASTAPI_URL}/diabetes`,
            req.body
        );

        const prediction = await Prediction.create({
            user: req.user._id,
            disease: "diabetes",
            input: req.body,
            prediction: response.data.prediction,
            confidence: response.data.confidence,
        });

        res.status(200).json({
            success: true,
            prediction,
        });

    } catch (error) {
    console.log("========= ERROR =========");
    console.log(error.message);

    if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
    }

    console.log(error.stack);

    res.status(500).json({
        success: false,
        message: error.message,
    });
}
});

// Heart
router.post("/heart", isAuthenticated, async (req, res) => {
    try {
        console.log("Received body:");
        console.log(req.body);
        const response = await axios.post(
            `${FASTAPI_URL}/heart`,
            req.body
        );

        const prediction = await Prediction.create({
            user: req.user._id,
            disease: "heart",
            input: req.body,
            prediction: response.data.prediction,
            confidence: response.data.confidence,
        });

        res.status(200).json({
            success: true,
            prediction,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Kidney
router.post("/kidney", isAuthenticated, async (req, res) => {
    try {
        console.log(req.body)
        const response = await axios.post(
            `${FASTAPI_URL}/kidney`,
            req.body
        );

        const prediction = await Prediction.create({
            user: req.user._id,
            disease: "kidney",
            input: req.body,
            prediction: response.data.prediction,
            confidence: response.data.confidence,
        });

        res.status(200).json({
            success: true,
            prediction,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Liver
router.post("/liver", isAuthenticated, async (req, res) => {
    try {
        console.log(req.body)
        const response = await axios.post(
            `${FASTAPI_URL}/liver`,
            req.body
        );
        
        const prediction = await Prediction.create({
            user: req.user._id,
            disease: "liver",
            input: req.body,
            prediction: response.data.prediction,
            confidence: response.data.confidence,
        });

        res.status(200).json({
            success: true,
            prediction,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Prediction History
router.get("/history", isAuthenticated, async (req, res) => {
    try {
        const history = await Prediction.find({
        user: req.user._id
    })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

    res.json({
        success: true,
        history
    });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;