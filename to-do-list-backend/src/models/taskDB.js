import { mongoose } from 'mongoose'

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        unique: true,
        require: true
    },
    preference: {
        type: String,
        require: true
    },
    tags: {
        type: Array(String)
    },
    isCompleted: {
        type: Boolean,
        required: true
    },
    // createdAt: {
    //     type: Date,
    //     require: true
    // },
    // updatedAt: {
    //     type: Date,
    //     require: true
    // },
},
    { timestamps: true }
);
const TaskDb = mongoose.model('Task', todoSchema);

export default TaskDb;