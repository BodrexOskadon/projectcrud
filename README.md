# projectcrud
README PROJECT
Aplikasi CRUD User Berbasis Microservice
PostgreSQL + MinIO + Docker Compose


//====================================================
// 1. LOGIN KE SERVER / MASUK KE PROJECT
//====================================================

// login ke server (jika menggunakan SSH)
ssh root@IP_SERVER

// buat dan masuk ke folder/directory project
mkdir crud-microservice
cd crud-microservice

// melihat isi folder project
ls


//====================================================
// 2. STRUKTUR PROJECT
//====================================================

crud-microservice
│
├── backend
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
│
├── api
│   ├── Dockerfile
│   └── index.js
│
├── frontend
│   ├── Dockerfile
│   └── index.html
│
├── docker-compose.yml
└── .env


//====================================================
// 3. MENJALANKAN DOCKER COMPOSE
//====================================================

// build semua container
docker compose build

// menjalankan semua container
docker compose up -d

// atau build dan run sekaligus
docker compose up --build -d


//====================================================
// 4. MENGECEK CONTAINER YANG BERJALAN
//====================================================

// melihat container aktif
docker ps

// container yang harus berjalan
frontend
backend
api
postgres
minio


//====================================================
// 5. MELIHAT LOG CONTAINER
//====================================================

// melihat log api
docker compose logs api

// melihat log backend
docker compose logs backend

// melihat log semua service
docker compose logs


//====================================================
// 6. MENGECEK STORAGE SERVER
//====================================================

// melihat kapasitas disk server
df -h


//====================================================
// 7. MEMBERSIHKAN DOCKER JIKA STORAGE PENUH
//====================================================

// menghapus image dan container yang tidak digunakan
docker system prune -a


//====================================================
// 8. MASUK KE DATABASE POSTGRESQL
//====================================================

// masuk ke container postgres
docker exec -it postgres psql -U admin -d ats


//====================================================
// 9. MELIHAT TABEL DATABASE
//====================================================

// melihat semua tabel
\dt

// MEMBUAT TABEL USERS
 //====================================================

 CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) NOT NULL,
     photo_url TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );


//====================================================
// 10. MELIHAT DATA USER
//====================================================

// melihat isi tabel users
SELECT * FROM users;


//====================================================
// 11. MENGHAPUS DATA USER
//====================================================

// menghapus user berdasarkan id
DELETE FROM users WHERE id=1;

// menghapus semua user
DELETE FROM users ;
//====================================================
// 12. KELUAR DARI DATABASE
//====================================================

\q


//====================================================
// 13. AKSES APLIKASI
//====================================================

// frontend web
http://IP_SERVER:3000

// REST API
http://IP_SERVER:8080

// MinIO Console
http://IP_SERVER:9001


//====================================================
// 14. LOGIN MINIO
//====================================================

username : admin
password : admin123


//====================================================
// 15. PENGUJIAN CRUD
//====================================================

// Create
Menambahkan user baru dengan nama, email, dan foto .

// Read
Menampilkan daftar user dari database.

// Update
Mengubah nama, email, atau foto user.

// Delete
Menghapus data user dari database dan file dari MinIO atau Postgres.


//====================================================
// 16. VALIDASI APLIKASI
//====================================================

// validasi input
nama wajib diisi
email harus valid

// validasi file
ukuran file maksimal 5MB

// jika file lebih dari 5MB maka upload akan ditolak oleh API


//====================================================
// 17. ARSITEKTUR MICROSERVICE
//====================================================

Frontend  -> Web interface
Backend   -> Server aplikasi
API       -> REST API CRUD
Postgres  -> Database metadata user
MinIO     -> Penyimpanan file foto

Alur data:

User Upload Foto
       │
       ▼
Frontend
       │
       ▼
API Service
       │
 ┌─────┴─────┐
 ▼           ▼
PostgreSQL   MinIO

PostgreSQL menyimpan:
- nama
- email
- URL foto

MinIO menyimpan:
- file foto 


//====================================================
// 18. KESIMPULAN
//====================================================

Aplikasi berhasil dibuat menggunakan arsitektur microservice dengan Docker Compose.

Fitur yang berhasil dibuat:

- CRUD User
- Upload Foto 
- Penyimpanan metadata di PostgreSQL
- Penyimpanan file di MinIO
- REST API port 8080
- Containerized deployment
- Validasi ukuran file maksimal 5MB
- Integrasi antar service menggunakan Docker Network
