import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
}

async function main() {
    // Create Users
    const users = Array.from({ length: 10 }).map(() => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        bio: faker.lorem.sentence(),
        avatar: faker.image.avatar(),
        password: faker.internet.password(), // Added password field
    }));

    await prisma.user.createMany({
        data: users,
    });

    // Create Tags
    const tags = Array.from({ length: 5 }).map(() => ({
        name: faker.lorem.word(),
    }));

    await prisma.tag.createMany({
        data: tags,
    });

    // Create Posts
    const posts = Array.from({ length: 40 }).map(() => ({
        title: faker.lorem.sentence(),
        slug: generateSlug(faker.lorem.sentence()),
        content: faker.lorem.paragraphs(3),
        thumbnail: faker.image.urlLoremFlickr(),
        authorId: faker.number.int({ min: 1, max: 10 }),
        published: true,
    }));

    await Promise.all(
        posts.map(async (post) => {
            const createdPost = await prisma.post.create({
                data: {
                    ...post,
                    comments: {
                        createMany: {
                            data: Array.from({ length: 20 }).map(() => ({
                                content: faker.lorem.sentence(),
                                authorId: faker.number.int({ min: 1, max: 10 }),
                            })),
                        },
                    },
                    tags: {
                        connect: Array.from({ length: 3 }).map(() => ({
                            id: faker.number.int({ min: 1, max: 5 }), // Connect to random tags
                        })),
                    },
                    likes: {
                        createMany: {
                            data: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }).map(() => ({
                                userId: faker.number.int({ min: 1, max: 10 }), // Random user likes the post
                            })),
                        },
                    },
                },
            });
            return createdPost;
        })
    );

    console.log('Seeding Completed!');
}

main()
    .then(() => {
        prisma.$disconnect();
        process.exit(0);
    })
    .catch((error) => {
        prisma.$disconnect();
        console.error(error);
        process.exit(1);
    });