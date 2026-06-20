import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DATABASE } from 'src/db/db.provider';
import type { DrizzleDB } from 'src/db/db.provider';
import * as bcrypt from 'bcrypt';
import { users } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE) private readonly db: DrizzleDB,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, name: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [userExists] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (userExists) {
      throw new ConflictException('Email already exist');
    }

    const [user] = await this.db
      .insert(users)
      .values({ email, name, password: hashedPassword })
      .returning();

    const refresh_token = this.signAccessToken(user);

    if (!refresh_token) {
      throw new ConflictException('not today nigga');
    }

    return this.signToken(user);
  }

  async login(email: string, password: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const { password: _, ...safeUser } = user;

    return this.signToken(safeUser);
  }

  private signToken(user: { id: number; email: string }) {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
      }),
    };
  }

  private signAccessToken(user: { email: string; id: string }) {
    return this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '15m' },
    );
  }

  private signRefreshToken(user: { id: string }) {
    return this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });
  }
}
