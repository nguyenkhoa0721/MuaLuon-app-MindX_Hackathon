# Giới thiệu chung!

MuaLuon - Giúp người bán hàng truyền thống dễ dàng tiếp cận và phục vụ được tệp khách hàng lớn hơn, duy trì được mặt lợi không thể thay thế trong mua dịch Covid, mà thời kì Bình thường hóa.

# Setup

## Setup ...

Cài đặt thư viện cho 2 folder backend và frontend

    npm install

## Khởi chạy Back End
Setup enableCrossDomain trong file app.js

    app.use(cors({ credentials: true, origin: "#url" })
Chạy server tại localhost:3000

    npm start

## Khởi chạy Front End
Set up đường dẫn đến server ở router.js và cho axios tại main.js.

    store.state.server="#url"
    axios.defaults.baseURL="#url"

Chạy build với hot reload tại localhost:8080

    npm run dev

# Các thư viện, framework sử dụng
## BackEnd
NodeJS - Chạy JS trên phía Server
Express - Tạo Server, API
MongoDB, Mongoose - Quản lý database
FireBase - Realtime database
Các thư viện bảo mật: helmet, mogoSantitize, morgan, xss, cors,...
> Deploy với Heroku
## FrontEnd
VueJS, VueX
Element UI, Bootstrap
> Deploy với Vercel

