const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const SALT_ROUNDS = 12;

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw {
      statusCode: 500,
      message: "JWT_SECRET is not configured on the backend",
    };
  }
  return secret;
};

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const validateCredentials = ({ fullName, email, password, requireName }) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedName = String(fullName || "").trim();

  if (requireName && !normalizedName) {
    throw { statusCode: 400, message: "Full name is required" };
  }

  if (!normalizedEmail) {
    throw { statusCode: 400, message: "Email is required" };
  }

  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    throw { statusCode: 400, message: "A valid email is required" };
  }

  if (!password || String(password).length < 8) {
    throw {
      statusCode: 400,
      message: "Password must be at least 8 characters long",
    };
  }

  return { normalizedEmail, normalizedName };
};

const signTokenForUser = (user) => {
  const secret = getJwtSecret();

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.fullName,
    },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};

const formatUser = (row) => ({
  id: row.id,
  email: row.email,
  fullName: row.full_name,
  createdAt: row.created_at,
});

const signup = async ({ fullName, email, password }) => {
  const { normalizedEmail, normalizedName } = validateCredentials({
    fullName,
    email,
    password,
    requireName: true,
  });

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  let createdUser;

  try {
    const insertResult = await pool.query(
      `
        INSERT INTO users (full_name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, full_name, email, created_at
      `,
      [normalizedName, normalizedEmail, hashedPassword],
    );

    createdUser = insertResult.rows[0];
  } catch (error) {
    if (error?.code === "23505") {
      throw { statusCode: 409, message: "An account with this email already exists" };
    }

    throw error;
  }

  const user = formatUser(createdUser);
  const token = signTokenForUser(user);

  return { token, user };
};

const login = async ({ email, password }) => {
  const { normalizedEmail } = validateCredentials({
    email,
    password,
    requireName: false,
  });

  const userResult = await pool.query(
    `
      SELECT id, full_name, email, password_hash, created_at, is_active
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [normalizedEmail],
  );

  const row = userResult.rows[0];

  if (!row || !row.is_active) {
    throw { statusCode: 401, message: "Invalid email or password" };
  }

  const isMatch = await bcrypt.compare(password, row.password_hash);

  if (!isMatch) {
    throw { statusCode: 401, message: "Invalid email or password" };
  }

  await pool.query(
    `
      UPDATE users
      SET last_login_at = NOW(), updated_at = NOW()
      WHERE id = $1
    `,
    [row.id],
  );

  const user = formatUser(row);
  const token = signTokenForUser(user);

  return { token, user };
};

module.exports = {
  signup,
  login,
};
