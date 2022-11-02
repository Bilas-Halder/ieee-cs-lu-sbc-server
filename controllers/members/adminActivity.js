const Member = require("../../models/memberSchema");

const advanceFiltering = (req) => {
    const requestedQuery = req.query;
    const id = req.id;

    if (typeof requestedQuery !== "object") {
        return {};
    }
    const {fields, sort, page = 1, limit = 10, ...filters} = requestedQuery;
    const query = {};
    if (filters) {
        let filterStr = JSON.stringify(filters);

        filterStr = filterStr.replace(
            /\b(gt|gte|lt|lte|eq|in|ne|nin|and|not|nor|or|exists)\b/g, //operations can be done
            (match) => `$${match}`
            // if any match than add $ sign before the match
        );

        query.filters = JSON.parse(filterStr); //New filters Object
    }
    if (sort) {
        const sortBy = sort.split(",").join(" "); // making coma separated string space separated
        query.sort = sortBy;
    }
    if (fields) {
        let selectedFields = fields.split(",").join(" ");
        selectedFields = selectedFields.replace(" password", "");
        query.fields = selectedFields;
    } else {
        query.fields = " -password";
    }
    if (page) {
        // here skip = (page-1) * limit

        const pages = parseInt(page);
        if (pages !== 0 && pages !== NaN && pages !== null) {
            const skip = (pages - 1) * parseInt(limit);

            query.skip = skip;
            query.limit = parseInt(limit);
            query.page = pages;
        } else {
            query.skip = 0;
            query.page = 0;
            query.limit = 0;
        }
    }
    return query;
};

const getQueryController = async (req, res) => {
    try {
        const query = advanceFiltering(req);

        const totalCount = await Member.countDocuments(query.filters);

        if (query.page === 0) {
            query.limit = totalCount;
        }

        const member = await Member.find(query.filters)
            .select(query.fields) // selecting mentioned fields only
            .sort(query.sort) // sorting according the sort string
            .skip(query.skip) // skipping the previous pages
            .limit(query.limit); // limit of the result array

        res.status(200).send({
            // query,
            dataCount: member.length,
            totalDataCount: totalCount,
            currentPage: query.page ? query.page : 1,
            totalPage: Math.ceil(totalCount / query.limit),
            data: member,
        });
    } catch (error) {
        res.status(400).send({
            error,
            msg: error.message,
        });
    }
};

const updateRole = async (req, res) => {
    const id = req.params.id;
    const role = req.params.role;
    try {
        const member = await Member.findByIdAndUpdate(
            {_id: id},
            {
                $set: {
                    role: role,
                },
            },
            {
                useFindAndModify: false,
                new: true, // to return the updated document
            }
        );

        const {password, ...rest} = member._doc;

        res.status(500).send({
            msg: "Successfully Updated!",
            data: rest,
        });
    } catch {
        res.status(500).send({
            msg: "Failed to update please try again!",
        });
    }
};
const updateType = async (req, res) => {
    const id = req.params.id;
    const type = req.params.type;
    try {
        const member = await Member.findByIdAndUpdate(
            {_id: id},
            {
                $set: {
                    type: type,
                },
            },
            {
                useFindAndModify: false,
                new: true, // to return the updated document
            }
        );

        const {password, ...rest} = member._doc;

        res.status(500).send({
            msg: "Successfully Updated!",
            data: rest,
        });
    } catch {
        res.status(500).send({
            msg: "Failed to update please try again!",
        });
    }
};
const makeAdminController = async (req, res) => {
    req.params.role = "admin";
    updateRole(req, res);
};
const makeModeratorController = async (req, res) => {
    req.params.role = "moderator";
    updateRole(req, res);
};
const makeUserController = async (req, res) => {
    req.params.role = "user";
    updateRole(req, res);
};

const makeLocalController = async (req, res) => {
    req.params.role = "local";
    updateType(req, res);
};
const makeGlobalController = async (req, res) => {
    req.params.role = "global";
    updateType(req, res);
};

module.exports = {
    getQueryController,
    makeAdminController,
    makeModeratorController,
    makeUserController,
    makeLocalController,
    makeGlobalController,
};
