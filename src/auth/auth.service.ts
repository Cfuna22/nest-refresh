import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DATABASE } from 'src/db/db.provider';
import * as bcrypt from 'bcrypt';
import { users } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE) private readonly db: any,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, name: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await this.db
      .insert(users)
      .values({ email, name, password: hashedPassword })
      .returning();

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
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user);
  }

  private signToken(user: any) {
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
