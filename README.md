# Backend Api

Backend library test Eigen Dev

## Prasyarat

Pastikan Anda telah menginstal alat-alat berikut:
- [Node.js](https://nodejs.org/) - versi minimum 20.x.x
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Instalasi
1. **clone repository:**
    ```bash
    git clone https://github.com/zakirkun/test-eigen3 backend-dev
    ```
    ```bash
    cd backend-dev
    ```

2. **Jalankan database menggunakan Docker Compose:**
    ```bash
    docker-compose up --build -d
    ```

3. **Import database di phpmyadmin: [PhpmyAdmin](http://localhost:8080/index.php)

4. **Lakukan instalansi library api**
    ```bash
    npm i
    ```
5. **Jalankan program**
    ```bash
    npm start
    ```