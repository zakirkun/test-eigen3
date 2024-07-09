const MemberController = require('../controllers/member');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/books/borrow:
 *   post:
 *     summary: Borrow a book
 *     description: Allows a member to borrow a book. Conditions include not exceeding 2 borrowed books, availability of the book, member not being penalized, and the book not being borrowed by another member.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               member_code:
 *                 type: string
 *                 description: Member's unique code.
 *               book_code:
 *                 type: string
 *                 description: Book's unique code.
 *     responses:
 *       200:
 *         description: Successful response. Returns borrowing details.
 *       400:
 *         description: Bad request. Invalid member or book code, or borrowing conditions not met.
 *       404:
 *         description: Member or book not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/books/borrow", MemberController.borrowBook);

/**
 * @swagger
 * /api/books/return:
 *   post:
 *     summary: Return a borrowed book
 *     description: Allows a member to return a book that they have borrowed. If the book is returned after more than 7 days, the member will be penalized.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               member_code:
 *                 type: string
 *                 description: Member's unique code.
 *               book_code:
 *                 type: string
 *                 description: Book's unique code.
 *     responses:
 *       200:
 *         description: Successful response. Returns borrowing details.
 *       400:
 *         description: Bad request. Invalid member or book code, or the book is not borrowed by the member.
 *       404:
 *         description: Member or book not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/books/return", MemberController.returnBook);

/**
 * @swagger
 * /api/member/list:
 *   get:
 *     summary: Check members and their borrowed books
 *     description: Retrieve details of all existing members and the number of books each member has currently borrowed.
 *     responses:
 *       200:
 *         description: Successful response. Returns list of members with their borrowing records.
 *       500:
 *         description: Internal server error.
*/
router.get("/member/list", MemberController.getAllMember);

/**
 * @swagger
 * /api/books/list:
 *   get:
 *     summary: Check books availability
 *     description: Retrieve all existing books and their quantities, excluding books currently borrowed.
 *     responses:
 *       200:
 *         description: Successful response. Returns list of books with their current stock.
 *       500:
 *         description: Internal server error.
 */
router.get("/books/list", MemberController.checkAllBook);

/**
 * @swagger
 * /api/members/{code}:
 *   get:
 *     summary: Get details of a member including borrowing records
 *     description: Retrieve details of a specific member by their code, including information about books borrowed by the member.
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Member code to retrieve details
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response. Returns member details including borrowing records.
 *       404:
 *         description: Member not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/members/:code", MemberController.detailMember);

/**
 * @swagger
 * /api/books/{code}:
 *   get:
 *     summary: Get details of a book including borrowing records
 *     description: Retrieve details of a specific book by its code, including information about members who have borrowed it.
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Book code to retrieve details
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response. Returns book details including borrowing records.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/books/:code", MemberController.detailBook);


module.exports = router;