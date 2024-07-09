const { BorrowModel, BookModel, MemberModel } = require('../models');
const database = require('../database/database');

const MemberController = {
    borrowBook : async (req, res) => {
        const { member_code, book_code } = req.body;
        const transaction = await database.transaction();

        try {

            if(member_code == undefined || book_code == undefined) {
                return res.json({
                    error: "Invalid input"
                });
            }

            // Check if the member is currently penalized
            const member = await MemberModel.findOne({ where: { code: member_code }, transaction });
            if (!member || (member.penaltyEndDate && member.penaltyEndDate > new Date())) {
                return res.status(400).json({ error: 'Member is currently penalized or does not exist.' });
            }

            // Check if the member has already borrowed 2 books
            const borrowedBooksCount = await BorrowModel.count({
                where:{ code_member: member_code , status: 'NOT_RETURNED' },
                transaction
            });
            if (borrowedBooksCount >= 2) {
                return res.status(400).json({ error: 'Member has already borrowed 2 books.' });
            }

            // Check if the book is already borrowed by another member
            const bookBorrowed = await BorrowModel.findOne({ where: { code_book: book_code, status: 'NOT_RETURNED' }, transaction });
            if (bookBorrowed) {
                return res.status(400).json({ error: 'Book is already borrowed by another member.' });
            }

             // Check if there are available copies of the book
            const book = await BookModel.findOne({ where: { code: book_code }, transaction });
            if (!book || book.stock <= 0) {
                 return res.status(400).json({ error: 'No available copies of the book.' });
            }

            // Borrow the book
            await BorrowModel.create({
                code_book: book_code,
                code_member: member_code,
                borrowDate: new Date(),
                status: 'NOT_RETURNED',
                createdAt: new Date()
            }, { transaction });

            // Decrement the book stock
            await book.update({ stock: book.stock - 1 }, { transaction });

            await transaction.commit();
            res.status(201).json({ message: 'Book borrowed successfully.' });

        // Borrow the book
        } catch(error) {
            await transaction.rollback();
            console.log(error.message);
            res.status(500).json({ error: 'An error occurred while borrowing the book.' });
        }
    },

    returnBook: async (req, res) => {

        const { member_code, book_code } = req.body;
        const transaction = await database.transaction();

        try {
            // Find the borrow record
            const borrowRecord = await BorrowModel.findOne({
                where: {
                    code_member: member_code,
                    code_book: book_code,
                    status: 'NOT_RETURNED'
                },
                transaction
            });

            if (!borrowRecord) {
                return res.status(400).json({ error: 'No matching borrow record found.' });
            }

            // Check if the book is being returned after more than 7 days
            const borrowDate = new Date(borrowRecord.created_at);
            const returnDate = new Date();
            const diffTime = Math.abs(returnDate - borrowDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 7) {
                // Apply penalty to the member
                const penaltyEndDate = new Date();
                penaltyEndDate.setDate(penaltyEndDate.getDate() + 3);
                await MemberModel.update(
                    { penaltyEndDate },
                    { where: { code: member_code }, transaction }
                );
            }

             // Update borrow record status to returned
            await borrowRecord.update({ status: 'RETURNED' }, { transaction });

            // Increment the book stock
            const book = await BookModel.findOne({ where: { code: book_code }, transaction });
            await book.update({ stock: book.stock + 1 }, { transaction });

            await transaction.commit();
            res.status(200).json({ message: 'Book returned successfully.' });

        } catch (error) {
            await transaction.rollback();
            console.log(error.message);
            res.status(500).json({ error: 'An error occurred while returning the book.' });
        }
    },

    checkAllBook: async(req, res) => {

        try {
            const books = await BookModel.findAll({
                include: [{
                    model: BorrowModel,
                    attributes: ['id'],
                    where: { status: 'NOT_RETURNED' },
                    required: false,
                }],
            });

            const result = books.map(book => {
                const borrowedCount = book.Borrows.length;
                const availableStock = book.stock - borrowedCount;
                return {
                    code: book.code,
                    title: book.title,
                    author: book.author,
                    availableStock: availableStock >= 0 ? availableStock : 0,
                    stock: book.stock
                };
            });

            res.status(200).json(result);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: 'An error occurred while fetching books data.' });
        }
    },
    getAllMember: async (req, res) => {
        try {
            const members = await MemberModel.findAll({
                attributes: ['code', 'name'],
                include: [{
                    model: BorrowModel,
                    attributes: ['id'],
                    where: { status: 'NOT_RETURNED' },
                    required: false,
                }],
            });

            const result = members.map(member => {
                return {
                    code: member.code,
                    name: member.name,
                    borrowedBooksCount: member.Borrows.length
                };
            });

            res.status(200).json(result);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: 'An error occurred while fetching members data.' });
        }
    },
    detailMember: async (req, res) => {
        const memberCode = req.params.code;

        try {
            const member = await MemberModel.findOne({
                where: { code: memberCode },
                include: [{
                  model: BorrowModel,
                  include: [{
                    model: BookModel,
                    attributes: ['code', 'title', 'author']
                  }], 
                  attributes: ['status']
                }]
            });

            if (!member) {
                return res.status(404).json({ error: 'Member not found.' });
            }

            res.status(200).json(member);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: 'An error occurred while fetching member details.' });
        }
    },
    detailBook: async (req, res) => {
        const bookCode = req.params.code;

        try {
            const book = await BookModel.findOne({
                where: { code: bookCode },
                include: [{
                  model: BorrowModel,
                  include: [MemberModel],
                  attributes: ['status']
                }]
            });

            if (!book) {
                return res.status(404).json({ error: 'Book not found.' });
            }

            res.status(200).json(book);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: 'An error occurred while fetching book details.' });
        }
    }
};

module.exports = MemberController;