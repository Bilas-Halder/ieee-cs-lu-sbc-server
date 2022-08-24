const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const executiveCommitteeSchema = require("../schemas/executiveCommitteeSchema");
const memberSchema = require("../schemas/memberSchema");

const ExecutiveCommittee = mongoose.model(
  "ExecutiveCommittee",
  executiveCommitteeSchema
);

const Member = mongoose.model("Member", memberSchema);

router.get("/:year", async (req, res) => {
  try {
    const year = req.params?.year;
    const committee = await ExecutiveCommittee.findOne({ year: year });
    const data = committee.data;
    data.sort((a, b) => (a.priority < b.priority ? -1 : 1));

    const response = await Promise.all(
      data.map(async (data) => {
        const mID = data.mID;

        const mem = await Member.findOne({ _id: mID });

        const memObj = {
          ...mem?.toObject(),
          designation: data.des,
          priority: data.priority,
          period: committee.period,
          year: committee.year,
        };

        return memObj;
      })
    );

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/:year/dummy", async (req, res) => {
  try {
    const year = req.params?.year;
    const committee = await ExecutiveCommittee.findOne({ year: year });
    const data = committee.data;
    data.sort((a, b) => (a.priority < b.priority ? -1 : 1));

    const response = await Promise.all(
      data.map(async (data) => {
        const mID = data.mID;

        const mem = await Member.findOne({ _id: mID });

        const memObj = {
          ...mem?.toObject(),
          designation: data.des,
          priority: data.priority,
          period: committee.period,
          year: committee.year,
        };

        return memObj;
      })
    );

    const dummy = [
      ...response,
      ...response,
      ...response,
      ...response,
      ...response,
      ...response,
      ...response,
      ...response,
      ...response,
      ...response,
    ];

    res.status(200).json(dummy);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/:year/dummy/search/:searchTerm", async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;

    const year = req.params?.year;
    const committee = await ExecutiveCommittee.findOne({ year: year });
    const data = committee.data;
    data.sort((a, b) => (a.priority < b.priority ? -1 : 1));

    const response = await Promise.all(
      data.map(async (data) => {
        const mID = data.mID;

        const mem = await Member.findOne({ _id: mID });

        const memObj = {
          ...mem?.toObject(),
          designation: data.des,
          priority: data.priority,
          period: committee.period,
          year: committee.year,
        };

        return memObj;
      })
    );

    const dummy = [
      ...response,
      ...response,
      ...response,
      ...response,
      ...response,
      ...response,
      ...response,
      ...response,
      ...response,
      ...response,
    ];

    const final = dummy.filter((data) => {
      return data?.name.toLowerCase().includes(searchTerm);
    });

    res.status(200).json(final);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Post
router.post("/", (req, res) => {
  const committee = new ExecutiveCommittee({ ...req.body });
  committee.save((err, committee) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(committee);
    }
  });
});
router.post("/many", (req, res) => {
  const committees = req.body;
  ExecutiveCommittee.insertMany(committees, (err, committee) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(committee);
    }
  });
});

module.exports = router;
