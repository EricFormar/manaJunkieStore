const fs = require('fs');
const path = require('path')
const {toThousand, } = require('../utils')
const {Product, Category, ImageProduct} = require('../database/models')

const productsController = {
    list: async (req, res) => {
        try {
            const products = await Product.findAll({
                include : ['images']
            })
            res.render('products/allProducts', { 
                products,
                title: "Mana Junkie Store",
                toThousand
            });
        } catch (error) {
            console.log(error);
        }
        
    },
    
    detail: async (req, res) => {

        try {
            const product = await Product.findByPk(req.params.id,{
                include : ['images']
            })

            return res.render('products/productDetail', {
                product,
                title: product.name,
                toThousand
            })
        } catch (error) {
            console.log(error);
            
        }
    
    },
    
    create: async (req, res) => { // GET
        
        try {
            const categories = await Category.findAll();

            return res.render('products/productAdd',{
                categories,
                title: "Vender producto"
            })

        } catch (error) {
            console.log(error);
        }
        
    }, 
    
    add: async (req, res) => { // POST
        try {
            const {name, price, discount, description, category} = req.body;

            const product = await Product.create({
                name : name.trim(),
                description : description.trim(),
                price,
                discount,
                idCategory : category
            })

            if(req.files.length) {
                req.files.forEach(async (file) => {
                    await ImageProduct.create({
                        name : file.filename,
                        idProduct : product.id
                    })
                })
               
            }

            return res.redirect('/admin')

        } catch (error) {
            console.log(error);
        }
    },

    edit: async (req, res) => {

        try {
            const { id } = req.params;

            const [product, categories] = await Promise.all([
                Product.findByPk(id,{
                    include : ['images', 'category'] 
                }),
                Category.findAll(),
            ]);

            return res.render("products/productEdit", {
                ...product.dataValues,
                categories,
                title: "Edición de producto",
                toThousand,
            });

        } catch (error) {
            console.log(error);   
        }
    },

    update: async (req, res) => {

        try {
            const {name, price, discount, description, category} = req.body;
            const {id} = req.params;path
            await Product.update(
                {
                    name : name.trim(),
                    description : description.trim(),
                    price,
                    discount,
                    idCategory : category
                },
                {
                    where : {
                        id
                    }
                }
            )

            // si cargo imagenes en el input fipo file
            if(req.files.length){
                // obtengo las imágenes de la base de datos
                const images = await ImageProduct.findAll({
                    where : {
                        idProduct : id
                    }
                });
                // elimino los archivos (físicos)
                images.forEach(image => {
                    const pathFile = path.join(__dirname,`../../public/images/products/${image.name}`)
                    fs.existsSync(pathFile) && fs.unlinkSync(pathFile)
                });

                // elimino los registros de las imágenes asociadas al producto
                await ImageProduct.destroy({
                    where :{
                        idProduct : id
                    }
                });

                // agrego las 'nuevas' imágenes
                req.files.forEach(async (file) => {
                    await ImageProduct.create({
                        name : file.filename,
                        idProduct : id
                    })
                });
            }

            return res.redirect('/admin');
            
        } catch (error) {
            console.log(error);
            
        }
    
    },
    
    
    delete: async (req, res) => {

        try {
            const {id} = req.params;
            Product.destroy({
                where : {
                    id
                }
            });
            // TODO: eliminar las imágenes asociadas
            return res.redirect('/admin?remove=true');

        } catch (error) {
            console.log(error);
            
        }

    },

    search: (req, res) => {

    }
}

module.exports = productsController;