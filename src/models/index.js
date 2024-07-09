const BookModel = require("./books");
const BorrowModel = require("./borrow");
const MemberModel = require("./member");

// Define associations
BookModel.hasMany(BorrowModel, { foreignKey: 'code_book', sourceKey: 'code' });
BorrowModel.belongsTo(BookModel, { foreignKey: 'code_book', targetKey: 'code' });

MemberModel.hasMany(BorrowModel, { foreignKey: 'code_member', sourceKey: 'code' });
BorrowModel.belongsTo(MemberModel, { foreignKey: 'code_member', targetKey: 'code' });

module.exports = {
    BookModel,
    MemberModel,
    BorrowModel
}