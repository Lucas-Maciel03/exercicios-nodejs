const User = require('../models/User')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//middlewares
const createUserToken = require('../middlewares/create-user-token')
const getToken = require('../middlewares/get-token')

module.exports = class UserController{
    static async register(req, res){
        const { name, email, phone, password, confirmpassword } = req.body

        //validations
        if(!name){
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }

        if(!email){
            res.status(422).json({ message: 'O e-mail é obrigatório' })
            return
        }

        if(!phone){
            res.status(422).json({ message: 'O número de telefone é obrigatório' })
            return
        }

        if(!password){
            res.status(422).json({ message: 'A senha é obrigatória' })
            return
        }

        if(!confirmpassword){
            res.status(422).json({ message: 'A confirmação de senha é obrigatória' })
            return
        }

        if(password !== confirmpassword){
            res.status(422).json({ message: 'As senhas não conferem' })
            return
        }

        //check if user exists
        const userExists = await User.findOne({ email: email })

        if(userExists){
            res.status(422).json({ message: 'O e-mail já está cadastrado' })
            return
        }

        //create a password
        const salt = await bcrypt.genSalt(12)
        const hashPassword = await bcrypt.hash(password, salt)
        
        //create a user
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: hashPassword,
        })

        try {
            const newUser = await user.save()

            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async login(req, res){
        const {email, password} = req.body

        if(!email){
            res.status(422).json({ message: 'O e-mail é obrigatório' })
            return
        }

        if(!password){
            res.status(422).json({ message: 'A senha é obrigatória' })
            return
        }

        //check if user exists
        const user = await User.findOne({ email: email })
        
        if(!user){
            res.status(422).json({ message: 'O e-mail não está cadastrado' })
            return
        }

        //check if password match
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            res.status(422).json({ message: 'Senha inválida' })
            return
        }
        
        await createUserToken(user, req, res)

    }

    static async checkUser(req, res){
        let currentUser

        if(req.headers.authorization){
            const token = getToken(req)
            const decoded = jwt.verify(token, 'secretapenasumteste')
            
            //esta usando o id do token que foi passado na create-user-token
            currentUser = await User.findById(decoded.id)
            
            //está zerando a senha que foi passada
            currentUser.password = undefined
        } else{
            currentUser = null
        } 

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res){
        const id = new mongoose.Types.ObjectId(req.params.id)
        const user = await User.findById(id).select("-password") //remover o password

        if(!user){
            res.status(422).json({ message: "Usuário não encontrado" })
            return
        }

        res.status(200).json({ user })
    }
}
