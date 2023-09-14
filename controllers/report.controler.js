import fs from "fs";
import jobsModel from "../models/jobs.model.js";
import userModel from "../models/user.model.js";
import userPermissionasModel from "../models/userPermissions.model.js";
import fastcsv from "fast-csv";
import jobAssigningModel from "../models/jobAssigning.model.js";
import path from "path";
import commentsModel from "../models/comments.model.js";


export const getAllAuthorReport = async (req, res) => {
    try {
        if (req.role != 'admin') {
            return res.json({ success: true, message: 'ONLY ADMIN  CAN ACCESS THE REPORTS.' })
        }
        let queryObject = {}, sortBy = {}, dateObject = {}, Match = {};

        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 10;
        const skip = page * limit;


        const Limit = { "$limit": skip + limit };
        const Skip = { "$skip": skip };


        dateObject = req.query.start_date && req.query.end_date
            ? { $and: [{ role: { $eq: 'author' } }, { $and: [{ createdAt: { $gte: new Date(req.query.start_date) } }, { createdAt: { $lt: new Date(req.query.end_date) } }] }] }
            : req.query.start_date
                ? { $and: [{ role: { $eq: 'author' } }, { createdAt: { $gte: new Date(req.query.start_date) } }] }
                : req.query.end_date
                    ? { $and: [{ role: { $eq: 'author' } }, { createdAt: { $lte: new Date('0') } }] }
                    : {};


        queryObject = req.query.search
            ? {
                $and: [
                    {
                        $or: [
                            { email: { $regex: req.query.search, $options: "i" } },
                            { name: { $regex: req.query.search, $options: "i" } },
                        ],
                    },
                    { role: { $eq: 'author' } }
                ],
            }
            : { role: { $eq: 'author' } };

        Match = Object.keys(dateObject).length === 0
            ? { $match: queryObject }
            : { $match: dateObject }


        const Lookup = {
            $lookup: {
                from: "jobassignings",
                let: { "email": "$email" },
                pipeline: [
                    { $match: { "$expr": { "$eq": ["$allocatedTo", "$$email"] } } },
                    { $project: { amount: 1, activeMember: 1, allocatedTo: 1 } }

                ],
                as: "job_assign_Data",
            }
        }

        const Lookup_1 = {
            $lookup: {
                from: "jobs",
                let: { "email": "$email" },
                pipeline: [
                    { "$match": { "$expr": { "$eq": ["$assignJobId.author", "$$email"] } } }
                ],
                as: "job_Data",
            }
        }

        const Project = {
            $project: {
                name: 1,
                email: 1,
                mobile: 1,
                job_assign_Data: {
                    $cond: {
                        if: {
                            $ne: ["$job_assign_Data", []]
                        },
                        then: "$job_assign_Data",
                        else: "$$REMOVE"
                    }
                },
                numOfBlogPublished: { $size: "$job_assign_Data" },

                numOfBlogSubmitted: { $size: { $ifNull: ["$job_Data", []] } },
            }
        }

        const stages = [Match, Lookup, Lookup_1, Project, Limit, Skip]

        const filteredData = await userModel.aggregate(stages);

        if (filteredData.length == 0) {
            return res.status(200).json({
                success: true,
                message: "No Author found",
            });

        }
        else {
            console.log('filteredData==', filteredData);
            var result = filteredData.filter(obj => ("job_assign_Data" in obj))

            console.log('result--', result);
            if (result.length == 0) {
                return res.status(200).json({
                    success: true,
                    message: "No Author found",
                });
            }
            else {
                const count = result.length;
                const totalPages = Math.ceil(count / limit);

                return res.json({ Total_Pages: totalPages, data: result })
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
}

export const demo = async (req, res) => {
    try {
        let randomString = Math.random().toString(36).replace('0.', '') 
        console.log('*********',randomString);

    } catch (error) {
        console.log(error);
    }
}

export const getAllJobsReport = async (req, res) => {
    try {
        let queryObject = {}, innerQueryObject_1 = {}, innerQueryObject_2 = {};

        if (req.role != 'admin') {
            return res.json({ success: true, message: 'ONLY ADMIN  CAN ACCESS THE REPORTS.' })
        }
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 10;
        const skip = page * limit;

        const Limit = { "$limit": skip + limit };
        const Skip = { "$skip": skip };

        queryObject = (req.query.creation_start_date && req.query.creation_end_date && req.query.keyword)
            ? { $and: [{ createdAt: { $gte: new Date(req.query.creation_start_date), $lt: new Date(req.query.creation_end_date) } }, { keyword: { $eq: req.query.keyword } }] }
            : (req.query.creation_start_date && req.query.creation_end_date)
                ? { $and: [{ createdAt: { $gte: new Date(req.query.creation_start_date), $lt: new Date(req.query.creation_end_date) } }] }
                : req.query.creation_start_date
                    ? { createdAt: { $gte: new Date(req.query.creation_start_date) } }
                    : req.query.creation_end_date
                        ? { createdAt: { $lt: new Date('0') } }
                        : req.query.keyword
                            ? { keyword: { $eq: req.query.keyword } }
                            : {}

        console.log('quer---', req.query);
        const Match = { $match: queryObject };

        console.log('Match---', Match);

        //  For Lookup_1
        innerQueryObject_1 = (req.query.published_start_date && req.query.published_end_date)
            ? { $and: [{ "$eq": ["$jobId", "$$rootId"] }, { $gte: ["$dateOfPublishing", req.query.published_start_date] }, { $lt: ["$dateOfPublishing", req.query.published_end_date] }] }
            : req.query.published_start_date
                ? { $and: [{ "$eq": ["$jobId", "$$rootId"] }, { $gte: ["$dateOfPublishing", req.query.published_start_date] }] }
                : req.query.published_end_date
                    ? { $and: [{ "$eq": ["$jobId", "$$rootId"] }, { $eq: ["$dateOfPublishing", '0'] }] }
                    : { "$eq": ["$jobId", "$$rootId"] };



        // For Lookup_2
        innerQueryObject_2 = req.query.author_name
            ? { $and: [{ $expr: { "$eq": ["$email", "$$rootId"] } }, { name: { $regex: req.query.author_name, $options: "i" } }] }
            : {
                $expr:
                    { "$eq": ["$email", "$$rootId"] }

            }
        console.log('innerQueryObject_1---', innerQueryObject_1);
        console.log('innerQueryObject_2---', innerQueryObject_2);
        const Lookup_1 = {
            $lookup: {
                from: "jobassignings",
                let: { "rootId": "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr:
                                innerQueryObject_1
                        }
                    }],
                as: "job_assign_Data",
            }

        }
        const Lookup_2 = {
            $lookup: {
                from: "users",
                let: { "rootId": "$assignJob.author" },
                pipeline: [
                    {
                        $match: innerQueryObject_2
                    },

                ],
                as: "Author_Data",
            }
        }

        const Lookup_3 = {
            $lookup: {
                from: "users",
                let: { "rootId": "$assignJob.evaluator" },
                pipeline: [
                    {
                        $match: { $expr: { "$eq": ["$email", "$$rootId"] } }
                    },
                ],
                as: "Evaluator_Data",
            }
        }
        const Lookup_4 = {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "Uploader_data",
            },
        }
        const Unwind_1 = { $unwind: '$job_assign_Data' }
        const Unwind_2 = { $unwind: '$Author_Data' }
        const Unwind_3 = { $unwind: '$Evaluator_Data' }
        const Unwind_4 = { $unwind: '$Uploader_data' }

        const Project = {
            $project: {
                blogTitle: 1,
                keyword: 1,
                onWhoseDesk: 'Evaluator',
                dateOfCreation: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                uploader: '$Uploader_data.name',
                AuthorName: '$Author_Data.name',
                EvaluatorName: '$Evaluator_Data.name',
                dateOfPublishing: '$job_assign_Data.dateOfPublishing',
                wordCount: '$job_assign_Data.wordCount',
                amount: '$job_assign_Data.amount',
                paidOn: '$job_assign_Data.paidOn',
            }
        }
        const stages = [Match, Lookup_2, Unwind_2, Lookup_3, Unwind_3, Lookup_4, Unwind_4, Lookup_1, Unwind_1, Project, Limit, Skip]

        const filteredData = await jobsModel.aggregate(stages);

        if (filteredData.length == 0) {
            return res.status(200).json({
                success: true,
                message: "No Author found",
            });
        }
        else {
            console.log('filteredData==', filteredData);
            var result = filteredData.filter(obj => ("dateOfPublishing" in obj) && ("dateOfCreation" in obj) && ("AuthorName" in obj) && ("keyword" in obj))

            console.log('result--', result);
            if (result.length == 0) {
                return res.status(200).json({
                    success: true,
                    message: "No Author found",
                });
            }
            else {
                const count = result.length;
                const totalPages = Math.ceil(count / limit);
                const Authors = []
                const Keywords = []
                result.forEach(element => {
                    Authors.push(element.AuthorName);
                    Keywords.push(element.keyword);
                });


                return res.json({ Total_Pages: totalPages, data: result ,Authors:Authors, Keywords:Keywords  })
            }
            // return res.json(filteredData)
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
}

export const authorJobSubmissionReport = async (req, res) => {
    try {
        let queryObject = {}, innerQueryObject_1 = {}, Match = {};

        if (req.role != 'admin') {
            return res.json({ success: true, message: 'ONLY ADMIN  CAN ACCESS THE REPORTS.' })
        }
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 10;
        const skip = page * limit;

        const Limit = { "$limit": skip + limit };
        const Skip = { "$skip": skip };

        innerQueryObject_1 = (req.query.start_date && req.query.end_date)
            ? { $and: [{ "$eq": ["$jobId", "$$rootId"] }, { $gte: ["$dateOfPublishing", req.query.start_date] }, { $lt: ["$dateOfPublishing", req.query.end_date] }] }
            : req.query.start_date
                ? { $and: [{ "$eq": ["$jobId", "$$rootId"] }, { $gte: ["$dateOfPublishing", req.query.start_date] }] }
                : req.query.end_date
                    ? { $and: [{ "$eq": ["$jobId", "$$rootId"] }, { $eq: ["$dateOfPublishing", '0'] }] }
                    : { "$eq": ["$jobId", "$$rootId"] };

        console.log('req.query---', req.query);
        queryObject = req.query.search
            ? { blogTitle: { $regex: req.query.search, $options: "i" } }
            : {};

        Match = { $match: queryObject };

        const Lookup = {
            $lookup: {
                from: "jobassignings",
                let: { "rootId": "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr:
                                innerQueryObject_1
                        }
                    }],
                as: "job_assign_Data",
            }

        }

        const Lookup_1 = {
            $lookup: {
                from: "users",
                localField: "assignJob.evaluator",
                foreignField: "email",
                as: "evaluator_data",
            }
        }

        const Unwind = { $unwind: '$job_assign_Data' }
        const Unwind_1 = { $unwind: '$evaluator_data' }


        const Project = {
            $project: {
                blogTitle: 1,
                EvaluatorName: '$evaluator_data.name',
                dateOfPublishing: '$job_assign_Data.dateOfPublishing',
                wordCount: '$job_assign_Data.wordCount',
                amount: '$job_assign_Data.amount',
                url: '$job_assign_Data.paidOn',
                paidOn: '$job_assign_Data.paidOn',
                activeMember: '$job_assign_Data.activeMember',

            }
        }

        const stages = [Match, Lookup_1, Unwind_1, Lookup, Unwind, Project, Limit, Skip]

        const filteredData = await jobsModel.aggregate(stages);

        if (filteredData.length == 0) {
            return res.status(200).json({
                success: true,
                message: "No Author found",
            });

        }
        else {
            const count = filteredData.length;
            const totalPages = Math.ceil(count / limit);
            return res.json({ Total_Pages: totalPages, data: filteredData })

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        })
    }
}

export const getPublishedJobReport = async (req, res) => {
    try {
        let queryObject = {}, innerQueryObject_1 = {}, innerQueryObject_2 = {};
        if (req.role != 'admin') {
            return res.json({ success: true, message: 'ONLY ADMIN  CAN ACCESS THE REPORTS.' })
        }

        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 10;
        const skip = page * limit;

        const Limit = { "$limit": skip + limit };
        const Skip = { "$skip": skip };

        queryObject = (req.query.creation_start_date && req.query.creation_end_date)
            ? { $and: [{ createdAt: { $gte: new Date(req.query.creation_start_date), $lt: new Date(req.query.creation_end_date) } }] }
            : req.query.creation_start_date
                ? { createdAt: { $gte: new Date(req.query.creation_start_date) } }
                : req.query.creation_end_date
                    ? { createdAt: { $lt: new Date('0') } }
                    : {}

        const Match = { $match: queryObject };



        //  For Lookup_1
        innerQueryObject_1 = (req.query.published_start_date && req.query.published_end_date)
            ? { $and: [{ "$eq": ["$jobId", "$$rootId"] }, { $gte: ["$dateOfPublishing", req.query.published_start_date] }, { $lt: ["$dateOfPublishing", req.query.published_end_date] }] }
            : req.query.published_start_date
                ? { $and: [{ "$eq": ["$jobId", "$$rootId"] }, { $gte: ["$dateOfPublishing", req.query.published_start_date] }] }
                : req.query.published_end_date
                    ? { $and: [{ "$eq": ["$jobId", "$$rootId"] }, { $eq: ["$dateOfPublishing", '0'] }] }
                    : { "$eq": ["$jobId", "$$rootId"] };



        // For Lookup_2
        innerQueryObject_2 = req.query.author_name
            ? { $and: [{ $expr: { "$eq": ["$email", "$$rootId"] } }, { name: { $regex: req.query.author_name, $options: "i" } }] }
            : {
                $expr:
                    { "$eq": ["$email", "$$rootId"] }

            }

        const Lookup_1 = {
            $lookup: {
                from: "jobassignings",
                let: { "rootId": "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr:
                                innerQueryObject_1
                        }
                    },

                ],
                as: "job_assign_Data",
            }

        }
        const Lookup_2 = {
            $lookup: {
                from: "users",
                let: { "rootId": "$assignJob.author" },
                pipeline: [
                    {
                        $match: innerQueryObject_2
                    },

                ],
                as: "Author_Data",
            }
        }
        const Unwind_1 = { $unwind: '$job_assign_Data' }
        const Unwind_2 = { $unwind: '$Author_Data' }

        const Project = {
            $project: {
                blogTitle: 1,
                jobCreationDate: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                url: '$job_assign_Data.url',
                jobPublishedDate: '$job_assign_Data.dateOfPublishing',
                AuthorName: '$Author_Data.name',
            }
        }
        const stages = [Match, Lookup_2, Unwind_2, Lookup_1, Unwind_1, Project, Limit, Skip]

        const filteredData = await jobsModel.aggregate(stages);
        if (filteredData.length == 0) {
            return res.status(200).json({
                success: true,
                message: "No Author found",
            });
        }
        else {

            console.log('filteredData==', filteredData);
            var result = filteredData.filter(obj => ("jobCreationDate" in obj) && ("jobPublishedDate" in obj) && ("AuthorName" in obj))

            console.log('result--', result);
            if (result.length == 0) {
                return res.status(200).json({
                    success: true,
                    message: "No Author found",
                });
            }
            else {
                const count = result.length;
                const totalPages = Math.ceil(count / limit);

                const Authors = []
                result.forEach(element => {
                    Authors.push(element.AuthorName);

                });
                return res.json({ Total_Pages: totalPages, data: result, Authors: Authors })
            }

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
}


export const getJobStagnationReport = async (req, res) => {
    try {
        let queryObject = {}, innerQueryObject_1 = {}, innerQueryObject_2 = {};
        if (req.role != 'admin') {
            return res.json({ success: true, message: 'ONLY ADMIN  CAN ACCESS THE REPORTS.' })
        }

        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 10;
        const skip = page * limit;

        const Limit = { "$limit": skip + limit };
        const Skip = { "$skip": skip };

        queryObject = (req.query.creation_start_date && req.query.creation_end_date)
            ? { $and: [{ createdAt: { $gte: new Date(req.query.creation_start_date), $lt: new Date(req.query.creation_end_date) } }] }
            : req.query.creation_start_date
                ? { createdAt: { $gte: new Date(req.query.creation_start_date) } }
                : req.query.creation_end_date
                    ? { createdAt: { $lt: new Date('0') } }
                    : {}

        // For Lookup_2
        innerQueryObject_2 = req.query.member
                    ? { $and: [{ $expr: { "$eq": ["$email", "$$authorId"] } }, { name: { $regex: req.query.member, $options: "i" } }] }
                    : {
                        $expr:
                            { "$eq": ["$email", "$$authorId"] }

                    }

        
       const Match = { $match: { $and: [{ status: "on-hold" }, queryObject] } } 
        const Lookup_1 = {
                    $lookup: {
                        from: "jobassignings",
                        let: { "rootId": "$_id" },
                        pipeline: [
                            {
                                $match:{
                                            $expr: { "$eq": ["$jobId", "$$rootId"] }
                                        }
                            }],
                        as: "job_assign_Data",
                    }

                }

        const Lookup_2 = {
                    $lookup: {
                        from: "users",
                        let: { "authorId": "$assignJob.author" },
                        pipeline: [
                            {
                                $match: innerQueryObject_2
                            }, { "$project": { name: 1 } }
                        ],
                        as: "Author_Data",
                    }
                }
        const Unwind_1 = { $unwind: '$job_assign_Data' }
        const Unwind_2 = { $unwind: '$Author_Data' }
        const Project = {
                    $project: {
                        blogTitle: 1,
                        assignTo: "$Author_Data.name",
        
                        stage: {
                            "$switch": {
                                "branches": [
                                    { "case": { "$ne": ["$job_assign_Data.scoreGivenByEvaluator", ""] }, "then": "analyst" },
                                    { "case": { $and: [{ "$ne": ["$job_assign_Data.blogDocument", ""] }, { "$ne": ["$job_assign_Data.grammarlyScreenshot", ""] }] }, "then": "evaluator" },
                                ],
                                "default": "author"
                            }
                        },
                        duration:
                        {
                            $dateDiff:
                            {
                                startDate: "$createdAt",
                                endDate: "$updatedAt",
                                unit: "day"
                            }
                        }

                        // Author_Data: {
                        //     $cond: {
                        //         if: {
                        //             $ne: ["$Author_Data", []]
                        //         },
                        //         then: "$Author_Data",
                        //         else: "$$REMOVE"
                        //     }
                        // },
                        // job_assign_Data: {
                        //     $cond: {
                        //         if: {
                        //             $ne: ["$job_assign_Data", []]
                        //         },
                        //         then: "$job_assign_Data",
                        //         else: "$$REMOVE"
                        //     }
                        // },
                    }
                }
        const stages = [Match, Lookup_2, Unwind_2, Lookup_1, Unwind_1, Project, Limit, Skip]

        const filteredData = await jobsModel.aggregate(stages);

                if(filteredData.length == 0) {
            return res.status(200).json({
                success: true,
                message: "No Author found",
            });
        }
        else {
    console.log('filteredData==', filteredData);
    var result = filteredData.filter(obj => ("assignTo" in obj) && ("stage" in obj))

    console.log('result--', result);
    if (result.length == 0) {
        return res.status(200).json({
            success: true,
            message: "No Author found",
        });
    }
    else {
        const profileArray=[]
        const ProfileList = []
        const MemberList = []
        if(req.query.profile)
        {
            result.forEach(element => {
                console.log('element.stage--',element.stage);
                if(req.query.profile == element.stage)
                {
                    profileArray.push(element)
                }
            });
            console.log('req.query.profile--',req.query.profile);
           
            console.log('profileArray--',profileArray);

            if(profileArray.length == 0)
            {
                return res.status(200).json({
                    success: true,
                    message: "No Author found",
                });
            }
            else
            {
                let count = profileArray.length;
                const totalPages = Math.ceil(count / limit);
        
                profileArray.forEach(element => {
                    ProfileList.push(element.stage);
                    MemberList.push(element.assignTo);
                });
                return res.json({ Total_Pages: totalPages, data: profileArray,ProfileList:ProfileList ,MemberList:MemberList})
            }
        }
        else
        {

            let count = result.length;
            const totalPages = Math.ceil(count / limit);
            result.forEach(element => {
                ProfileList.push(element.stage);
                MemberList.push(element.assignTo);
            });
            return res.json({ Total_Pages: totalPages, data: result, ProfileList:ProfileList ,MemberList:MemberList })
        }
        
    }

}
    } catch (error) {
    console.log(error);
    return res.status(500).json({
        error: true,
        message: "Internal Server Error",
    });
}
}
