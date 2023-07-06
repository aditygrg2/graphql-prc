const bcrypt = require("bcryptjs")
const Product = require('../../models/product')
const User = require('../../models/user')
const mongoose = require('../../config/mongoose')
const Order = require('../../models/order')
const jwt = require('jsonwebtoken')
const DataLoader = require("dataloader")

const eventLoader = new DataLoader((user_ids) => {
  return allResolvers.products(user_ids);
});

const userLoader = new DataLoader((user_ids) => {
  return User.find({_id: {$in: user_ids}})
  // DataLoader always takes a user id, or maybe any kind of identifier, always!
})
// This can be exported to different files for code refactoring and using destructuring to get it again.

const allResolvers = {
  // This will run as a resolver for events in RootQuery

  // Please make sure the name you are using here is same as you defined in your schema
  products: async ({user_id}) => {
    const products = await Product.find({user_id: user_id});

    console.log(products);

    return products;
  },
  createProduct: async (args) => {
    // Incase you forget + helps to convert to float.
    console.log(args)
    try {
      const product = await Product.create({
        title: args.productInput.title,
        description: args.productInput.description,
        price: args.productInput.price,
        user_id: args.productInput.user_id
      });

      await product.save();

      console.log(product);
      return product;
    } catch (err) {
      console.log(err);
    }
  },
  createUser: async (args) => {
    return await User.findOne({ email: args.userInput.email }).then((user) => {
      if (user) {
        // This error is automatically sent to res.
        throw new Error("User already exists");
      }
      return bcrypt
        .hash(args.userInput.password, 12)
        .then((hashedPassword) => {
          return User.create({
            email: args.userInput.email,
            password: hashedPassword,
            businessName: args.userInput.businessName ?? "",
          });
        })
        .then((user) => {
          // setting password as null forces to send it as null.
          return {
            email: user.email,
            password: null,
            _id: user._id,
            businessName: user.businessName,
          };
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  createOrder: async (args, req) => {
    if(!req.auth){
      throw new Error('Authenticated')
    }
    const order = await Order.create({
        products: args.orderInput.products._id,
        ordererName: args.orderInput.ordererName, 
        status: "PLACED",
        orderDate: new Date().getTime().toString()
    });

    await order.save();
    return order;
  },
  getOrder: async (args) => {
    const order = await Order.findById(args.id);

    if(!order){
        throw new Error("No order found!");
    }

    return order;
  },
  order: async () => {
    const order = await Order.find()
    return await Order.find();
  },
  login: async ({email, password}) => {
    const user = await User.findOne({email: email});

    if(!user){
      throw new Error('User does not exist');
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if(!isEqual){
      throw new Error('Password is incorrect!');
    }

    const token = jwt.sign({userId: user.id, email: user.email}, 'radheradhe', {
      expiresIn: '1h'
    })

    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1
    }
  }
}

module.exports = {...allResolvers};
