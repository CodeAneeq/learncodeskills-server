import { courseModel } from "../models/course.schema.js";

const addCourse = async (req, res) => {
    try {
        let instructor = req.user
        if (!req.file) {
            return res.status(400).json({status: "failed", message: "thumbnail is required"});
        }
        let {title, category, subTitle, description, price, level, status, language} = req.body;
        if (!title || !category || !subTitle || !description || !price || !level || !language) {
            return res.status(400).json({status: "failed", message: "all fields are required"});
        }
        let date = new Date(Date.now()); 
        let newCourse = courseModel({
            title,
            category,
            subTitle,
            description,
            price,
            level,
            status,
            language,
            instructorId: instructor._id,
            thumbnail: req.file.path,
            createdAt: date
        })
        await newCourse.save()
        res.status(201).json({status: "Success", message: "Course added successfully", data: newCourse});
    } catch (error) {
         console.log(error);
        res.status(500).json({status: "Failed", message: "Internal Server Error"});
    }
}

const getAllCourses = async (req, res) => {
    try {
       let courses = await courseModel.find();
        res.status(201).json({status: "Success", message: "Course fetch successfully", data: courses});
    } catch (error) {
         console.log(error);
        res.status(500).json({status: "Failed", message: "Internal Server Error"});
    }
}

const getInstructorCourses = async (req, res) => {
    try {
        let instructor = req.user;
       let courses = await courseModel.find({instructorId: instructor._id});
       if (courses.length === 0) {
        return res.status(500).json({status: "Failed", message: "No Course to be shown"});
       }
        res.status(201).json({status: "Success", message: "Course fetch successfully", data: courses});
    } catch (error) {
         console.log(error);
        res.status(500).json({status: "Failed", message: "Internal Server Error"});
    }
}

const deleteCourse = async (req, res) => {
    try {
        let instructor = req.user
        let id = req.params.id;
        let course = await courseModel.findById(id);
        if (course.instructorId.toString() !== instructor._id.toString()) {
            return res.status(400).json({status: "Failed", message: "You are not creator of this course"})
        }
        if (!course) {
            return res.status(400).json({status: "Failed", message: "Course not found"})
        }
        let delCourse = await courseModel.deleteOne(course);
        res.status(200).json({status: "success", message: "Course deleted successfully", data: course})
    } catch (error) {
      console.log(error);
        res.status(500).json({status: "Failed", message: "Internal Server Error"});   
    }
}

const searchCourse = async (req, res) => {
    try {
        let searchQuery = req.query.search;
        if (!searchQuery) {
            return res.status(404).json({status: "failed", message: "Query is missing"});
        }
        let courses = await courseModel.find({$or: [
            {title: {$regex: searchQuery, $options: 'i'}},
            {subTitle: {$regex: searchQuery, $options: 'i'}},
            {description: {$regex: searchQuery, $options: 'i'}},
            {category: {$regex: searchQuery, $options: 'i'}},
        ]});
        if (courses.length === 0) {
            return res.status(404).json({status: "failed", message: "NO course found"});
        }
        res.status(200).json({status: "success", message: "Course fetch successfully based on query", data: courses});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

const filterCourse = async (req, res) => {
  try {
    let { category, level, language } = req.body;
    let filter = {};

    if (category) {
      filter.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (level) {
      filter.level = { $regex: `^${level}$`, $options: "i" };
    }

    if (language) {
      filter.language = { $regex: `^${language}$`, $options: "i" };
    }

    let courses = await courseModel.find(filter);

    if (courses.length === 0) {
      return res.status(404).json({ status: "failed", message: "no job found" });
    }

    res.status(200).json({ status: "success", message: "Jobs filtered successfully", data: courses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: "Internal Server Error" });
  }
};

const getCourseById = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({status: "Failed", message: "id not found"});
        }
       let course = await courseModel.findById(id);
       if (!course) {
        return res.status(400).json({status: "failed", message: "Course not found"})
       }
       res.status(201).json({status: "Success", message: "Course fetch successfully", data: course});
    } catch (error) {
         console.log(error);
        res.status(500).json({status: "Failed", message: "Internal Server Error"});
    }
}

export { addCourse, getAllCourses, getInstructorCourses, deleteCourse, searchCourse, filterCourse, getCourseById }
