const {createUser ,loginUser, getalluser, getuser, deleteuser, updateuser, handleRefreshToken, logout,checkvalidity} = require("../controller/authcontroller");
const { authMiddleware, isAdmin } = require("../middleware/authmiddleware");
const router =  require("express").Router();
router.post("/register",createUser)
router.post("/login",loginUser)
router.get("/refresh",handleRefreshToken)
router.delete("/:id",deleteuser)
router.get("/logout",logout)
router.get("/user-details",authMiddleware,isAdmin,getalluser)
router.get("/:id",authMiddleware,isAdmin,getuser);
router.put("/edit-user",authMiddleware,updateuser)
router.get('/checkvalidity',authMiddleware,isAdmin,checkvalidity);
module.exports=router;
