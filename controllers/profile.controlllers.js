const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../libs/imagekit");
const path = require("path");

module.exports = {
  updateProfile: async (req, res, next) => {
    try {
      const { first_name, last_name, brith_date } = req.body;
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Missing file",
          data: null,
        });
      }

      const file = req.file.buffer.toString("base64");

      if (!first_name || !last_name || !brith_date) {
        return res.status(400).json({
          success: false,
          message: "Missing first_name, last_name, brith_date, profile_picture",
          data: null,
        });
      }

      const { url } = await imagekit.upload({
        file,
        fileName: Date.now() + path.extname(file.originalname),
        folder: "/images",
      });

      const user = await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          profile: {
            upsert: {
              create: {
                first_name,
                last_name,
                brith_date: new Date(brith_date).toISOString(),
                profile_picture: url,
              },
              update: {
                first_name,
                last_name,
                brith_date: new Date(brith_date).toISOString(),
                profile_picture: url,
              },
            },
          },
        },
      });
      res.status(201).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      next(err);
    }
  },
  authenticate: async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: false,
          message: "Not authenticated",
          data: null,
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id,
          include: {
            profile: true,
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "User authenticated successfully",
        data: user,
      });

      res.status(200).json({
        success: true,
        message: "User authenticated successfully",
        data: {
          first_name: user.profile.first_name,
          last_name: user.profile.last_name,
          email: user.email,
          birth_date: user.profile.birth_date,
          profile_picture: user.profile.profile_picture,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
