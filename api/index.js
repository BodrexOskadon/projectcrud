const express = require("express")
const cors = require("cors")
const multer = require("multer")
const { Pool } = require("pg")
const Minio = require("minio")

const app = express()
app.use(cors())
app.use(express.json())

/* ================= DATABASE ================= */

const pool = new Pool({
 user: "admin",
 host: "postgres",
 database: "ats",
 password: "admin123",
 port: 5432
})

/* ================= MINIO ================= */

const minioClient = new Minio.Client({
 endPoint: "minio",
 port: 9000,
 useSSL: false,
 accessKey: "admin",
 secretKey: "admin123"
})

const bucket = "uploads"

async function initBucket() {
 const exists = await minioClient.bucketExists(bucket).catch(()=>false)

 if(!exists){
  await minioClient.makeBucket(bucket)
  console.log("Bucket created")
 }
}

initBucket()

/* ================= MULTER ================= */

const upload = multer({
 storage: multer.memoryStorage(),
 limits:{
  fileSize:5 * 1024 * 1024
 }
})

/* ================= TABLE INIT ================= */

pool.query(`
CREATE TABLE IF NOT EXISTS users(
 id SERIAL PRIMARY KEY,
 name TEXT,
 email TEXT,
 photo TEXT
)
`)

/* ================= CREATE USER ================= */

app.post("/users", upload.single("photo"), async(req,res)=>{

 try{

 const {name,email} = req.body
 const file = req.file

 let photoUrl = null

 if(file){

  const filename = Date.now()+"-"+file.originalname

  await minioClient.putObject(
   bucket,
   filename,
   file.buffer
  )

  photoUrl = `http://10.246.122.173:9000/${bucket}/${filename}`
 }

 const result = await pool.query(
  "INSERT INTO users(name,email,photo) VALUES($1,$2,$3) RETURNING *",
  [name,email,photoUrl]
 )

 res.json(result.rows[0])

 }catch(err){
  res.status(500).json({error:err.message})
 }

})

/* ================= READ USERS ================= */

app.get("/users", async(req,res)=>{
 const result = await pool.query("SELECT * FROM users ORDER BY id DESC")
 res.json(result.rows)
})

/* ================= UPDATE USER ================= */

app.put("/users/:id", upload.single("photo"), async(req,res)=>{

 const {name,email} = req.body
 const id = req.params.id
 const file = req.file

 let photoUrl = null

 if(file){

  const filename = Date.now()+"-"+file.originalname

  await minioClient.putObject(
   bucket,
   filename,
   file.buffer
  )

  photoUrl = `http://10.246.122.173:9000/${bucket}/${filename}`

  await pool.query(
   "UPDATE users SET name=$1,email=$2,photo=$3 WHERE id=$4",
   [name,email,photoUrl,id]
  )

 }else{

  await pool.query(
   "UPDATE users SET name=$1,email=$2 WHERE id=$3",
   [name,email,id]
  )

 }

 res.json({message:"User updated"})

})

/* ================= DELETE USER ================= */

app.delete("/users/:id", async(req,res)=>{

 const id = req.params.id

 const user = await pool.query(
  "SELECT * FROM users WHERE id=$1",[id]
 )

 if(user.rows.length === 0)
 return res.status(404).json({message:"User not found"})

 const photo = user.rows[0].photo

 if(photo){
  const filename = photo.split("/").pop()
  await minioClient.removeObject(bucket,filename).catch(()=>{})
 }

 await pool.query(
  "DELETE FROM users WHERE id=$1",[id]
 )

 res.json({message:"User deleted"})

})

/* ================= FILE SIZE ERROR ================= */

app.use((err,req,res,next)=>{
 if(err.code==="LIMIT_FILE_SIZE"){
  return res.status(400).json({
   error:"File must be under 5MB"
  })
 }
 next(err)
})

app.listen(8080,()=>{
 console.log("API running on port 8080")
})
