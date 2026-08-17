import prisma from "../config/prisma.js";

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User identity not found in token" });
    }

    const { name, avatarUrl, favoriteBurger } = req.body;

    // Build update data only with fields actually sent
    const updateData = {};
    if (name && name.trim()) updateData.name = name.trim();
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (favoriteBurger !== undefined) updateData.favoriteBurger = favoriteBurger;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatarUrl: updatedUser.avatarUrl,
      favoriteBurger: updatedUser.favoriteBurger,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    res.status(500).json({ message: "Server error", detail: error.message });
  }
};
