const Committee = require("../../models/committeeSchema");
const createError = require("http-errors");

const getSingleCommitteeController = async (req, res, next) => {
    try {
        const year = req.params?.year;

        const committee = await Committee.findOne({year: year}).populate({
            path: "membersList.member",
            select: "-password -type -verified -role -createdAt -updatedAt -__v",
        });
        if (!committee) {
            next(createError(404, `Don't found a committee for ${year}!`));
            return;
        }
        const {membersList} = committee;
        membersList.sort((a, b) => (a.priority < b.priority ? -1 : 1)); // add name priority too

        res.status(200).json({
            dataCount: membersList.length,
            data: membersList,
        });
    } catch (err) {
        res.status(500).json({error: err});
    }
};

const newCommitteeController = (req, res) => {
    const {year, period} = req.body;

    const committee = new Committee({year, period, membersList: []});
    committee.save((err, committee) => {
        if (err) {
            let message = undefined;
            if (err.code === 11000) {
                message = "Duplicate Year Detected!";
            }
            res.status(409).send({
                status: 409,
                msg: message || err.message,
            });
        } else {
            res.status(200).send({
                msg: `Successfully Created new committee for ${year}! Start uploading members list.`,
                data: committee,
            });
        }
    });
};

const uploadNewCommitteeMemberController = async (req, res, next) => {
    const {designation, priority, memberID, year} = req.body;
    try {
        const committee = await Committee.findOne({year: year});

        //checking member is in the list already
        let memberAlreadyExist = false;
        const membersList = committee.membersList;
        for (let i = 0; i < membersList.length; i++) {
            if (membersList[i].member.equals(memberID)) {
                memberAlreadyExist = true;
                break;
            }
        }
        if (memberAlreadyExist) {
            next(
                createError(409, "Member already have a designation this year!")
            );
            return;
        }

        committee.membersList.push({
            designation,
            priority,
            member: memberID,
        });

        await committee.save();

        res.status(200).send({
            msg: `Successfully Created new committee for ${year}! Start uploading members list.`,
            data: committee,
        });
    } catch (error) {
        res.status(500).send({
            status: 500,
            msg: "Something wrong happened please try again.",
            err: error,
        });
    }
};

const deleteCommitteeController = async (req, res, next) => {
    try {
        const year = req.params.year;
        const committee = await Committee.findOneAndDelete({year: year});

        if (!committee) {
            next(createError(404, `Don't found a committee for ${year}!`));
            return;
        }
        res.status(200).send({
            msg: `Successfully deleted committee of ${year}!`,
            deleteCount: 1,
            deletedData: committee,
        });
    } catch (error) {
        res.status(500).send({
            status: 500,
            msg: "Something wrong happened please try again.",
        });
    }
};

const removeMemberFromCommitteeController = async (req, res, next) => {
    try {
        const {year, memberID} = req.body;
        console.log(year, memberID);
        const committee = await Committee.findOne({year: year});
        let removedData;
        for (let i = 0; i < committee.membersList.length; i++) {
            if (committee.membersList[i].member.equals(memberID)) {
                removedData = committee.membersList.pull(i);
                break;
            }
        }

        await committee.save();

        res.status(200).send({
            msg: `Successfully Removed the member!`,
            removeCount: 1,
            removedData: removedData,
        });
    } catch (error) {
        res.status(500).send({
            status: 500,
            msg: "Something wrong happened please try again.",
        });
    }
};

module.exports = {
    getSingleCommitteeController,
    newCommitteeController,
    uploadNewCommitteeMemberController,
    deleteCommitteeController,
    removeMemberFromCommitteeController,
};
