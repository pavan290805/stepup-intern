import { comparePassword, generateAccessToken, generateRefreshToken, hashPassword } from '@/lib/auth';
import { LoginInput, RegisterInput } from '@/lib/validations';
import User, { IUser } from '@/models/User';

export const authService = {
  async register(input: RegisterInput): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await User.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role,
    });

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  },

  async login(input: LoginInput): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const user = await User.findOne({ email: input.email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  },

  async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await User.findOne({ refreshToken: token });

    if (!user) {
      throw new Error('Invalid refresh token');
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
  },

  async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  },

  async getCurrentUser(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  },
};
