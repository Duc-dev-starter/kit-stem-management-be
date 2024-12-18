//User Schema
const { User, validateChangePassword, validateChangeRole, validateRegisterUser, validateSearchUser, validateStatusUser, validateUpdateUser } = require('./user');

//Blog Schema
const { Blog, validateCreateBlog, validateSearchBlog, validateUpdateBlog } = require('./blog');

//Category Schema
const { Category, validateSearchCategory, validateUpdateCategory, validateCreateCategory } = require('./category');

//Kit Schema 
const { Kit, validateChangeStatusKit, validateCreateKit, validateSearchKit, validateUpdateKit } = require('./kit')

//Kit Log Schema
const { KitLog, validateCreateKitLog, validateSearchKitLog } = require('./kitLog');

//Lab Schema 
const { Lab, validateCreateLab, validateAddSupporters, validateUpdateLab, validateSearchLab } = require('./lab');

//Combo Schema 
const { Combo, validateCreateCombo, validateSearchCombo } = require('./combo')

//Review Schema 
const { Review, validateCreateReview, validateUpdateReview } = require('./review')

//Cart Schema
const { Cart, validateCreateCart, validateSearchCart } = require('./cart')

//Transaction Schema
const { Transaction } = require('./transaction')

//Purchase Schema
const { Purchase, validateSearchPurchase } = require('./purchase')

//Support Schema
const { Support } = require('./support')

module.exports = {
    User,
    validateChangePassword,
    validateChangeRole,
    validateRegisterUser,
    validateSearchUser,
    validateStatusUser,
    validateUpdateUser,
    Blog,
    validateCreateBlog,
    validateSearchBlog,
    validateUpdateBlog,
    Category,
    validateSearchCategory,
    validateUpdateCategory,
    validateCreateCategory,
    Kit,
    validateChangeStatusKit,
    validateCreateKit,
    validateSearchKit,
    validateUpdateKit,
    KitLog,
    validateSearchKitLog,
    validateCreateKitLog,
    Lab,
    validateCreateLab,
    validateAddSupporters,
    validateUpdateLab,
    validateSearchLab,
    Combo,
    validateCreateCombo,
    validateSearchCombo,
    Review,
    validateCreateReview,
    validateUpdateReview,
    Cart,
    validateSearchCart,
    validateCreateCart,
    Transaction,
    Purchase,
    validateSearchPurchase,
    Support
}