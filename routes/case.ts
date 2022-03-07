import express from 'express';
import { body, param, check } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { create, deleteCase, getAll, answer } from '../functions/api/case';
import { authorizePls, validationCheck } from '../common/middlewares';
const router = express.Router();

router.post("/create",
    body("name").optional().isString().trim().notEmpty(),
    body("content")
        .exists().withMessage("is required")
        .isString().withMessage("should be a string")
        .trim()
        .notEmpty().withMessage("should be a non-empty string"),
    body("email").trim().isEmail().optional().withMessage("should be an email address"),
    body("phone").trim().isString().optional(),
    check("contactMethod").custom((value, { req }) => {
        if (value === "email" && !req.body.email) return false;
        if (value === "phone" && !req.body.phone) return false;
        return true;
    }).withMessage("email or phone is missing"),
    body("contactMethod")
        .exists().withMessage("is required")
        .isString().withMessage("should be a string")
        .trim()
        .isIn(["no", "irl", "phone", "email"]).withMessage("should be one of 'irl', 'phone', 'email' and 'no'"),
    validationCheck,
async (req, res) => {

    const { content, contactMethod, email, phone, name } = req.body;

    create(name, content, contactMethod, email, phone)
    .then(async createdCase => res.status(StatusCodes.CREATED).json(createdCase))
    .catch (error => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error));
});

router.get("/all",
    authorizePls,
async (req, res) => {
    getAll()
    .then(result => res.status(StatusCodes.OK).json(result))
    .catch(err => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err));
});

// Answer via email and delete case from database.
router.post("/answer/:id",
    authorizePls,
    param("id").isInt(),
    body("content").trim().isString(),
    body("original").trim().isString(),
    validationCheck,
async (req, res) => {
    const id = Number(req.params.id);
    const { content, original } = req.body;
    console.log(req.body)
    answer(id, content, original, req.user!)
    .then(result => res.status(StatusCodes.OK).json(result))
    .catch(err => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err));
});

// Delete case
router.delete("/:id",
    authorizePls,
    param("id").isInt(),
    validationCheck,
async (req, res) => {
    const id = Number(req.params.id);
    deleteCase(id)
    .then(result => res.status(StatusCodes.OK).json(result))
    .catch(err => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err));
});

export default router;