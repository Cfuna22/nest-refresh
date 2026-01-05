import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE } from 'src/db/db.provider';
import { users } from 'src/db/schema';

@Injectable()
export class UsersService {
    constructor(
        @Inject(DATABASE) private readonly db: any,
    ) {}

    findAll() {
        return this.db.select().from(users);
    }

    findOne(id: number) {
        return this.db.select().from(users).where(eq(users.id, id));
    }

    create(data: { email: string; name: string }) {
        return this.db.insert(users).values(data).returning();
    }

    update(id: number, updateData: Partial<{ email: string, name: string }>) {
        return this.db.update(users).set(updateData).where(eq(users.id, id)).returning();
    }
}
