import db from "../server.js";
import CodeforcesAPI from "./codeforcesAPI.js";
import { ObjectId } from "mongodb";

class DuelManager {
    static async findProblems(filter={}, fields={}) {
        // filter for the problems we're looking for
        // fields for the parts of the problems
        let result = await db.collection('problems').find(filter, fields).toArray();
        return result;
    }

    static async findDuel(id) {
        try {
            let duels = await db.collection('duels').find({
                _id: ObjectId(id)
            }, {}).toArray();
            if (duels.length != 0 ) return duels[0];
        } catch (err) {
            console.log("Error: invalid getDuelState() request... Probably an invalid id.");
        }
        return null; // if no duel found
    }

    static async getDuelState(id) {
        try {
            let duels = await db.collection('duels').find({
                _id: ObjectId(id)
            }, {}).toArray();
            if (duels.length != 0 ) return duels[0].status;
        } catch (err) {
            console.log("Error: invalid getDuelState() request... Probably an invalid id.");
        }
        return null; // if no duel found
    }

    static async changeDuelState(id, state) {
        console.log('Duel ' + id + ' State Changed to ' + state);
        await db.collection('duels').findOneAndUpdate(
            {
                _id: ObjectId(id)
            },
            {
                $set: {
                    status: state
                }
            }
        );
    }

    static async isUserSubmissionOK(handle, contestId, index, name) {
        let submissions = await CodeforcesAPI.get_user_submissions(handle);
        var filteredSubmissions;
        if (submissions.length != 0) {
            filteredSubmissions = submissions.filter(function (sub) {
                return sub.contestId == contestId &&
                       sub.index == index &&
                       sub.name == name &&
                       sub.verdict == 'OK'
            });
        }
        console.log(filteredSubmissions);
        if (filteredSubmissions.length != 0) {
            return true;
        }
        return false;
    }
    
}

export default DuelManager;