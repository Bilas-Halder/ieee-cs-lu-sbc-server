const express = require("express");
const adminAuthGuard = require("../middlewares/AuthGuards/adminAuthGuard");
const router = express.Router();

const {
    getSingleCommitteeController,
    newCommitteeController,
    uploadNewCommitteeMemberController,
    deleteCommitteeController,
    removeMemberFromCommitteeController,
} = require("../controllers/committee/committee");

router.get("/:year", getSingleCommitteeController);

// Post
router.post("/new", adminAuthGuard, newCommitteeController);

// Update
router.put("/newMember", adminAuthGuard, uploadNewCommitteeMemberController); // Required input in body -> designation, priority, memberID, year

//Deletes
router.delete(
    "/removeMember",
    adminAuthGuard,
    removeMemberFromCommitteeController
);
router.delete("/:year", adminAuthGuard, deleteCommitteeController);

module.exports = router;
