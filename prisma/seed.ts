import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.businessHours.deleteMany();
  await prisma.businessHours.createMany({
    data: [
      { weekday: 0, startTime: "09:00", endTime: "19:00", closed: false }, // ראשון
      { weekday: 1, startTime: "09:00", endTime: "19:00", closed: false }, // שני
      { weekday: 2, startTime: "09:00", endTime: "19:00", closed: false }, // שלישי
      { weekday: 3, startTime: "09:00", endTime: "19:00", closed: false }, // רביעי
      { weekday: 4, startTime: "09:00", endTime: "19:00", closed: false }, // חמישי
      { weekday: 5, startTime: "09:00", endTime: "14:00", closed: false }, // שישי
      { weekday: 6, startTime: "00:00", endTime: "00:00", closed: true }, // שבת
    ],
  });

  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: [
        {
          name: "טיפול פנים קלאסי",
          description: "ניקוי עמוק, פילינג ומסכה מותאמת לסוג העור.",
          durationMin: 60,
          price: 180,
        },
        {
          name: "מניקור ג'ל",
          description: "טיפוח ולק ג'ל עמיד לשבועות.",
          durationMin: 45,
          price: 120,
        },
        {
          name: "עיצוב גבות",
          description: "עיצוב והתאמה אישית לצורת הפנים.",
          durationMin: 20,
          price: 70,
        },
      ],
    });
  }

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.createMany({
      data: [
        {
          name: "קרם לחות יומי",
          description: "קרם לחות קל להרכב יומיומי לכל סוגי העור.",
          price: 95,
          stock: 20,
        },
        {
          name: "סרום ויטמין C",
          description: "סרום מבהיר ומחזק לעור זוהר.",
          price: 140,
          stock: 15,
        },
        {
          name: "קרם הגנה SPF50",
          description: "הגנה יומיומית מפני קרינת UV.",
          price: 110,
          stock: 25,
        },
      ],
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
