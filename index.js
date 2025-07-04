import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import { dbConnection } from './src/DB/connection.js'
import productRouter from './src/modules/product/product.routes.js'
import customerRouter from './src/modules/customer/customer.routes.js'
config({path: path.resolve('./config/.env')})


const app = express()
const port = process.env.PORT
app.use(express.json())
app.use(cors());
app.use(morgan('dev'));

dbConnection


app.use('/api/v1/product', productRouter)
app.use('/api/v1/customer', customerRouter)

app.get('/', (req, res) => res.send('Hellow fawry task!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


