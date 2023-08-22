import rolesModel from "../models/rolesModel.js";

export const createRoles = async (req, res) => {
     const { roles, permissionType } = req.body;

     try {
          if (!roles) {

               res.status(400).json({
                    success: false,
                    message: "Please Provide Role"
               })
          }

          const role = await rolesModel.create(req.body)


          res.status(201).json({
               success: false,
               message: "Roles Create Successfully",
               role
          })


     } catch (error) {
          console.log(error)
     }
}